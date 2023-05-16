const { check, validationResult } = require("express-validator");
const { validate } = require('./validate')

exports.storeValidationResult = async (req, res, next) => {
  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }
  next();
};

exports.validateInsertStore = [
  check("storeName")
    .not()
    .isEmpty()
    .withMessage("Please enter a valid store name"),
  check("storeMobile")
    .not()
    .isEmpty()
    .withMessage("Please enter store mobile number"),
];



exports.validateSearchStore = () => {
  return [
    check("customerId").not().isEmpty().withMessage("Please enter a valid customer Id"),
    check("latitude").not().isEmpty().withMessage("Please enter location latitude"),
    check("longitude").not().isEmpty().withMessage("Please enter location longitude"),
  ]
}

exports.validate = validate;