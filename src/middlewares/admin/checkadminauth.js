const jwt = require('jsonwebtoken');
const staff = require('../../models/staff');

// middleware to validate token
exports.verifyToken = async (req, res, next) => {
  try {
    const clientTypeArray = [
      'SAAS-ADMIN',
      'SAAS-ANDROID',
      'SAAS-IOS',
      'SAAS-WEBSITE',
      'SAAS-MSITE',
    ];

    const clientTypeValue = {
      'SAAS-ADMIN': 'ADMIN',
      'SAAS-ANDROID': 'ANDROID',
      'SAAS-IOS': 'IOS',
      'SAAS-WEBSITE': 'WEBSITE',
      'SAAS-MSITE': 'MSITE',
    };
    //TODO
    // check cookie exists
    if (
      typeof req.header('Client-Type') === 'undefined' ||
      req.header('Client-Type') === ''
    ) {
      return res.status(401).json({
        error: 'Access denied !',
      });
    }
    const token = req.header('Authorization').replace('Bearer ', '');
    // check if clienttype is in array or  not
    if (!clientTypeArray.includes(req.header('Client-Type'))) {
      return res.status(401).json({
        error: 'Access denied !',
      });
    }
    const data = jwt.verify(token, process.env.AUTHENTICATION_SECRET);
    if (!token) {
      return res.status(401).json({
        error: 'Access denied !',
      });
    }
    try {
      const user = await staff.findOne({
        _id: data._id,
        //"tokens.token": token,
      });
      console.log('noaccess',user)
      if (!user) {
        return res.status(401).json({
          error: 'Not authorized to access !',
        });
      }
      user.password = 0;
      req.user = user;
      req.userType = 'staff'; // staff, customer
      req.token = token;
      req.clientType = clientTypeValue[req.header('Client-Type')];
      next(); // to continue the flow
    } catch (error) {
      res.status(401).json({
        error: 'Not authorized to access !',
      });
    }
  } catch (error) {
    res.status(401).json({
      error: 'Not authorized to access !',
    });
  }
};

//module.exports = verifyToken;
