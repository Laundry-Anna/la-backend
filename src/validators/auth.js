const { body } = require('express-validator')
const { validate } = require('./validate')

const authValidationRules = () => {
  return [
    // username must be an email
    //body('username').isEmail().withMessage('Not a valid email'),
    // password must be at least 5 chars long
    body('password').isLength({ min: 8 }).withMessage('Invalid password'),
  ]
}

module.exports = {
    authValidationRules,
  validate
}