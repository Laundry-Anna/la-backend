const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const membershipSchema = new mongoose.Schema(
  {
    companyId: {
      type: ObjectId,
      ref: 'company',
      index: true,
    },
    planName: {
      type: String,
      required: true,
    },
    planAmount: {
      type: Number,
      required: true,
    },
    planCreditAmount: {
      type: Number,
    },
    planDescription: {
      type: String,
    },
    planStartDate: {
      type: Date,
    },
    planEndDate: {
      type: Date,
    },
    createdBy: {
      type: ObjectId,
      ref: 'staff',
    },
    createdType: {
      type: String,
      enum: ['staff', 'customer'],
    },
    updatedBy: {
      type: ObjectId,
      ref: 'staff',
    },
    updatedType: {
      type: String,
      enum: ['staff', 'customer'],
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      required: true,
      default: 'Active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('membership', membershipSchema);
