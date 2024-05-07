const express = require('express');
const { body, validationResult } = require('express-validator');
const mysql = require('mysql');
const config = require('../config/config');
const routerProducts = express.Router();
const path = require('path');
const cors = require('cors');
const { getProductsAdmin, getProductByName, saveProduct, getProductById } = require('../functions/db/productsDb');
const { getCategoryNameById } = require('../functions/db/categoriesDb');
const { deleteMultipleFiles } = require('../functions/actions');
const connection = mysql.createConnection(config);
const authAdmin = require('../middlewares/authAdmin');
const fs = require('fs');
const multer = require('multer');
const diskstorage = multer.diskStorage({
    destination: path.join(__dirname, '../images/products'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-Product-' + file.originalname)
    },
})
const uploadFile = multer({
    storage: diskstorage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50 MB (límite por archivo)
        fieldSize: 200 * 1024 * 1024 // 200 MB (límite para todos los campos de texto/datos combinados)
    }
}).array('fileImages');


routerProducts.use(cors());
routerProducts.use(express.json());


routerProducts.get('/productsAdmin', authAdmin, async (req, res) => {
    try {
        const result = await getProductsAdmin(connection);
        if (result.length === 0) {

            return res.status(404).json({ error: 'No se encontraron productos' });
        }
        return res.status(200).json({ products: result });
    } catch (error) {
        //console.log(error);
    }
})

routerProducts.post('/productsAdmin', authAdmin, uploadFile, async (req, res) => {
    const formData = JSON.parse(req.body.data);
    const images = req.files.map(file => file.filename).join(',');
    const filePaths = [];
    req.files.forEach(file => { filePaths.push(file?.path) ?? null; });
    const { Nombre_Producto, Descripcion, Precio, Cantidad, category, provider, collection, status } = formData;
    try {
        let categoryName = await getCategoryNameById(connection, category);
        categoryName = categoryName[0].Detalle;
        if (categoryName === "Ropas") {
            deleteMultipleFiles(filePaths);
            return res.status(400).json({ error: 'La categoria Ropas no esta disponible en este formulario' });
        }
        const results = await getProductByName(connection, Nombre_Producto);
        if (results.length > 0) {
            deleteMultipleFiles(filePaths);
            return res.status(400).json({ error: 'El producto ya existe' });
        }
        const result = await saveProduct(connection, Nombre_Producto, Descripcion, Precio, collection, category, provider, Cantidad, images, filePaths, status);
        if (!result) {
            deleteMultipleFiles(filePaths);
            return res.status(500).json({ error: 'Error al insertar en la base de datos' });
        }
        res.status(200).json({ message: 'Producto insertado correctamente' });
    } catch (error) {
        deleteMultipleFiles(filePaths);
        res.status(500).json({ error: 'Error al insertar en la base de datos' });
        //console.log(error);
    }

});

routerProducts.get('/productsAdmin/:id', authAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await getProductById(connection, id);
        if (result.length === 0) {
            return res.status(404).json({ error: 'No se encontraron productos' });
        }
        return res.status(200).json({ product: result });

    } catch (error) {
        res.status(500).json({ error: 'Error al obtener proveedor' });
        console.log(error);
    }
});

routerProducts.put('/productsAdmin/:id', authAdmin, uploadFile, async (req, res) => {
    const { id } = req.params;
    const formData = JSON.parse(req.body.data);
    const textImages = req.body.textImages;
    const fileImages = req.files;
    var images = "";
    if (fileImages.length === 0) {
         images = textImages.map(text => text).join(',');
    }

    else if ( textImages === undefined) {
         images = req.files.map(file => file.filename).join(',');
        const filePaths = [];
        req.files.forEach(file => { filePaths.push(file?.path) ?? null; });
    }
    else {
        var images1 = req.files.map(file => file.filename).join(',');
        var images2 = textImages.map(text => text).join(',');
        images = images1 + ',' + images2;
        const filePaths = [];
        req.files.forEach(file => { filePaths.push(file?.path) ?? null; });
    }
    const filePaths = [];
    req.files.forEach(file => { filePaths.push(file?.path) ?? null; });
    const { Nombre_Producto, Descripcion_Producto, Precio, Cantidad, category, provider, collection, status } = formData;
    try {
        console.log(images);
        deleteMultipleFiles(filePaths);
    } catch (error) {
        console.log(error);
    }
})
module.exports = routerProducts;