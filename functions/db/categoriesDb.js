



function getCategoryById(connection, id) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM tipo WHERE id_tipo = ?', [id], (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        });
    })
}

function getCategoriesFromDb(connection) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM tipo', (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        });
    });
}

function saveCategory(connection, Detalle, status) {
    return new Promise((resolve,reject)=>{
        connection.query
        ('INSERT INTO tipo (Detalle, status) VALUES (?,?)', [Detalle ,status], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })
    })
}

function updateCategory(connection, id, Detalle, status) {
    return new Promise((resolve,reject)=>{
        connection.query
        ('UPDATE tipo SET Detalle = ?, status = ? WHERE id_tipo = ?', [Detalle ,status, id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })
    })
}

function deleteCategory(connection, id) {
    return new Promise((resolve,reject)=>{
        connection.query
        ('DELETE FROM tipo WHERE id_tipo = ?', [id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })
    });
}

function getCategoryNameById(connection , id_Categoria) {
    id_Categoria = parseInt(id_Categoria);
    return new Promise((resolve, reject) => {
        connection.query('SELECT Detalle FROM tipo where id_tipo = "?"',[id_Categoria],(err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        });
    });
}
module.exports = {getCategoriesFromDb, saveCategory,
                 updateCategory, getCategoryById, deleteCategory, getCategoryNameById};
