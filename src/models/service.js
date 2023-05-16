const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const serviceSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    mcId: {
      type: ObjectId,
      ref: "motherCategory",
    },
    catId: {
      type: ObjectId,
      ref: "category",
    },
    subcatId: {
      type: ObjectId, // Plan and individual service
      ref: "subCategory",
    },
    serviceStatus: {
      type: Number, // 0 - inactive, 1 - active
      min: 0,
      max: 1,
      default: 1,
    },
    // attributes
    // individual service attributes
    perUnitPrice: {
      type: Number,
    },
    individualStatus: {
      type: Number, // 0 - inactive, 1 - active
      min: 0,
      max: 1,
      default: 1,
    },
    // plan attributes
    minValue: {
      type: Number,
    },
    minValueText: {
      type: String, // weight, units
    },
    minPrice: {
      type: Number,
    },
    additionalPrice: {
      type: Number,
    },
    planStatus: {
      type: Number, // 0 - inactive, 1 - active
      min: 0,
      max: 1,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("service", serviceSchema);
