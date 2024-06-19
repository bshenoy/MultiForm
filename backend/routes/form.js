const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');

router.post('/save', formController.saveFormData);
router.get('/retrieve/:userId', formController.retrieveFormData);

module.exports = router;
