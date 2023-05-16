const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;


const customerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      required: [true, 'Please enter first name'],
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      required: [true, 'Please enter last name'],
    },
    mobileNumber: {
      type: String,
      required: true,
      trim: true,
    },
    encryptPassword: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female'],
    },
    dob: {
      type: Date,
      trim: true,
    },
    referralCode: {
      // unique referral code for each customer
      type: String,
      required: [true, 'Please enter unique referral code'],
      trim: true,
      unique: true,
    },
    referarCode: {
      // used some one referral code to register
      type: String,
      trim: true,
    },
    referarId: {
      // customerId of the referrar
      type: ObjectId,
      ref: 'customer',
    },
    cityId: {
      type: ObjectId,
      ref: 'city',
    },
    address: [{type: ObjectId,ref: 'address'}],
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Deleted'],
      required: true,
      default: 'Active',
    },
    registeredFrom: {
      type: String,
      enum: ['ADMIN', 'IOS', 'ANDROID', 'MSITE', 'WEBSITE'],
    },
    utmSource: {
      type: String,
      trim: true,
    },
    utmMedium: {
      type: String,
      trim: true,
    },
    utmCampaign: {
      type: String,
      trim: true,
    },
    companyId: {
      type: ObjectId,
      ref: 'company',
    },
    // storeId: {
    //   type: ObjectId,
    //   ref: 'store',
    // },
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
    cashWallet: {
      type: Number,
      trim: true,
      default: 0,
    },
  },
  { timestamps: true }
);

// customerSchema.path('mobileNumber').validate(async (mobileNumber) => {
//   const mobileCount = await mongoose.models.customer.countDocuments({
//     mobileNumber,
//   });
//   return !mobileCount;
// }, 'Mobile number already exists');

customerSchema.path('referralCode').validate(async (referralCode) => {
  const referralCount = await mongoose.models.customer.countDocuments({
    referralCode,
  });
  return !referralCount;
}, 'Referral code already exists');

module.exports = mongoose.model('customer', customerSchema);
