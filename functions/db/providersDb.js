function getProviders (connection) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM proovedor', (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        });
    });
}

function getProviderById(connection, id) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM proovedor WHERE id = ?', [id], (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        });
    });
}

function saveProvider(connection, sanitizedName, sanitizedDescription, sanitizedNumber, sanitizedEmail, sanitizedAddress, sanitizedSatus){

    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO Proovedor (Nombre_Proovedor, Descripcion, Numero_Proovedor, Direccion_Proovedor , status_Proovedor, correo) VALUES (?,?,?,?,?,?)`,
        [sanitizedName, sanitizedDescription, sanitizedNumber, sanitizedAddress, sanitizedSatus, sanitizedEmail], (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        });
    })
}

function updateProvider (connection, id, sanitizedName, sanitizedDescription, sanitizedNumber, sanitizedEmail, sanitizedAddress, sanitizedSatus) {

    return new Promise((resolve, reject) => {
        connection.query(`UPDATE Proovedor SET Nombre_Proovedor = ?, Descripcion = ?, Numero_Proovedor = ?, Direccion_Proovedor = ?, status_Proovedor = ?, correo = ? WHERE id = ?`,
        [sanitizedName, sanitizedDescription, sanitizedNumber, sanitizedAddress, sanitizedSatus, sanitizedEmail, id], (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        });
    })
}

function deleteProvider(connection, id) {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM Proovedor WHERE id = ?', [id], (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        });
    });
}



module.exports = { getProviders, saveProvider,
                   getProviderById , updateProvider,
                   deleteProvider}