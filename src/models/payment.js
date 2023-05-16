const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const PaymentSchema = new Schema({
    orderId: { type: ObjectId, ref: 'order', required: false },
    status: { type: String, required: false, enum: ['PENDING', 'FAILED', 'SUCCESS', 'CANCELLED'] }, 
    type: { type: String, required: false, enum: ['WALLET_TOPUP','ORDER_PAYMENT']},
    method: { type: String, required: false, enum: ['CASH', 'WALLET', 'RAZORPAY', 'CASHFREE']  },
    amount: { type: Number, required: true },
    paymentId: { type: String, required: false },//Payment Gateway Reference Id, null for cash payments
    customerId: { type: ObjectId, ref: 'customer', required: true },
    createdBy: { type: ObjectId, required: false },
    details: {
        membershipId: {type: ObjectId, ref: 'membership', required: false },
    }
},  { timestamps: true });

/*
PaymentSchema.pre('save', function(next) {
    var doc = this;
    if (this.isNew) {
        payment.count().then(res => {
            this.paymentId = res; // Increment count
            next();
        });
    } else {
        next();
    }
});
*/
PaymentSchema.set('toObject', {
    virtuals: true
});

PaymentSchema.set('toJSON', {
    virtuals: true
});


module.exports = mongoose.model('payment', PaymentSchema);