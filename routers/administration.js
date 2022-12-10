const express = require('express');
const router = express.Router();
const authService = require('../controllers/login');
const administrationController = require('../controllers/administration')

router.get('/', authService.authAdmin, administrationController.getAdministrations);
router.post('/', authService.auth, administrationController.createAdministration);

router.get('/:id', authService.authAdmin, administrationController.getAdministrationById);
router.delete('/:id', authService.authAdmin, administrationController.deleteAdministrationById);
router.patch('/:id', authService.authAdmin, administrationController.updateAdministration);

router.get('/admin/:id', authService.authAdmin, administrationController.getAdministrationsByIdAdmin);
router.delete('/admin/:id', authService.authAdmin, administrationController.deleteAdministrationByIdAdmin);

router.get('/applicant/:id', authService.authAdmin, administrationController.getAdministrationsByIdApplicant);
router.delete('/applicant/:id', authService.authAdmin, administrationController.deleteAdministrationByIdApplicant);

module.exports = router;