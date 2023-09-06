const router = require('express').Router();

router.use(require('./sign'));

const auth = require('../middlewares/auth');

router.use(auth);
router.use(require('./users'));
router.use(require('./movies'));

module.exports = router;
