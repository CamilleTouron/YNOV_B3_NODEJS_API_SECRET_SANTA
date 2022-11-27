const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event')

router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);
router.post('/', eventController.createEvent);
router.delete('/:id', eventController.deleteEventById);
router.patch('/:id', eventController.updateEvent);


module.exports = router;