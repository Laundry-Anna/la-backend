const city = require('../models/city');
exports.getCityById = async (req, res, next, id) => {
  try {
    await city.findById(id).exec((error, city) => {
      if (error || !city) {
        return res.status(400).json({
          error: true,
          message: 'City not exist',
        });
      }
      req.cityData = city;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.insertCity = async (req, res) => {
  try {
    const { cityName } = req.body;
    // check if same city already exists
    let validateCheck = await city.findOne({ cityName });
    //console.log("bbb : " + validateCheck);
    if (validateCheck) {
      return res.status(400).json({
        error: true,
        message: 'City already exists',
      });
    }
    // insert into city table
    const newcity = new city({
      cityName: req.body.cityName,
      stateName: req.body.stateName,
      cityCode: req.body.cityCode,
      createdBy: req.user._id,
      createdType: req.user.userType, // staff, customer
    });
    newcity.save((error, city) => {
      if (error) {
        return res.status(400).json({
          error: true,
          message: 'Not able to insert user in DB - city',
        });
      }
      res.json({
        error: false,
        message: 'City added successfully',
      });
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.getAllCities = async (req, res) => {
  try {
    let cities = await city.find({}, { cityName: 1, _id: 1 });
    if (cities) {
      res.json({
        error: false,
        data: {
          cities,
        },
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'Cities not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.getCity = async (req, res) => {
  try {
    return res.json({
      error: false,
      data: req.cityData,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.updateCity = async (req, res) => {
  try {
    req.body.updatedBy = req.user._id;
    req.body.updatedType = req.user.userType; // staff, customer
    let updateCity = await city.findByIdAndUpdate(
      { _id: req.cityData._id },
      { $set: req.body },
      { new: true, useFindAndModify: false }
    );
    if (updateCity) {
      res.status(201).json({
        error: false,
        data: updateCity,
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'City not updated. Please try again',
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
