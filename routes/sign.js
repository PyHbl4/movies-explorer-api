const router = require('express').Router();
const { signupValidation, signinValidation } = require('../middlewares/validation');
const {
  createUser,
  login,
} = require('../controllers/users');

router.post('/signin', signinValidation, login);
router.post('/signup', signupValidation, createUser);

module.exports = router;
