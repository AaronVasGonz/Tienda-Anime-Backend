
const jwt = require('jsonwebtoken');

const verifyUser = async (token) => {
    try {
        const decoded = await jwt.verify(token, process.env.SECRET);
        return decoded;
    } catch (err) {
        throw err;
    }
}

module.exports = { verifyUser };