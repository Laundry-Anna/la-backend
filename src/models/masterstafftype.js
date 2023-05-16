const mongoose = require('mongoose');

const staffemployeetypeSchema = mongoose.Schema({
  staffEmployeeType: {
    type: String,
    enum: ['Store Boy', 'Store Owner', 'Delivery Boy', 'Company Owner'],
  },
});

module.exports = mongoose.model('masterstafftype', staffemployeetypeSchema);
