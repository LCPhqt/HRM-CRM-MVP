const express = require('express');
const { requireAuth, requireRole } = require('../middlewares/auth');
const { listEmployees, getEmployee } = require('../controllers/adminController');

const router = express.Router();

router.use(requireAuth, requireRole('admin'), (req, _res, next) => {
  req.token = (req.headers.authorization || '').replace('Bearer ', '');
  return next();
});

router.get('/employees', listEmployees);
router.get('/employees/:id', getEmployee);

module.exports = router;

