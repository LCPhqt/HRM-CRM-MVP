const { Router } = require('express');
const controller = require('../controllers/role.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

router.use(authMiddleware);

router.get('/', controller.list);
router.post('/', controller.create);
router.post('/:id/permissions', controller.addPermissions);

module.exports = router;
