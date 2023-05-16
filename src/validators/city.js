const { check, validationResult } = require("express-validator");

exports.cityValidationResult = async (req, res, next) => {
  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }
  next();
};

exports.validateInsertCity = [
  check("cityName")
    .not()
    .isEmpty()
    .withMessage("Please enter a valid city name"),
  check("cityCode")
    .not()
    .isEmpty()
    .withMessage("Please enter a valid city code"),
];
