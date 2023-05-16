const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const citySchema = new mongoose.Schema(
  {
    cityName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    stateName: {
      type: String,
      required: true,
      trim: true,
    },
    cityCode: {
      type: String,
      trim: true,
    },
    cityStatus: {
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

module.exports = mongoose.model('city', citySchema);
