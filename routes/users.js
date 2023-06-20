const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

    router.get('/login', userController.loginView);


    router.get('/register', userController.registerView);

    router.post('/register', userController.registerStore);

    router.post('/login', userController.loginPass);

    router.get('/logout', userController.logoutHandle);


module.exports = router;