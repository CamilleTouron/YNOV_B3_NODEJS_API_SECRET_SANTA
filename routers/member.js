const express = require('express');
const router = express.Router();
const authService = require('../controllers/login');
const memberController = require('../controllers/member')

router.get('/', authService.authAdmin, memberController.getMembers);
router.get('/:id', authService.auth, memberController.getMemberById);
router.post('/', memberController.createMember);
router.delete('/:id', authService.authAdmin, memberController.deleteMemberById);
router.patch('/:id', authService.authAdmin, memberController.updateMember);


module.exports = router;