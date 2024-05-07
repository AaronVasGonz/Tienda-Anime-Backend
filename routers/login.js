const express = require('express');
const routerLogin = express.Router();
const {login} = require('../controllers/loginController');
//Middleware
routerLogin.use(express.urlencoded({ extended: false }));

routerLogin.use(express.json());

//asignamos la ruta post login para las request y los res desde el proyecto de react tienda anime
routerLogin.post('/login', login);

module.exports = routerLogin;