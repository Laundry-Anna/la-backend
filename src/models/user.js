const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    email: { type: String, trim: true, required: true },
    password: { type: String, trim: true, required: true },
    mobile: { type: String, trim: true},
    userType: { type: String, required: true },
    refId: { type: ObjectId, required: true },
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

userSchema.virtual('userDetails', {
  ref: doc => doc.type,
  localField: 'refId',
  foreignField: '_id',
  justOne: true
});

userSchema.pre('save', function(next) {
  if (foo()) {
    console.log('calling next!');
    // `return next();` will make sure the rest of this function doesn't run
    /*return*/ next();
  }
  // Unless you comment out the `return` above, 'after next' will print
  console.log('after next');
});

userSchema.post('init', function(doc) {
  console.log('%s has been initialized from the db', doc._id);
});
userSchema.post('validate', function(doc) {
  console.log('%s has been validated (but not saved yet)', doc._id);
});
userSchema.post('save', function(doc) {
  console.log('%s has been saved', doc._id);
});
userSchema.post('remove', function(doc) {
  console.log('%s has been removed', doc._id);
});

userSchema.set('toObject', {
  virtuals: true
});

userSchema.set('toJSON', {
  virtuals: true
});


userSchema.statics.upsertFbUser = function(accessToken, refreshToken, profile, cb) {
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

userSchema.statics.upsertGoogleUser = function(accessToken, refreshToken, profile, cb) {
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

/*
userSchema.virtual('assigned', {
  ref: doc => doc.adminId ? 'Admin' : 'User',
  localField: doc => doc.adminId ? 'adminId' : 'userId',
  foreignField: '_id',
  justOne: true
});
*/

module.exports = mongoose.model('user', userSchema);
