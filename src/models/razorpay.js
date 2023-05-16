const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const RazorPaySchema = new Schema({
    txnId: { type: String, required: false },
    createdOn: { type: Date, default: Date.now },
    status: { type: String, required: false },
    type: { type: String, required: false },
    response: { type: String, required: true },
});

RazorPaySchema.set('toObject', {
    virtuals: true
});

RazorPaySchema.set('toJSON', {
    virtuals: true
});


module.exports = mongoose.model('razorpay', RazorPaySchema);