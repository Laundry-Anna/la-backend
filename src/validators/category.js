const { check, validationResult } = require('express-validator');

exports.CatValidationResult = async (req, res, next) => {
  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: true,
      message: errors.array()[0].msg,
    });
  }
  next();
};

exports.validateInsertCat = [
  check('mcName')
    .not()
    .isEmpty()
    .withMessage('Please enter a valid mother category')
    .isLength({ min: 4, max: 16 })
    .withMessage(
      'Mothercategory name should be more than 4 characters and less than 16'
    ),
  check('mcMinOrderValue') // TODO check isNumber , postive number
    .not()
    .isEmpty()
    .withMessage('Min order value should be a positive number')
    .isInt({ min: 1 })
    .withMessage('Min order value should be a positive number'),
  check('mcDeliveryCharge') // TODO check isNumber , postive number
    .not()
    .isEmpty()
    .withMessage('Delivery charge should be a positive number')
    .isInt({ min: 0 })
    .withMessage('Delivery charge should be a positive number'),
  check('mcDeliveryDuration') // TODO check isNumber , postive number
    .not()
    .isEmpty()
    .withMessage('Delivery duration should be a positive number')
    .isInt({ min: 1 })
    .withMessage('Delivery duration should be a positive number'),
  check('mcDeliveryDurationText') // TODO check isNumber , postive number
    .not()
    .isEmpty()
    .withMessage('Delivery duration text should not be empty'),
  check('mcExpressMultiplier') // TODO check isNumber , postive number
    .not()
    .isEmpty()
    .withMessage('Express multiplier should be a positive number')
    .isInt({ min: 0 })
    .withMessage('Express multiplier should be a positive number'),
  check('mcExpressDeliveryDuration') // TODO check isNumber , postive number
    .not()
    .isEmpty()
    .withMessage('Express duration should be a positive number')
    .isInt({ min: 1 })
    .withMessage('Express duration should be a positive number'),
  check('mcExpressDeliveryDurationText') // TODO check isNumber , postive number
    .not()
    .isEmpty()
    .withMessage('Express duration text should be a positive number'),
];
