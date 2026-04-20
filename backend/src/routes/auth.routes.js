const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate, schemas } = require('../middleware/validation.middleware');

router.post('/register', validate(schemas.register), ctrl.register);
router.post('/login', validate(schemas.login), ctrl.login);
router.post('/forgot-password', validate(schemas.forgotPassword), ctrl.forgotPassword);
router.post('/reset-password', validate(schemas.resetPassword), ctrl.resetPassword);
router.get('/me', authenticate, ctrl.getMe);
router.put('/change-password', authenticate, ctrl.changePassword);

module.exports = router;
