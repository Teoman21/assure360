const express = require('express');
const router = express.Router();
const policiesController = require('../controllers/policiesController');

router.get('/', policiesController.getAllPolicies);
router.get('/:id', policiesController.getPolicyById);
router.post('/', policiesController.createPolicy);
router.put('/:id', policiesController.updatePolicy);
router.delete('/:id', policiesController.deletePolicy);

module.exports = router;
