const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const walletSchema = new mongoose.Schema(
  {
    customerId: {type: ObjectId, ref: 'customer', index: true},
    walletLogId: {type: ObjectId, ref: 'walletlog', index: true},
    balance: { type: Number, required: true },
    type: { type: String, required: true, enum: ['CASH', 'PROMOTION', 'CASHBACK', 'MEMBERSHIP', 'REFFERAL'], default: 'CASH'}, //wallet type
    expiry: {type: Date, trim: true}
  },
  { timestamps: true }
);

module.exports = mongoose.model('wallet', walletSchema);
