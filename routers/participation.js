const express = require('express');
const router = express.Router();
const authService = require('../controllers/login');
const participationController = require('../controllers/participation')

router.get('/', authService.authAdmin, participationController.getParticipations);
router.get('/:id', authService.authOrganizerOrAdmin, participationController.getParticipationById);
router.post('/', authService.authOrganizerOrAdmin, participationController.createParticipation);
router.delete('/:id', authService.authOrganizerOrAdmin, participationController.deleteParticipationById);
router.patch('/:id', authService.authOrganizerOrAdmin, participationController.updateParticipation);


module.exports = router;