const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    //companyId: { type: Schema.Types.ObjectId, ref: 'company', required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'customer', required: false },
    //storeId: { type: Schema.Types.ObjectId, ref: 'store', required: false },
    orderId: { type: Schema.Types.ObjectId, ref: 'order', required: true },
    amount: { type: Number, required: true },
    invoiceNo: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
    transactionType: { type: String, required: true, enum: ['Payment', 'Refund']},
    paymentMethod: { type: String, required: true},
    status: { type: String, required: true , enum: ['pending', 'completed', 'rejected', 'canceled']},
    
});
/*
    Transaction Types
    ===============
    D - Debit by placing proposals
    C - Credit by purchase
    AC - Credit by Agent 
    AD - Debit by Agent( This is a self debit since agent distributes to agent users)
*/

/*
TransactionSchema.virtual('request', {
    ref: 'request',
    localField: 'requestId',
    foreignField: '_id',
    justOne: true
});
*/

TransactionSchema.virtual('order', {
    ref: 'order',
    localField: 'orderId',
    foreignField: '_id',
    justOne: true
});

TransactionSchema.set('toObject', {
    virtuals: true
});

TransactionSchema.set('toJSON', {
    virtuals: true
});


var TransactionModel = mongoose.model('transaction', TransactionSchema);

module.exports = { Transaction: TransactionModel };
