const express = require('express');
const router = express.Router();
const memberController = require('../controllers/member')

router.get('/', memberController.getMembers);
router.get('/:id', memberController.getMemberById);
router.post('/', memberController.createMember);
router.delete('/:id', memberController.deleteMemberById);
router.patch('/:id', memberController.updateMember);


module.exports = router;