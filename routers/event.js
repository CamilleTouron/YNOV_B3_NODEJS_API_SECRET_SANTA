const express = require('express');
const router = express.Router();
const authService = require('../controllers/login');
const eventController = require('../controllers/event')

router.get('/', authService.authAdmin, eventController.getEvents);
router.get('/:id', authService.auth, eventController.getEventById);
router.post('/', authService.auth, eventController.createEvent);
router.delete('/:id', authService.authOrganizerOrAdmin, eventController.deleteEventById);
router.patch('/:id', authService.authOrganizerOrAdmin, eventController.updateEvent);
router.patch('/draw/:id', authService.authOrganizerOrAdmin, eventController.drawAssociationForEvent);


module.exports = router;