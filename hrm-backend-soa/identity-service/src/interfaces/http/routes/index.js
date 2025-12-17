const { Router } = require('express');
const authRoutes = require('./auth.routes');
const roleRoutes = require('./role.routes');
const permissionRoutes = require('./permission.routes');

const router = Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));
router.use('/auth', authRoutes);
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);

module.exports = router;
