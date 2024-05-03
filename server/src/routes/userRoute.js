// userRoute.js
const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/userController.js');

router.get('/users', getUsers);

module.exports = router;
