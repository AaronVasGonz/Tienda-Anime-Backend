

const getUserByEmail = async (connection, email) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM usuario WHERE correo = ?', [email], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

const getRolUser = async (connection, id) => {
    let roleUser = 'USER';
    let roleAdmin = null;
    return new Promise((resolve, reject) => {
        connection.query('SELECT id_Usuario, Rol FROM rol WHERE id_usuario = ?', [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            if (results.length === 1) {
                roleUser = results[0].Rol;
            }
            else if (results.length > 0) {
                roleUser = results[0].Rol;
                roleAdmin = results[1].Rol;
            }
            else{
                roleUser = 'USER';
            }
            resolve({ roleUser, roleAdmin });
        });
    });
}
module.exports = { getUserByEmail, getRolUser }