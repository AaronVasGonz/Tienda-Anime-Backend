function checkExistingEmailPromise(connection,email) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM usuario WHERE correo = ?', [email], (err, results) => {
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

function insertUser(connection,nombre, apellido, apellido2, email, password) {
    try {
        const userId = Math.floor(Math.random() * 1000000);
        return new Promise((resolve, reject) => {
            connection.query("INSERT INTO USUARIO( id ,Nombre, Apellido, Apellido2, correo, password) VALUES (?,?,?,?,?,?)", [userId, nombre, apellido, apellido2, email, password], (err, result) => {
                if (err) {
                    console.error('Error al insertar usuario', err);
                    reject(err);
                } else {
                    if (userId) {
                        insertRol(connection, userId);
                        resolve(result);
                    }
                }
            });
        })

    } catch (error) {
        console.error('Error al crear Usuario', error);
        throw error;
    }
}

function insertRol(connection, idUser) {

    const status = "Activo"
    const Rol = "USER"
    try {
        return new Promise((resolve, reject) => {
            connection.query("INSERT INTO Rol (id_usuario, status , Rol) values (?,?,?)", [idUser, status, Rol], (err, result) => {
                if (err) {
                    console.error('Error al insertar rol', err);
                    reject(err);
                }
                resolve(result);
            })
        })
    } catch (error) {
        //console.log(error);
        throw error;
    }
}
module.exports = {checkExistingEmailPromise, insertUser}