

const fs = require('fs-extra');
const bcrypt = require("bcryptjs");
const { deleteFilePath } = require('../functions/actions');

const path = require('path');
/*===================================================================== */
/*                        USER                               */
/*===================================================================== */

function getUsersFromDb(connection) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT 
        u.id, 
        u.Nombre, 
        u.Apellido, 
        u.Apellido2, 
        u.correo, 
        u.password, 
        r.id_rol, 
        r.status, 
        r.Rol
    FROM 
        Usuario u
    JOIN 
        Rol r ON u.id = r.id_usuario;`, (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        });
    });
}

function getUserFromDb(connection, correo) {
    return new Promise((resolve, reject) => {
        connection.query("SELECT *FROM  USUARIO WHERE CORREO =  ?", [correo], (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        });
    });
}

function getUserById(connection, id) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT 
            u.id, 
            u.Nombre, 
            u.Apellido, 
            u.Apellido2, 
            u.correo, 
            u.password, 
            r.id_rol, 
            r.status, 
            r.Rol
        FROM 
            Usuario u
        JOIN 
            Rol r ON u.id = r.id_usuario
        WHERE 
            u.id = ?`, [id], (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        });
    });
}

function getAdminRoleFromDb(connection, id) {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT * FROM ROL WHERE id_usuario = ? AND rol = 'ADMIN'",
            [id],
            (err, results) => {
                if (err) {
                    reject(err);
                }
                resolve(results);
            }
        );
    });
}


function checkExistingEmailPromise(connection, email) {
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

async function updateUser(connection, id, nombre, apellido, apellido2, email, roles) {
    try {
        const query = "UPDATE USUARIO SET Nombre = ?, Apellido = ?, Apellido2 = ?, correo = ? WHERE id = ?";
        const result = await connection.query(query, [nombre, apellido, apellido2, email, id]);
        if (!result > 0) {
            console.log("Error al actualizar usuario");
        }
        if (roles) {
            updateRolAdmin(connection, id, roles);
        } else {
            console.log("No hay roles para insertar");
        }
    } catch (error) {

    }
}

function deleteUserAdmin(connection, id) {
    return new Promise((resolve, reject) => {
        connection.query("DELETE FROM rol WHERE id_usuario = ?", [id], (err, result) => {
            if (err) {
                console.error('Error al borrar usuario', err);
                reject(err);
            } else {
                connection.query("DELETE FROM usuario WHERE id = ?", [id], (err, result) => {
                    if (err) {
                        console.error('Error al borrar usuario', err);
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            }
        });
    });
}
async function insertUserAdmin(connection, nombre, apellido, apellido2, email, password, roles) {
    try {
        const userId = Math.floor(Math.random() * 1000000);
        const query = "INSERT INTO USUARIO( id ,Nombre, Apellido, Apellido2, correo, password) VALUES (?,?,?,?,?,?)"
        const result = await connection.query(query, [userId, nombre, apellido, apellido2, email, password]);

        //Insertar el rol despues de insertar el usuario
        // Verificar si userId tiene un valor válido
        if (userId) {
            // Insertar el rol después de insertar el usuario
            await insertRolAdmin(connection, userId, roles);
        } else {
            console.error('Error al obtener el ID del usuario recién insertado');
        }

        return result;

    } catch (error) {
        //console.error('Error al crear Usuario', error);
        throw error;
    }
}

async function updateRolAdmin(connection, idUser, roles) {
    try {
        await connection.query("DELETE FROM rol WHERE id_usuario = ?", [idUser]);
        await insertRolAdmin(connection, idUser, roles);
    } catch (error) {
        //console.log(error);
        throw error;
    }
}

async function insertRolAdmin(connection, idUser, roles) {
    const status = "Activo";
    try {
        if (Array.isArray(roles)) {
            // Si roles es un array, insertar cada rol en la tabla de rol
            for (const rol of roles) {
                const query = "INSERT INTO Rol (id_usuario, status, Rol) VALUES (?, ?, ?)";
                await connection.query(query, [idUser, status, rol]);
            }
        } else {
            // Si roles es un valor único, insertarlo una sola vez
            const query = "INSERT INTO Rol (id_usuario, status, Rol) VALUES (?, ?, ?)";
            await connection.query(query, [idUser, status, roles]);
        }
    } catch (error) {
        //console.log(error);
        throw error;
    }
}



/*========================================================================================================================================= */
/*                        COLLECTIONS                                   */
/*========================================================================================================================================= */

function getCollections(connection) {
    return new Promise((resolve, reject) => {
        connection.query("SELECT *FROM Coleccion", (err, results) => {
            if (err) reject(err);
            if (results.length === 0) {
                reject(new Error("Datos no encontrados"));
            }

            resolve(results);
        })
    })
}

function getCollectionByName(connection, name, fileNamePath) {
    const nameToLowerCase = name.toLowerCase();
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM COLECCION WHERE LOWER(Nombre_Coleccion) = ?', [nameToLowerCase], (err, results) => {
            if (err) {
                reject(err);
                deleteFilePath(fileNamePath);
            } else {
                resolve(results);
            }
        });
    });
}

function getCollectionById(connection, id) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM COLECCION WHERE id = ?', [id], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function saveCollectionToDb(connection, Nombre_Coleccion, Descripcion, status, fileName, fileNamePath) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO COLECCION (Nombre_Coleccion, Descripcion, status, imagen) VALUES (?,?,?,?)', [Nombre_Coleccion, Descripcion, status, fileName], (err, result) => {
            if (err) {
                reject(err);
                deleteFilePath(fileNamePath);
            } else {
                resolve(result);
            }
        });
    });
}

function updateCollectionToDb(connection, id, Nombre_Coleccion, Descripcion, status, imagen, fileNamePath) {
    return new Promise((resolve, reject) => {
        // Obtener la ruta de la imagen anterior
        connection.query('SELECT imagen FROM COLECCION WHERE id = ?', [id], (err, result) => {
            if (err) {
                reject(err);
                deleteFilePath(fileNamePath);
            } else {
                const previousImagePath = result[0].imagen;
                // Actualizar la colección en la base de datos
                connection.query(
                    'UPDATE COLECCION SET Nombre_Coleccion = ?, Descripcion = ?, status = ?, imagen = ? WHERE id = ?',
                    [Nombre_Coleccion, Descripcion, status, imagen, id],
                    (err, result) => {
                        if (err) {
                            reject(err);
                            deleteFilePath(fileNamePath);
                        } else {
                            // Eliminar la imagen anterior después de la actualización exitosa
                            if (previousImagePath && fileNamePath) {
                                const previousImageFullPath = path.join(__dirname, '..', 'images', 'collections', previousImagePath);
                                fs.unlink(previousImageFullPath, (err) => {
                                    if (err) {
                                        //console.error(`Error al eliminar la imagen anterior: ${err}`);
                                    } else {
                                        //console.log(`Imagen anterior eliminada: ${previousImageFullPath}`);
                                    }
                                });
                            }
                            resolve(result);
                        }
                    }
                );
            }
        });
    });
}

function deleteCollectionToDb(connection, id) {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM COLECCION WHERE id = ?', [id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

/*===================================================================== */
/*                        ...                                  */
/*===================================================================== */


module.exports = {
    getUserFromDb, getAdminRoleFromDb,
    getCollections, getCollectionByName,
    saveCollectionToDb, getCollectionById,
    updateCollectionToDb, deleteCollectionToDb,
    getUsersFromDb, checkExistingEmailPromise,
    insertUserAdmin, insertRolAdmin,
    getUserById,  updateUser,
    deleteUserAdmin
   
};

