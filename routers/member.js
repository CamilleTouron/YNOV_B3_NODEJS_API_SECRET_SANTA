const express = require('express');
const router = express.Router();
const authService = require('../controllers/login');
const memberController = require('../controllers/member')

router.get('/', authService.authAdmin, memberController.getMembers);
router.get('/:id', authService.auth, memberController.getMemberById);
router.post('/', memberController.createMember);
router.delete('/admin/:id', authService.authAdmin, memberController.deleteMemberByIdAdmin);
router.delete('/:id', authService.auth, memberController.deleteMemberById);
router.patch('/:id', authService.auth, memberController.updateMember);


module.exports = router;