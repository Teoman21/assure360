// ClaimsRouter.js
const express = require('express');
const router = express.Router();
const claimsController = require('../controllers/claimsController');

router.get('/', claimsController.getAllClaims);
router.get('/:id', claimsController.getClaimById);
router.post('/', claimsController.createClaim);
router.put('/:id', claimsController.updateClaim);
router.delete('/:id', claimsController.deleteClaim);

module.exports = router;
