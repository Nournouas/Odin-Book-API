const { body, validationResult } = require("express-validator")

const registerSignupValidator = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").isLength({min: 8 , max: 32}).withMessage("password must be between 8 and 32 characters long"),
  body("name").escape().isLength({min:3, max: 32}).withMessage("password must be between 3 and 32 characters long"),
]

const validateSignup = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array() });
  }

  next();
}


module.exports = {
  registerSignupValidator,
  validateSignup
}