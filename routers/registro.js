const express = require('express');
const cors = require('cors')
const routerRegistro = express.Router();
const {SignUp, validateSignUp} = require('../controllers/signUpController');
//Middleware
routerRegistro.use(express.json());

routerRegistro.post("/registro", validateSignUp , SignUp);

module.exports = routerRegistro;