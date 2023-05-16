const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const slotSchema = new mongoose.Schema({
    storeId: { type: ObjectId, ref: 'store', require: [true, 'Please enter store id'], index: true},
    companyId: { type: ObjectId, ref: 'staff', require: [true, 'Please enter company id'], index: true},
    staffId: {type: ObjectId,ref: 'staff', index: true},
    type: {type: String,required: false, enum: ['pickup', 'delivery']},
    startTime: {type: String, required: true},
    endTime: {type: String, required: true},
    status: {type: String, required: true},
    days: {
      day:  {type: String, required: true},
      selected: {type: Number, required: true},
    },
    capacity: {type: Number, required: true, default: 0},
  },
  { timestamps: true }
);

module.exports = mongoose.model('slot', slotSchema);
