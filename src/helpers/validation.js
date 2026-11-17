const { body, validationResult } = require("express-validator")

const registerSignupValidator = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").isLength({min: 8 , max: 32}).withMessage("password must be between 8 and 32 characters long"),
  body("name").escape().isLength({min:3, max: 32}).withMessage("name must be between 3 and 32 characters long"),
]

const registerEditUserValidator = [
  body("name").escape().isLength({min:3, max: 32}).withMessage("name must be between 3 and 32 characters long"),
  body("bio").escape().isLength({min:10, max: 1000}).withMessage("bio must be between 10 and 1000 characters long"),
]

const registerLoginValidator = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").isLength({min: 8 , max: 32}).withMessage("password must be between 8 and 32 characters long"),
]

const createPostValidator = [
  body("title").escape().isLength({min: 1, max: 128}).withMessage("Invalid email"),
  body("body").isLength({min: 1 , max: 16000}).withMessage("post body must be between 1 and 16000 characters long"),
]

const createCommentValidator = [
  body("body").isLength({min: 1 , max: 1200}).withMessage("comment must be between 1 and 1200 characters long"),
]

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array() });
  }

  next();
}


module.exports = {
  registerSignupValidator,
  validate,
  createCommentValidator,
  createPostValidator,
  registerLoginValidator,
  registerEditUserValidator
}