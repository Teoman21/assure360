const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getUsers);
router.delete('/:id', userController.deleteUser);
router.get('/me', userController.getUserRole)

module.exports = router;
