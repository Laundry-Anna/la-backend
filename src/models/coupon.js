const { trim } = require('lodash');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const couponSchema = new mongoose.Schema(
  {
    companyId: {
      type: ObjectId,
      ref: 'company',
      index: true,
    },
    pickupTime: {
      type: JSON,
    },
    bookingTime: {
      type: JSON,
    },
    geoArea: {
      type: JSON,
    },
    category: {
      type: JSON,
    },
    orderMode: {
      type: JSON,
    },
    serviceType: {
      type: JSON,
    },
    couponName: {
      type: String,
      trim: true,
      required: [true, 'Please enter coupon name'],
    },
    couponMeta: {
      type: JSON,
    },
    couponScheme: {
      type: JSON,
    },
    customerLvl: {
      type: JSON,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      required: true,
      default: 'Active',
    },
    applicableClient: {
      type: Array,
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
    usageCount: {
      type: Number,
      default: 0
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model('coupon', couponSchema);
