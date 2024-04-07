const express = require('express');
const conexion = require('../functions');
const bcrypt = require("bcryptjs");
require('dotenv').config();
const { body, validationResult } = require('express-validator');
const cors = require('cors')
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const routerLogin = express.Router();
const connection = mysql.createConnection(config);
//Middleware
routerLogin.use(express.urlencoded({ extended: false }));
routerLogin.use(express.json());
routerLogin.get('/login', (req, res) => {

});
//asignamos la ruta post login para las request y los res desde el proyecto de react tienda anime
routerLogin.post('/login', async (req, res) => {
    //Generamos la informacion del formulario en un formData a traves de los datos del body
    const formData = req.body;
    //Asignamos las variables correo y password desestructurando el form data
    const { correo, password } = formData;

    //un console.log para verificar que los datos existen
    //console.log('Datos recibidos en el servidor:', formData);
    //bloque try and catch para manejo de los errores del servidor
    try {
        //consulta para buscar todas las rows donde el correo del usuario sea  = al traido por medio del request
        //uso de un callback con parametros errorr, resultados y fields para el manejo de la informacion que sera devuelta
        connection.query("SELECT * FROM  USUARIO WHERE CORREO =  ?", [correo], async (err, results, fields) => {
            //SI hay un error entonces tirara el error a consola
            if (err) throw err;
            //si los resultados de la query son igual a 0 entonces enviara una respuesta de credenciales invalidas
            if (results.length === 0) {
                return res.status(400).json({ error: "Credenciales invalidas" });

            }
            //guardo el usuario en el primer resultado del array results
            const user = results[0]

            //verificar si la password del correo es igual a la enviada por el req por medio de bcrypt
            const isPasswordValid = await bcrypt.compare(password, user.password);
            //Si es diferente entonces retornara invalidacion de credenciales
            if (!isPasswordValid) {
                return res.status(400).json({ error: "Credenciales invalidas" });
            }
            //Si todo es valido enviara un mensaje por medio de json con un Inicio de Sesion exitoso
            connection.query("Select id_Usuario, Rol from rol where id_usuario = ?", [user.id], async (err, roleResults, fields) => {

                let roleUser = 'USER';
                let roleAdmin = null;
                if (!err) {
                    if (roleResults.length > 0) {
                        roleUser = roleResults[0].Rol;

                    }

                    if (roleResults.length > 1) {
                        roleAdmin = roleResults[1].Rol;
                    }
                } else {
                    console.error("Error al consultar roles:", err);
                }

                //console.log("Rol de usuario:", roleUser);
                //console.log("Rol de administrador:", roleAdmin);
                //console.log(roleResults.length);
                const user = {
                    correo: correo,
                    roles: {
                        rolUsuario: roleUser,
                        roleAdministrador : roleAdmin
                    }

                }

            

                const accessToken = generateAccessToken(user);
                res.header('Authorization', `Bearer ${accessToken}`).json({
                    message: 'Usuario autenticado',
                    token: accessToken,
                    user: user
                });
            });

        });
    } catch (error) {
        //console.log(error)
        return res.json({ error: "Error interno del servidor" })
    }
});



function generateAccessToken(user) {
    return jwt.sign(user, process.env.SECRET, { expiresIn: '120m' })
}





module.exports = routerLogin;