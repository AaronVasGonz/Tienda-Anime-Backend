const express = require('express');

const bcrypt = require("bcryptjs");
require('dotenv').config();
const { body, validationResult } = require('express-validator');
const cors = require('cors')
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const routerAtuh = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
routerAtuh.use(express.json());

routerAtuh.get('/auth', authMiddleware, (req, res) => {

    res.json({ message: 'Token válido', user: req.user });

});

module.exports = routerAtuh;
