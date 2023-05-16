
const Order = require('../models/order');
const RazorPay = require('../models/razorpay');
const Utils = require('../utils/app.utils');
const Transaction = require('../models/transaction').Transaction;
const Customer = require('../models/customer');
const Payment = require('../models/payment')
const Wallet = require('../models/wallet');
const WalletLogs = require('../models/walletlog');

require('dotenv').config();

const razorPaySecret = process.env.RAZORPAY_SECRET;

var Razorpay = require('razorpay');
var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

var PaymentController = function () {
    var self = this;

    this.generatePaymentLink = async function (request, reply) {
        //Sample request payload
        
        try {
            let payload = {
                "type": "link",
                "view_less": 1,
                //"amount": 670042,
                "currency": "INR",
                //"description": "Payment Link for this purpose - cvb.",
                "receipt": "TS91",
                //"reminder_enable": false,
                "sms_notify": 1,
                "email_notify": 1,
                "expire_by": 1793630556,
                //"callback_url": "https://example-callback-url.com/",
                "callback_method": "get"
            };
            //Validate credit plan
            let amount = request.body.amount;
        
            const customerInfo = await Customer.findById(request.body.customerId);
            const orderCount = await Payment.find().countDocuments();
            //const orderInfo = await Order.findById(request.body.orderId)
            const type = request.body.type;
            const orderId = type == 'ORDER_PAYMENT' ? request.body.orderId : null;
            let customer = {
                "name": customerInfo.firstName + ' ' + customerInfo.lastName,
                "email": customerInfo.email,
                "contact": customerInfo.mobileNumber
            }
            payload.customer = customer;
            payload.amount = amount * 100;
            payload.description = type == 'ORDER_PAYMENT' ? 'Payment Link for order '+orderInfo._id: 'Payment Link for wallet topup';
            payload.receipt = 'LA-INVOICE001-'+(orderCount+1);
            
            //console.log('Requesting payment link generation', payload);
            instance.invoices.create(payload).then(async response => {
                
                let paymentObj = {
                    orderId: orderId,
                    status: 'PENDING', 
                    type: type,
                    method: 'RAZORPAY',
                    amount: request.body.amount,
                    customerId: request.body.customerId,
                    paymentId: response.id
                }
                if(type == 'WALLET_TOPUP') {
                    paymentObj['details'] = {
                        membershipId: request.body.membershipId
                    } 
                }
                let payment = new Payment(paymentObj);

                await payment.save();

                const respObj = {
                    txnId: response.id,
                    status: "success",
                    response: JSON.stringify(response)
                }
                await new RazorPay(respObj).save();
                let o = {
                    orderId: orderId,
                    amount: request.body.amount,
                    paymentLink: response.short_url
                }

                return Utils.sendReply(200, "Payment link created", reply, o); 

            }).catch((errorResp) => {
                console.log('Payment link error',errorResp);
                const errorMessage = "Error creating payment link: " + (errorResp.error && errorResp.error.description ? errorResp.error.description : '')
                return Utils.sendReply(400, errorMessage, reply, errorResp.error); 
            })
        } catch(e){
            console.log('Error', e)
        }
    }

    

    this.updatePayment = async function (request, reply) {
        try{
            //validate the signature
            console.log('Recieved respose from Razorpay',  request.body.event, )
            const signature = request.headers['x-razorpay-signature'];
            if(Razorpay.validateWebhookSignature(JSON.stringify(request.payload), signature, razorPaySecret)) {
                //console.log('Error:Razorpay:webhook:updatePayment:123', 'Signature valid');
                //check payment status
                let razorPayResponse = request.payload;
                if(razorPayResponse.event == 'payment.authorized') {
                    let payload = razorPayResponse.payload.payment.entity;
                    if(payload.status == 'authorized') {
                        let paymentInfo = await Payment.findOne({'paymentId': payload.order_id});
                        //console.log('Logs:Razorpay:webhook:updatePayment:orderDetails', orderDetails, payload.order_id)
                        //Check if duplicate payment response
                        const txn = await Transaction.find({'invoiceNo': payload.invoice_id,'paymentId': payload.id,'razorPayOrderId': payload.order_id});
                        console.log('Exist txn', txn)
                        if(txn.length == 0) {
                            let txnObj = {
                                //companyId: { type: Schema.Types.ObjectId, ref: 'company', required: true },
                                customerId: paymentInfo.customerId,
                                //storeId: { type: Schema.Types.ObjectId, ref: 'store', required: false },
                                amount: paymentInfo.amount,
                                invoiceNo: payload.invoice_id,
                                paymentId: payload.id,
                                razorPayOrderId: payload.order_id,
                                transactionType: 'Payment',
                                orderId: paymentInfo.orderId
                            }
                            await Payment.updateOne({'paymentId': payload.order_id}, {status: 'SUCCESS'});
                            const transaction = new Transaction(txnObj);
                            transaction.save( async (error, txn) => {
    
                                if (error) {
                                    console.error('Error:Razorpay:webhook:updatePayment', error);
                                    //logger.error(error);
                                }
                                const respObj = {
                                    txnId: payload.id,
                                    status: payload.status, 
                                    response: JSON.stringify(razorPayResponse)
                                }
                                await new RazorPay(respObj).save();
                                if(paymentInfo.type == 'WALLET_TOPUP') {
                                    await self.topupWallet(paymentInfo, txn, req.user);
                                } else {
                                    const orderPayment = [{
                                        date: new Date(),
                                        amount: paymentInfo.amount,
                                        method: 'Razorpay'
                                    }];
                                    let order = await Order.findById(paymentInfo.orderId );
                                    const balance = parseFloat(order.balance) - parseFloat(paymentInfo.amount)
                                    await Order.updateOne({ _id: paymentInfo.orderId }, { 'balance': balance, $push: { payments: orderPayment } });
                                }
                                
                                return Utils.sendReply(200, 'Updated order', reply); 
                            });
                        } else {
                            //logger.error('Error:Razorpay:webhook:updatePayment', {'error': 'Duplicate payment'});
                            console.error('Error:Razorpay:webhook:updatePayment', 'Duplicate payment');
                            return Utils.sendReply(500, 'Duplicate payment', reply); 
                        }
                        
                    } else {
                        await Order.updateOne({'razorpayOrderId': payload.order_id}, {status: payload.status});
                        const respObj = {
                            txnId: payload.id,
                            status: payload.status, 
                            response: JSON.stringify(razorPayResponse)
                        }
                        await new RazorPay(respObj).save();
                        return Utils.sendReply(500, 'Invalid payment response', reply); 
                    }
                }
            } else {
                const respObj = {
                    txnId: payload.id,
                    status: 'invalidSignature', 
                    response: JSON.stringify(razorPayResponse)
                }
                //logger.error('invalidSignature',respObj);
                await new RazorPay(respObj).save();
                console.error('Error:Razorpay:webhook:updatePayment:156', 'Signature doesn not match');
                return Utils.sendReply(500, 'Signature doesn not match', reply); 
            }
        }catch(e){
            //logger.error(e);
            console.error('Error:Razorpay:webhook:updatePayment:163', e);
            const respObj = {
                txnId:  null,
                status: 'internalError', 
                response: JSON.stringify(e)
            }
            await new RazorPay(respObj).save();
            return Utils.sendReply(500, 'internalError', reply); 
        }
        
        //get the order details

        //update credits
    }

    this.topupWallet = async function(payment, transaction, user) {
        let walletObj = {
            customerId: payment.customerId,
            transactionId: transaction._id,
            amount: payment.amount,
            type: 'CASH',
            description: 'Wallet topup',
            createdBy: user._id,
            createdType: user.userType,
            membershipId: payment.details.membershipId
        }
        const wallet = new Wallet(walletObj);
        await wallet.save();


    }

    this.fetchOrders = async function (request, reply) {
        //query = Utils.prepareQuery(request.query);
        try{
            let sortBy ='createdOn';
            let sortOrder = 1;
            let query  = Utils.removeInvalidKeys(request.query);
           
            let limit = parseInt(request.query.limit) || 0; 
            let skip = ((parseInt(request.query.page)-1) * limit)|| 0;

            Order.find(query)
            .limit(limit)
            .skip(parseInt(skip))
            .sort({[sortBy]: sortOrder})
            .exec((error, orders) => {
                if (error) {
                    //logger.error(error);
                    return Utils.sendReply(500, "Error reading orders", reply); 
                }
                return Utils.sendReply(200, "Order read successful" , reply, orders); 
            }); 
        }catch(e){
            console.log('Error', e)
            //logger.error(e);
        }        
    }

    this.fetchRazorpayTransactions = async function (request, reply) {
        //query = Utils.prepareQuery(request.query);
        try{
            let sortBy ='createdOn';
            let sortOrder = 1;
            let query  = Utils.removeInvalidKeys(request.query);
           
            let limit = parseInt(request.query.limit) || 0; 
            let skip = ((parseInt(request.query.page)-1) * limit)|| 0;

            RazorPay.find(query)
            .limit(limit)
            .skip(parseInt(skip))
            .sort({[sortBy]: sortOrder})
            .exec((error, orders) => {
                if (error) {
                    return Utils.sendReply(500, "Error reading orders", reply); 
                }
                return Utils.sendReply(200, "Order read successful" , reply, orders); 
            }); 
        }catch(e){
            console.log('Error', e)
        }        
    }
    

}
module.exports = new PaymentController();


