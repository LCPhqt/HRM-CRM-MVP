const express = require('express');
const { requireAuth, requireRole } = require('../middlewares/auth');
const {
  getMyProfile,
  updateMyProfile,
  listProfiles,
  getProfile,
  bootstrapProfile
} = require('../controllers/profileController');

const router = express.Router();

router.get('/me', requireAuth, getMyProfile);
router.put('/me', requireAuth, updateMyProfile);

router.get('/', requireAuth, requireRole('admin'), listProfiles);
router.get('/:id', requireAuth, requireRole('admin'), getProfile);
// Dùng khi bootstrap từ identity-service
router.post('/bootstrap', bootstrapProfile);

module.exports = router;

