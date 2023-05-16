const staff = require('../models/staff');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// signin
exports.signin = async (req, res) => {
  //console.log(req.body);
  const { username, password } = req.body;
  if(!username.length || !password.length) {
    return res.status(400).json({
      error: 'Invalid Username ir Password',
    });
  }
  const user = await staff.findOne({ staffMobile: username });
  if (!user) {
    return res.status(400).json({
      error: 'Username not exists',
    });
  }
  const validatePassword = await bcrypt.compare(password,user.password);
  if (!validatePassword) {
    return res.status(400).json({
      error: 'Username and Password do not match',
    });
  }
  // create token
  const token = jwt.sign({ _id: user._id }, process.env.AUTHENTICATION_SECRET);
  // put token in cookie
  res.cookie('token', token, { expire: new Date() + 9999 });
  // send response to front end
  const { staffEmailId, staffFirstName, staffLastName, profileImage } = user;
  return res.header('Authorization').json({
    error: null,
    data: {
      token,
      emailId: staffEmailId,
      firstName: staffFirstName,
      lastName: staffLastName,
      profileImage,
    },
  });
  //});
};

// signout
exports.signout = (req, res) => {
  res.clearCookie('token');
  res.json({
    message: 'User signout successfully',
  });
};
