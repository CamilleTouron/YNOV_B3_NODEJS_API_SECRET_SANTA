const express = require('express');
const router = express.Router();
const authService = require('../controllers/login');
const cacheService = require('../services/cache');

router.delete('/',authService.authAdmin ,cacheService.deleteCache);

module.exports = router;