const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const walletLogSchema = new mongoose.Schema(
  {
    customerId: {
      type: ObjectId,
      ref: 'customer',
      index: true
    },
    amount: {
      type: Number,
      required: true
    },
    beforeTransactionCashWallet: {
      // dynamic
      type: Number,
      required: true,
      default: 0
    },
    afterTransactionCashWallet: {
      // dynamic
      type: Number,
      required: true,
      default: 0
    },
    transactionType: {
      type: String,
      required: true,
      enum: ['credit', 'debit']
    },
    transactionName: {
      type: String,
      enum: ['cashback', 'promotional', 'referral', 'membership', 'wallet'],
      default: 'wallet'
    },
    walletType: {
      // cash wallet, promotional wallet, referral wallet
      type: String,
      required: true,
      enum: ['cashWallet'],
      default: 'cashWallet'
    },
    walletDescription: {
      type: String,
      trim: true
    },
    createdBy: {
      type: ObjectId,
      ref: 'staff'
    },
    createdType: {
      type: String,
      enum: ['staff', 'customer']
    },
    updatedBy: {
      type: ObjectId,
      ref: 'staff'
    },
    updatedType: {
      type: String,
      enum: ['staff', 'customer']
    },
    // TODO
    //orderId: {},
    membershipId: {
      type: ObjectId,
      ref: 'membership'
    },
    membershipPlanAmount: {
      type: Number
    },
    paymentTransaction: {
      type: String,
      enum: ['card', 'paytm', 'upi', 'cash']
    },
    paymentReferenceId: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('walletlog', walletLogSchema);
