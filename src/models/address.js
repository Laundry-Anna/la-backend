const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const addressSchema = new mongoose.Schema({
  customerId: {type: ObjectId, ref: 'customer', required: true},
  addr1 : {type: String, required: true},
  addr2: {type: String,required: false},
  city: {type: String,required: true},
  state: {type: String,required: true},
  latitude: {type: Number,required: true},
  longitude: {type: Number,required: true},
  addressType: {type: String,required: true},
  status: {type: String, required: true, default: 'Active'},
  pincode: {type: Number,required: true},
  landmark: {type: String, required: false}
});

module.exports = mongoose.model('address', addressSchema);
