const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

// const storePointSchema = new mongoose.Schema({
//   type: {
//     type: String,
//     enum: ['Point'],
//     required: true,
//   },
//   coordinates: {
//     type: [Number],
//     required: true,
//     index: '2dsphere',
//   },
//   // formatted address
//   // zipcode
//   // landmark
// });
const storePolygonSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Polygon'],
  },
  coordinates: {
    type: [[[Number]]],
  },
});

const storeSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: [true, 'Please enter a valid store name'],
      trim: true,
      unique: true,
    },
    storeCode: {
      type: String,
      required: [true, 'Please enter store code'],
      trim: true,
    },
    companyId: {
      type: ObjectId,
      ref: 'company',
      require: [true, 'Please enter company id'],
      index: true,
    },
    cityId: {
      type: ObjectId,
      ref: 'city',
    },
    storeAddress: {
      type: JSON,
      trim: true,
    },
    ratecardOnline: {
      type: ObjectId,
      ref: 'ratecard',
    },
    ratecardOffline: {
      type: Array,
      trim: true,
    },
    isVirtual: {
      type: Boolean, // true, false
      default: false,
    },
    showInStoreLocator: {
      type: Boolean,
      default: false,
    },
    parentStore: {
      // TODO if virtual store insert partent store id in this field
      type: ObjectId,
      ref: 'store',
    },
    storePolygon: storePolygonSchema,
    storeMobile: {
      type: String,
      required: [true, 'Please enter store mobile number'],
      trim: true,
      unique: true,
    },
    storeMobileAlternate: {
      type: String,
      trim: true,
    },
    storePaymentQRcode: {
      type: String,
      trim: true,
    },
    // delivery charges
    // deliver charges min amount
    isFranchise: {
      type: Number,
      default: 0, // 0 - own store, 1 - franchise
    },
    royalityOnlinePercentage: {
      // royality percentage to be given to owner when others take franchaise from company
      type: Number,
      default: 0,
    },
    royalityOfflinePercentage: {
      // royality percentage to be given to owner when others take franchaise from company
      type: Number,
      default: 0,
    },
    storeStatus: {
      type: String,
      enum: ['Active', 'Inactive', 'Incomplete'],
      //required: true,
      default: 'Incomplete',
    },
    //TODO convert string to objectid
    storeOwners: {
      type: String,
      trim: true,
    },
    storeDeliveryBoys: {
      type: Array,
      trim: true,
    },
    /*
    storeDeliveryBoys: [{
      staffId: { type: ObjectId, ref: 'staff' },
      autoAssign: { type: Boolean, default: false }
    }]
    */
    storeStaffBoys: {
      type: Array,
      trim: true,
    },
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
    perCompletion: {
      type: Number,
      enum: [0, 1, 2, 3, 4],
      default: 0,
    },
    inTime: {
      type: Date,
      required: [true, 'Please enter In-Time'],
    },
    outTime: {
      type: Date,
      required: [true, 'Please enter Out-Time'],
    },
    masterSlots: {
      timeslot: {type: ObjectId, required: false, ref: 'timeslot'},
      slots: {type: JSON},
      visibility: {type: Boolean, required: false},
    },
    tempSlots: [{
      timeslot: {type: ObjectId, required: false, ref: 'timeslot'},
      slots: {type: JSON},
      visibility: {type: Boolean, required: false},
    }],
  },
  { timestamps: true }
);


storeSchema.virtual('motherCategories', {
  ref: 'motherCategory',
  localField: 'companyId',
  foreignField: 'companyId',
  justOne: false
});

storeSchema.virtual('onlineRateCard', {
  ref: 'ratecard',
  localField: 'ratecardOnline',
  foreignField: '_id',
  justOne: true
});

//ratecardOnline


storeSchema.set('toObject', {
  virtuals: true
});

storeSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('store', storeSchema);
