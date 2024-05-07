const mysql = require('mysql');
const config = require('../config/config');
const connection = mysql.createConnection(config);
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const { checkExistingEmailPromise, insertUser } = require('../functions/db/signUp');
const SignUp = async (req, res) => {

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
        const { exists, message } = await checkExistingEmailPromise(connection, email);
        if (exists) {
            return res.status(400).json({ error: message });
        }
        bcrypt.hash(password, rondasDeSal, async (err, passwordHash) => {
            if (err) {
                console.log("Error hasheando:", err)
            } else {
                //console.log("Password hasheada es:" + passwordHash)
                const result = await insertUser(connection, nombre, apellido, apellido2, email, passwordHash);
                res.status(200).json({ message: 'Registro exitoso' });
            }
        });
    } catch (err) {
        console.error('Error al consultar la base de datos o al crear el usuario:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

const validateSignUp = [
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

];

module.exports = { SignUp, validateSignUp };