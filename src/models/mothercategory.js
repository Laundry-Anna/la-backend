const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const mothercategorySchema = new mongoose.Schema(
  {
    companyId: {
      type: ObjectId,
      ref: 'company',
      index: true,
    },
    mcName: {
      type: String,
      required: true,
      trim: true,
    },
    mcSmallDesc: {
      type: String,
      trim: true,
    },
    mcDesc: {
      type: String,
      trim: true,
    },
    mcMinOrderValue: {
      type: Number,
      required: true,
    },
    mcDeliveryCharge: {
      type: Number,
    },
    mcDeliveryDuration: {
      type: Number, // in 5 hours / 2-3 days
    },
    mcDeliveryDurationText: {
      type: String, // hours / days
    },
    mcExpressMultiplier: {
      type: Number, // 2.5X / 1x on total amount
    },
    mcExpressDeliveryDuration: {
      type: Number, // 1 hour, 2 hours
    },
    mcExpressDeliveryDurationText: {
      type: String, // hours , days
    },
    mcImage: {
      type: String, // image url
      trim: true,
    },
    mcStatus: {
      type: Number, // 0 - inactive, 1 - active
      min: 0,
      max: 1,
      default: 0,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model('motherCategory', mothercategorySchema);
