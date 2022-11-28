const express = require('express');
const router = express.Router();
const cacheService = require('../services/cache')

router.delete('/', cacheService.deleteCache);

module.exports = router;