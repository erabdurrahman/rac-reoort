const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/departments.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { validate, schemas } = require('../middleware/validation.middleware');

router.use(authenticate);
router.get('/', ctrl.getAllDepartments);
router.post('/', authorize('admin'), validate(schemas.createDepartment), ctrl.createDepartment);
router.get('/:id', ctrl.getDepartmentById);
router.put('/:id', authorize('admin'), ctrl.updateDepartment);
router.delete('/:id', authorize('admin'), ctrl.deleteDepartment);

module.exports = router;
