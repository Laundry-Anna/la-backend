const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const walletLogSchema = new mongoose.Schema(
  {
    customerId: {type: ObjectId, ref: 'customer', index: true},
    transactionId: {type: ObjectId, ref: 'transaction', index: true},
    amount: { type: Number, required: true },
    type: { type: String, required: true, enum: ['CASH', 'PROMOTION', 'CASHBACK', 'MEMBERSHIP', 'REFFERAL'], default: 'CASH'}, //walletLog type
    transactionType: { type: String, required: true, enum: ['CREDIT', 'DEBIT']}, 
    description: {type: String, trim: true},
    createdBy: {type: ObjectId,  ref: 'staff'},
    createdType: { type: String, enum: ['staff', 'customer'] },
    updatedBy: { type: ObjectId, ref: 'staff' },
    updatedType: { type: String, enum: ['staff', 'customer'] },
    details: {
      orderId: {type: ObjectId, ref: 'order', index: true},
      membershipId: {type: ObjectId,mref: 'membership' },
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('walletlog', walletLogSchema);
