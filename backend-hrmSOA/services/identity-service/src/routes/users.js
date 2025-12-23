const express = require('express');
const { listUsers, getUser } = require('../controllers/userController');
const { requireAuth, requireRole } = require('../middlewares/auth');

const router = express.Router();

router.get('/', requireAuth, requireRole('admin'), listUsers);
router.get('/:id', requireAuth, requireRole('admin'), getUser);

module.exports = router;

