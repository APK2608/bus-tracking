const express = require('express');
const router = express.Router();
const busController = require('../controllers/bus.controller');

router.get('/', busController.getBuses);
router.post('/', busController.createBus);

module.exports = router;
