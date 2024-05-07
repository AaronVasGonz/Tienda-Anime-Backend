const { deleteMultipleFiles } = require('../actions');

function getProductsAdmin(connection) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM Vista_Productos', (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function getProductByName(connection, name) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM Vista_Productos WHERE Nombre_Producto = ?', [name], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function saveProduct(connection, Nombre_Producto, Descripcion, Precio, collection, category, provider, Cantidad, images, filePaths, status) {
    return new Promise((resolve, reject) => {
        connection.query('CALL InsertarProductoInventario(?, ?, ?, ?, ?, ?, ?, ?, ?)', [Nombre_Producto, Descripcion, Precio, collection, category, provider, Cantidad, images, status], (err, results) => {
            if (err) {
                deleteMultipleFiles(filePaths);
                reject(err);
            } else {
                resolve(results);
            }
        })
    })
}

function getProductById(connection, id) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM Vista_Producto WHERE id = ?', [id], (err, results) => {
            if (err) {
                reject(err);
            } else {
                connection.query('SELECT *FROM IMAGEN WHERE id_producto = ?', [id], (err, results2) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            product: results,
                            images: results2
                        });
                    }
                })
            }
        });
    });
}

module.exports = { getProductsAdmin, getProductByName, getProductById ,saveProduct }