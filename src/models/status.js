const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const statusSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      //enum: ['Processing', 'Completed', 'Initiated', 'Cancelled', 'Rejected'],
    },
    description: {
      type: String
    },
    createdBy: {
      type: ObjectId,
      ref: 'staff',
    },
    updatedBy: {
      type: ObjectId,
      ref: 'staff',
    },
    status: {
      type: String,
      enum: ['Processing', 'Completed', 'Initiated', 'Cancelled', 'Rejected'],
      default: 'Initiated',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('status', statusSchema);


/*
[
  {name: "UnAssignedPickup", description: "", enabled: "", mode: "online"},
  {name: "AssignedPickup", description: "", enabled: "", mode: "online"},
  {name: "PickedUp", description: "", enabled: "", mode: "online"},
  {name: "DeliveredAtStore", description: "", enabled: "", mode: "online"},
  {name: "OrderCreated", description: "", enabled: "", mode: "online"},
  {name: "ReadyToDeliver", description: "", enabled: "", mode: "online"},
  {name: "Delivered", description: "", enabled: "", mode: "online"},
  {name: "PendingPayment", description: "", enabled: "", mode: "online"},
  {name: "Completed", description: "", enabled: "", mode: "online"},

  {name: "ReadyToCollect", description: "", enabled: "", mode: "offline"},
  {name: "CreatedAtStore", description: "", enabled: "", mode: "offline"},
]


*/