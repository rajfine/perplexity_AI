import { body, validationResult} from 'express-validator';


export const validate = (req, res, next) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
}


export const registerValidator = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 20 }).withMessage('Username must be 3-20 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores')
    .trim()
    .escape(),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6, max: 32 }).withMessage('Password must be 6-32 characters')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+=-]+$/).withMessage('Password must contain at least one letter and one number')
  ,
  validate
]
