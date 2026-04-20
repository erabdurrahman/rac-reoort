const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/users.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(authenticate);
router.get('/', authorize('admin'), ctrl.getAllUsers);
router.post('/', authorize('admin'), ctrl.createUser);
router.get('/:id', authorize('admin'), ctrl.getUserById);
router.put('/:id', authorize('admin'), ctrl.updateUser);
router.delete('/:id', authorize('admin'), ctrl.deleteUser);

module.exports = router;
