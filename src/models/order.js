const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: ObjectId,
      ref: 'customer',
      index: true,
    },
    addressId: {
      type: ObjectId,
      ref: 'adddress',
      required: false
    },
    address: {
      type: JSON,
      required: false
    },
    companyId: {
      type: ObjectId,
      ref: 'company',
      require: [true, 'Please enter company id'],
      index: true,
    },
    mcId: {
      type: ObjectId,
      ref: 'mothercategory',
      require: [true, 'Please enter company id'],
      index: true,
    },
    storeId: {
      type: ObjectId,
      ref: 'store',
      required: false
    },
    rateCardId: {
      type: ObjectId,
      ref: 'ratecard',
      required: false,
    },
    pickup: {
      staffId: {type: ObjectId, ref: 'staff'},
      timeslotId: {type: ObjectId,  ref: 'timeslot'},
      date: {type: Date},
    },
    delivery: {
      staffId: {type: ObjectId,ref: 'staff'},
      timeslotId: {type: ObjectId,  ref: 'timeslot'},
      date: {type: Date},
    },
    couponCode: {
      type: String,
      required: false
    },
    couponList: {
      type: Array,
      required: false
    },
    type: {
      type: String,
      enum: ['order','pickup'],
      default: 'order'
    },
    orderTotal: {
      type: Number,
      required: false,
    },
    revisedOrderTotal: {
      type: Number,
      required: false,
    },
    deliveryCharge: {
      type: Number,
      required: false,
    },
    express: {
      type: Boolean,
      required: false,
      default: false
    },
    discount: {
      type: Number,
      default: 0,
      required: false,
    },
    createdBy: {
      type: ObjectId,
      ref: 'staff',
    },
    updatedBy: {
      type: ObjectId,
      ref: 'staff',
    },
    cashback: {
      type: Number,
      required: false,
      default: 0,
    },
    status: {
      type: String,
      enum: ['PICKUP_SCHEDULED', 'ASSIGNED_PICKUP', 'OUT_FOR_PICKUP', 'PICKUP_COMPLETED', 'DELIVERED_STORE', 'ORDER_CREATED', 'READY_DELIVERY', 'DELIVERY_SCHEDULED', 'ASSIGNED_DELIVERY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'PENDING_PAYMENT', 'COMPLETED'],
      default: '',
    },
    payments: {
      type: Array,
      required: true
    },
    balance: {
      type: Number,
      default: 0,
      required: true,
    },
    orderCategories: {
      type: JSON,
    },
    tracking: [{
      date: { type: Date, required: false, default: Date.now()},
      status: { type: String, required: false},
      updatedBy: { type: ObjectId, ref: 'staff', required: false},
    }]
  },
  { timestamps: true }
);


orderSchema.virtual('customer', {
  ref: 'customer',
  localField: 'customerId',
  foreignField: '_id',
  justOne: true
});


orderSchema.virtual('pickup.timeslot', {
  ref: 'timeslot',
  localField: 'pickup.timeslotId',
  foreignField: '_id',
  justOne: true
});



orderSchema.set('toObject', {
  virtuals: true
});

orderSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('order', orderSchema);
