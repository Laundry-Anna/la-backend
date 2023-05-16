const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const timeSlotSchema = new mongoose.Schema({
  companyId: {type: ObjectId, required: true, ref: 'company'},
  from: { type: String, required: true},
  to: { type: String, required: true},
  order: { type: Number, required: [true, 'Order is required']}
});

const tempTimeSlotSchema = new mongoose.Schema({ 
  companyId: {type: ObjectId, required: true, ref: 'company'},
  slots: [{ 
    date: { type: Date},
    maxValue: {type: Number, required: true},
    selected: { type: Boolean, default: true}
  }],
  visibility: { type: Boolean, default: true},
  order: { type: Number, required: false}
});

const TimeSlotModel = mongoose.model('timeslot', timeSlotSchema);
const TempTimeSlotModel = mongoose.model('tempslot', tempTimeSlotSchema);

module.exports = { TimeSlot: TimeSlotModel, TempTimeSlot: TempTimeSlotModel};