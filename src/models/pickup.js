const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const pickupSchema = new mongoose.Schema({
    storeId: { type: ObjectId, ref: 'store', require: [true, 'Please enter store id'], index: true},
    companyId: { type: ObjectId, ref: 'company', require: [true, 'Please enter company id'], index: true},
    orderId: {type: ObjectId,ref: 'order', index: true},
    staffId: {type: ObjectId,ref: 'staff', index: true},
    type: {type: String,required: false, enum: ['pickup', 'delivery']},
    timeslot: {
      date: {type: Date, required: true},
      type: {type: String, required: true},
      slotId: {type: ObjectId, required: true}
    },
    status: {type: String, required: true},
    notes:  {type: String, required: false},
    createdBy: {type: ObjectId, ref: 'staff'},
    updatedBy:  {type: ObjectId, ref: 'staff'},
  },
  { timestamps: true }
);

module.exports = mongoose.model('pickup', pickupSchema);
