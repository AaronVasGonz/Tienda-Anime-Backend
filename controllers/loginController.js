const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const connection = mysql.createConnection(config);
const bcrypt = require("bcryptjs");
const { getUserByEmail, getRolUser } = require('../functions/db/login');
require('dotenv').config();;

const login = async (req, res) => {
    //Asignamos las variables correo y password desestructurando elbody
    const { correo, password } = req.body;
    try {
        //Verificamos si el correo existe
        const userDb = await getUserByEmail(connection, correo);
        //Si no existe retornara un error de credenciales invalidas
        const userData = userDb[0];

        //verificar si la password del correo es igual a la enviada por el req por medio de bcrypt
        const isPasswordValid = await bcrypt.compare(password, userData.password);
        //Si es diferente entonces retornara invalidacion de credenciales
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Credenciales invalidas" });
        }

        const rolesData = await getRolUser(connection, userData.id);
        const user = {
            id: userData.id,
            correo: correo,
            roles: {
                rolUsuario: rolesData.roleUser,
                roleAdministrador: rolesData.roleAdmin
            }
        }
        console.log(user);
        const accessToken = generateAccessToken(user);
        res.header('Authorization', `Bearer ${accessToken}`).json({
            message: 'Usuario autenticado',
            token: accessToken,
            user: user
        });
    } catch (error) {
        //console.log(error)
        return res.json({ error: "Error interno del servidor" })
    }
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.SECRET, { expiresIn: '190m' })
}

module.exports = { login }