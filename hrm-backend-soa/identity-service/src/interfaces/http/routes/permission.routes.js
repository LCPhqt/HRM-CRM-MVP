const { Router } = require('express');
const controller = require('../controllers/permission.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

router.use(authMiddleware);

router.get('/', controller.list);
router.post('/', controller.create);

module.exports = router;
