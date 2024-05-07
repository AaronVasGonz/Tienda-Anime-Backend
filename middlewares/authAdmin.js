

require('dotenv').config();
const mysql = require('mysql');
const config = require('../config/config');
const connection = mysql.createConnection(config);
const {getAdminRoleFromDb, getUserFromDb} = require('../functions/dbFunctions');
const { verifyUser } = require('../functions/jwt');

const authAdmin = async (req, res, next) => {
    // Get the access token from the request headers
    const accessToken = req.headers['authorization'];

    // If the access token is not provided, return an authentication error
    if (!accessToken) {
        return res.status(401).json({ error: "Authorization token not provided" });
    }

    try {
        // Verify the user token using the access token
        const userObject = await verifyUser(accessToken);

        // Extract the email and id from the user object
        const { correo, id } = userObject;

        // If the email is not provided, return an invalid credentials error
        if (!correo) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Get the user from the database using the email
        const results = await getUserFromDb(connection, correo);

        // If the user is not found, return an invalid credentials error
        if (results.length === 0) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // If the id is not provided, return an invalid credentials error
        if (!id) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Get the admin role from the database using the id
        const adminResults = await getAdminRoleFromDb(connection, id);

        // If the admin role is not found, return an access denied error
        if (adminResults.length === 0) {
            return res.status(403).json({ error: "Access denied." });
        }

        // Call the next middleware
        next();

    } catch (err) {
        // If there is an error verifying the token, return an invalid token error
        return res.status(403).json({ error: "Invalid token" });
    }
}

// Export the authentication middleware function
module.exports = authAdmin;


