const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const staffSchema = new mongoose.Schema(
  {
    companyId: {
      type: ObjectId,
      ref: 'company',
      index: true,
    },
    staffFirstName: {
      type: String,
      required: [true, 'Please enter staff first name'],
      trim: true,
    },
    staffLastName: {
      type: String,
      trim: true,
      required: [true, 'Please enter staff last name'],
    },
    staffEmailId: {
      type: String,
      trim: true,
    },
    staffMobile: {
      type: String,
      required: [true, 'Please enter mobile number'],
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    staffAlternateMobile: {
      type: String,
      trim: true,
    },
    staffProof: {
      // pancard, aadhar
      type: JSON,
      trim: true,
    },
    staffBankDetails: {
      // SBI, ICICI
      type: JSON,
      trim: true,
    },
    staffEmployeeType: {
      // who can do multiple roles
      // Store Boy, Store Owner, Delivery Boy, Company Owner
      type: Array,
    },
    isEmployeeStoreOwner: {
      type: Boolean,
      trim: true,
      default: false,
    },
    staffStatus: {
      type: String,
      enum: ['Active', 'Inactive', 'Deleted'],
      required: true,
      default: 'Active',
    },
    isCompanyOwner: {
      type: Boolean,
      trim: true,
      default: false,
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
    workdays: {
      type: Array,
    },
    profileImage: {
      type: String,
    },
    inTime: {
      type: Date,
    },
    outTime: {
      type: Date,
    },
    roles: [{
      type: String,
      storeId: ObjectId
    }],
    facebookProvider: {
        type: {
            id: String,
            token: String
        },
        select: false
    },
    googleProvider: {
        type: {
            id: String,
            token: String
        },
        select: false
    }
  },
  { timestamps: true }
);


staffSchema.virtual('pickups', {
  ref: 'order',
  localField: '_id',
  foreignField: 'pickup.staffId',
  justOne: false,
  /*
  options: {
    match: {
      type: 'pickup',

    }
  }
  */
});



staffSchema.set('toObject', {
  virtuals: true
});

staffSchema.set('toJSON', {
  virtuals: true
});

staffSchema.statics.upsertFbUser = function(accessToken, refreshToken, profile, cb) {
  var that = this;
  return this.findOne({
      'facebookProvider.id': profile.id
  }, function(err, user) {
      // no user was found, lets create a new one
      if (!user) {
          var newUser = new that({
              fullName: profile.displayName,
              email: profile.emails[0].value,
              facebookProvider: {
                  id: profile.id,
                  token: accessToken
              }
          });
          newUser.save(function(error, savedUser) {
              if (error) {
                  console.log(error);
              }
              return cb(error, savedUser);
          });
      } else {
          return cb(err, user);
      }
  });
};

staffSchema.statics.upsertGoogleUser = function(accessToken, refreshToken, profile, cb) {
  var that = this;
  return this.findOne({
      'googleProvider.id': profile.id
  }, function(err, user) {
      // no user was found, lets create a new one
      if (!user) {
          var newUser = new that({
              fullName: profile.displayName,
              email: profile.emails[0].value,
              googleProvider: {
                  id: profile.id,
                  token: accessToken
              }
          });

          newUser.save(function(error, savedUser) {
              if (error) {
                  console.log(error);
              }
              return cb(error, savedUser);
          });
      } else {
          return cb(err, user);
      }
  });
};


module.exports = mongoose.model('staff', staffSchema);
