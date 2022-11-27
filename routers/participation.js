const express = require('express');
const router = express.Router();
const participationController = require('../controllers/participation')

router.get('/', participationController.getParticipations);
router.get('/:id', participationController.getParticipationById);
router.post('/', participationController.createParticipation);
router.delete('/:id', participationController.deleteParticipationById);
router.patch('/:id', participationController.updateParticipation);


module.exports = router;