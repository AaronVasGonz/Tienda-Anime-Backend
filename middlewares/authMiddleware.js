const express = require('express');
const conexion = require('../functions');
const bcrypt = require("bcryptjs");
require('dotenv').config();
const { body, validationResult } = require('express-validator');
const cors = require('cors')
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const connection = mysql.createConnection(config);


const authMiddleware = (req, res, next) => {
    const accessToken = req.headers['authorization'];
    const user = req.headers['user'];

    if (!accessToken) {
        //console.log("Error");
        return res.status(401).json({ error: "Token de autorización no proporcionado" });
    }

    jwt.verify(accessToken, process.env.SECRET, (err, decoded) => {
        if (err) {
            //console.log('Acceso denegado, token expirado o incorrecto');
            return res.status(403).json({ error: "Token expirado o incorrecto" });
        } else {
            //console.log('Funka');

            if (user) {
                const userObject = JSON.parse(user);
                const correo = userObject.correo;

                if (correo) {
                    connection.query("SELECT * FROM  USUARIO WHERE CORREO =  ?", [correo], async (err, results, fields) => {
                        if (err) {
                            //console.error('Error en la consulta a la base de datos:', err);
                            return res.status(500).json({ error: "Error en la consulta a la base de datos" });
                        }

                        if (results.length === 0) {
                            //console.log("Correo no encontrado en la base de datos");
                            return res.status(400).json({ error: "Credenciales inválidas" });
                        }
                        req.user = results[0];
                        //console.log("Existe correo en la base de datos");
                        next();
                    });
                } else {
                    //console.log("Error: No se proporcionó el correo en los headers");
                }
            } else {
                //console.log("Error: No se proporcionó ningún usuario en los headers");

            }
        }
    });
}

module.exports =  authMiddleware;