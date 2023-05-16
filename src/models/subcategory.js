const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const subcategorySchema = new mongoose.Schema(
  {
    companyId: {
      type: ObjectId,
      ref: 'company',
      index: true,
    },
    mcId: {
      type: ObjectId,
      ref: 'motherCategory',
      index: true,
    },
    catId: {
      type: ObjectId,
      ref: 'category',
      index: true,
    },
    subcatName: {
      type: String,
      required: true,
      trim: true,
    },
    subcatSmallDesc: {
      type: String,
      trim: true,
    },
    subcatDesc: {
      type: String,
      trim: true,
    },
    subcatImage: {
      type: String, // image url
      trim: true,
    },
    subcatStatus: {
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

module.exports = mongoose.model('subCategory', subcategorySchema);
