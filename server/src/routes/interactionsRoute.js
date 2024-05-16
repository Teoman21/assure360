// routes/interactionsRouter.js
const express = require('express');
const router = express.Router();
const interactionsController = require('../controllers/interactionsContoller');

router.get('/', interactionsController.getAllInteractions);
router.get('/:id', interactionsController.getInteractionById);
router.post('/', interactionsController.createInteraction);
router.put('/:id', interactionsController.updateInteraction);
router.delete('/:id', interactionsController.deleteInteraction);

module.exports = router;