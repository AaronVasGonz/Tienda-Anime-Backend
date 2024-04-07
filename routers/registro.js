const express = require('express');
const conexion = require('../functions');
const bcrypt = require("bcryptjs");
const { body, validationResult } = require('express-validator');
const cors = require('cors')
const mysql = require('mysql');
const config = require('../config/config');
const routerRegistro = express.Router();

//Middleware
routerRegistro.use(express.json());

routerRegistro.get('/registro', (req, res) => {
    conexion()
        .then((connection) => {
            // Aquí puedes realizar operaciones con la conexión si es necesario
            res.send('Registro');
        })
        .catch((err) => {
            console.error('Error al establecer la conexión:', err);
            res.status(500).send('Error al conectar con la base de datos');
        });
});


routerRegistro.post("/registro", [
    body('nombre')
        .isString()
        .withMessage('El nombre debe ser una cadena de texto')
        .trim()
        .notEmpty()
        .withMessage('El nombre es obligatorio'),

    body('apellido')
        .isString()
        .withMessage('El apellido debe ser una cadena de texto')
        .trim()
        .notEmpty()
        .withMessage('El apellido es obligatorio'),

    body('apellido2')
        .optional({ nullable: true })
        .isString()
        .withMessage('El segundo apellido debe ser una cadena de texto')
        .trim(),

    body("email")
        .isEmail()
        .withMessage('El correo debe contener @ y com'),
    body("password")
        .isLength({ min: 8, max: 16 })
        .withMessage('La contraseña debe tener entre 8 y 16 caracteres')
        .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^\s]).{8,16}$/)
        .withMessage('La contraseña debe contener al menos un dígito, una letra minúscula y una letra mayúscula, y no puede contener espacios')
        .trim()

], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const formData = req.body;
    //console.log('Datos recibidos en el servidor:', formData);
    // Realiza las operaciones necesarias con los datos recibidos

    const { email } = formData;
    const { nombre } = formData;
    const { apellido } = formData;
    const { apellido2 } = formData;
    const { password } = formData;
    const rondasDeSal = 10;
    try {
        const { exists, message } = await checkExistingEmailPromise(email);
        if (exists) {
            console.log(message);
            return res.status(400).json({ error: message });
        }
        bcrypt.hash(password, rondasDeSal, (err, passwordHash) => {
            if (err) {
                console.log("Error hasheando:", err)

            } else {
                //console.log("Password hasheada es:" + passwordHash)
                const result = insertUser(nombre, apellido, apellido2, email, passwordHash);

                res.status(200).json({ message: 'Registro exitoso' });
            }
        })

    } catch (err) {
        console.error('Error al consultar la base de datos o al crear el usuario:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

function checkExistingEmailPromise(email) {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(config);
        connection.query('SELECT * FROM usuario WHERE correo = ?', [email], (err, results) => {
            connection.end();
            if (err) {
                return reject(err);
            }
            const exists = results.length > 0;
            const response = {
                exists,
                message: exists ? 'El correo ya esta registrado' : null
            }

            resolve(response);


        });
    });
}


async function insertUser(nombre, apellido, apellido2, email, password) {
    try {
        const connection = await mysql.createConnection(config);
        const userId = Math.floor(Math.random() * 1000000); 
        const query = "INSERT INTO USUARIO( id ,Nombre, Apellido, Apellido2, correo, password) VALUES (?,?,?,?,?,?)"
        const result = await connection.query(query, [userId,nombre, apellido, apellido2, email, password]);

        //Insertar el rol despues de insertar el usuario
        // Verificar si userId tiene un valor válido
        if (userId) {
            // Insertar el rol después de insertar el usuario
            await insertRol(userId);
        } else {
            console.error('Error al obtener el ID del usuario recién insertado');
        }

        connection.end();
        return result;
    } catch (error) {
        console.error('Error al crear Usuario', error);
        throw error;
    }
}

async function insertRol(idUser) {
    const status = "Activo"
    const Rol = "USER"

    try {
        const connection = await mysql.createConnection(config);
        const query = "Insert into Rol (id_usuario, status , Rol) values (?,?,?)"
        const result = await connection.query(query, [idUser, status, Rol])
        connection.end();
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }


}



module.exports = routerRegistro;