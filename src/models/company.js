const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;


const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true, },
    code: { type: String, trim: true, unique: true,},
    logo: {type: String,trim: true,},
    ownerName: {type: String,trim: true,},
    ownerMobile: {type: String,trim: true,unique: [true, 'Mobile number already assigned to another company']},
    ownerMobileAlternate: {type: String,trim: true,},
    status: {type: String,enum: ['Active', 'Inactive'],default: 'Active',},
    tnc: {type: String,trim: true,},
    tagline: {type: String,trim: true,},
    createdBy: {type: ObjectId,ref: 'staff',},
    createdType: {type: String,enum: ['staff', 'customer'],},
    updatedBy: {type: ObjectId,ref: 'staff',},
    updatedType: {type: String, enum: ['staff', 'customer'], },
    notificationSettings: {
      sms: {type: Boolean, default: true},
      email: {type: Boolean, default: true},
    },
    paymentGateway: {type: String,enum: ['razorpay', 'cashfree'],},
    timeSlots: [{type: ObjectId, ref: 'timeslot'}],
    documents: [{
      name:{type: String},
      title:{type: String}
    }],
    orderIdPrefix: {type: String,trim: true,},
    timezone: {type: String,trim: true,},
    currency: {type: String,trim: true,},
    CIN: {type: String,trim: true,},
    GST: {type: String,trim: true,},
    supportMobileNo: {type: String, trim: true,},
    supportEmailSettings: {
      email: {type: String},
      startTime: {type: String},
      endTime: {type: String},
    },
    supportWhatsappNo: {type: String, trim: true,},
    supportTimings: {
      start: {type: String},
      end: {type: String},
    },
    checkoutTerms: {type: String, trim: true,},

  },
  { timestamps: true }
);


module.exports = mongoose.model('company', companySchema);
