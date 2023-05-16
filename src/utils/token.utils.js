const createToken = function(auth) {
    const token = jwt.sign({ _id: auth.id }, process.env.AUTHENTICATION_SECRET);
    return token;
};

module.exports = {
  generateToken: function(req, res, next) {
      req.token = createToken(req.auth);
      //res.cookie('token', token, { expire: new Date() + 9999 });
      /*
      res.header('Authorization').json({
        error: null,
        data: {
          token,
          emailId: staffEmailId,
          firstName: staffFirstName,
          lastName: staffLastName,
          profileImage,
        },
      });
      */
      return next();
  },
  sendToken: function(req, res) {
      //res.setHeader('x-auth-token', req.token);
      res.cookie('token', req.token, { expire: new Date() + 9999 });
      return res.header('Authorization').json({
        error: null,
        data: {
          token: req.token,
          emailId: req.user.staffEmailId,
          firstName: req.user.staffFirstName,
          lastName: req.user.staffLastName,
          profileImage: req.user.profileImage,
        },
      });
      //return res.status(200).send(JSON.stringify(req.user));
  }
};