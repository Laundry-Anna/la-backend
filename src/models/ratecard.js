const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const ratecardSchema = new mongoose.Schema(
  {
    rateCardName: {
      type: String,
      required: true,
      trim: true,
    },
    // isDefault: {
    //   type: Boolean,
    //   default: false
    // },
    rateCardServices: {
      type: Array,
      required: true,
      trim: true,
    },
    // rateCardType: {
    //   type: String,
    //   enum: ['Offline', 'Online', 'Others', ''],
    //   required: true,
    // },
    companyId: {
      type: ObjectId,
      ref: 'company',
      required: true,
      index: true,
    },
    // storeId: {
    //   type: ObjectId,
    //   ref: 'store',
    //   default: null,
    // },
    rateCardStatus: {
      type: String,
      enum: ['Active', 'Inactive'],
      required: true,
      default: 'Active',
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

module.exports = mongoose.model('ratecard', ratecardSchema);


/*

mcId
:
"5fb640763fad270024d0b868"
subcatId
:
"5f5d503bd7336f3edc51331e"
catId
:
"5fb640993fad270024d0b869"
perUnitPrice
:
"50"
minValue
:
""
minValueText
:
"Kgs"
minPrice
:
0
serviceName
:
"Pullover5"
planStatus
:
true
additionalPrice
:
0
masteritem
:
"Pullover"
visibility
:
true
*/