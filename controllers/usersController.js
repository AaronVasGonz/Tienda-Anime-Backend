

const mysql = require('mysql');
const config = require('../config/config');
const { body, validationResult } = require('express-validator');
const connection = mysql.createConnection(config);
const { getUsersFromDb, checkExistingEmailPromise,
    insertUserAdmin, getUserById,
    updateUser, deleteUserAdmin } = require('../functions/dbFunctions');
const bcrypt = require("bcryptjs");



const GetUsers = async (req, res) => {
    try {
        const users = await getUsersFromDb(connection);
        if (users.length === 0) {
            return res.status(404).json({ error: 'No se encontraron usuarios' });
        }

        return res.status(200).json({ users });

    } catch (error) {
        console.log(error);
    }
}

const CreateUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { nombre, apellido, apellido2, email, password, roles } = req.body;
    try {
        const { exists, message } = await checkExistingEmailPromise(connection, email);
        if (exists) {
            return res.status(400).json({ error: message });
        }

        bcrypt.hash(password, 10, async (err, passwordHash) => {
            if (err) {
                console.log("Error hasheando:", err)
            } else {
                const result = insertUserAdmin(connection, nombre, apellido, apellido2, email, passwordHash, roles);
                res.status(200).json({ message: 'Cuenta creada demanera exitosa!' });
            }
        })

    } catch (error) {
        console.log(error);
    }
}

const GetUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await getUserById(connection, id);
        if (!user) {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error("Error del servidor:", error);
    }
}


const UpdateUser = async (req, res) => {
    const { id } = req.params;
    const { Nombre, Apellido, Apellido2, correo, roles } = req.body;
    try {
        const user = updateUser(connection, id, Nombre, Apellido, Apellido2, correo, roles);
        if (!user) {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json({ "message": "Usuario actualizado" });
    } catch (error) {
        console.error("Error del servidor:", error);
    }
}


const DeleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await deleteUserAdmin(connection, id);
        console.log(result);

        if (!result > 0) {
            console.log("Error al borrar usuario");
            return res.status(500).json({ error: 'Error al eliminar en la base de datos' });

        }
        console.log("Usuario borrado correctamente");
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error("Error al borrar usuario", error);
    }

}

const validateUser = [
    body('nombre', 'El nombre es obligatorio').not().isEmpty(),
    body('apellido', 'El apellido es obligatorio').not().isEmpty(),
    body('apellido2')
        .optional({ nullable: true })
        .isString()
        .withMessage('El segundo apellido debe ser una cadena de texto')
        .trim(),
    body('email', 'Email no válido').isEmail(),
    body("password")
        .isLength({ min: 8, max: 16 })
        .withMessage('La contraseña debe tener entre 8 y 16 caracteres')
        .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^\s]).{8,16}$/)
        .withMessage('La contraseña debe contener al menos un dígito, una letra minúscula y una letra mayúscula, y no puede contener espacios')
        .trim()
];

module.exports = { GetUsers, CreateUser, GetUserById, UpdateUser, DeleteUser,validateUser };

