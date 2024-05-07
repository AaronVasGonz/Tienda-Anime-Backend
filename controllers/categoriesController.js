const mysql = require('mysql');
const config = require('../config/config');
const connection = mysql.createConnection(config);
const { getCategoriesFromDb, saveCategory,
    getCategoryById, updateCategory,
    deleteCategory } = require('../functions/db/categoriesDb');


const getCategories = async (req, res) => {
    try {
        const categories = await getCategoriesFromDb(connection);
        if (categories.length === 0) {
            return res.status(404).json({ error: 'No se encontraron categorías' });
        }
        res.json({ categories: categories });

    } catch (error) {
        res.status(500).json({ error: 'Error al obtener categorías' });
        //console.log(error);
    }
}

const createCategory = async (req, res) => {
    const { Detalle, status } = req.body;
    try {
        const result = await saveCategory(connection, Detalle, status);
        if (!result) {
            return res.status(500).json({ error: 'Error al insertar en la base de datos' });
        }
        res.status(200).json({ message: 'Categoría insertada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al insertar en la base de datos' });
        throw error;
    }
}

const getCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await getCategoryById(connection, id);
        if (result.length === 0) {
            res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.status(200).json({ category: result[0] });
    } catch (error) {
        //console.log(error);
        res.status(500).json({ error: 'Error al obtener categoría' });
    }
}

const updateCategoryC = async (req, res) => {
    const { id } = req.params;
    const { sanitizedStatus, sanitizedDetalle } = req.body;
    try {
        const result = await updateCategory(connection, id, sanitizedDetalle, sanitizedStatus ); 
        if (!result) {
            return res.status(500).json({ error: 'Error al insertar en la base de datos' });
        }
        res.status(200).json({ message: 'Categoría actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al insertar en la base de datos' });
        //console.log(error);
    }
}


const DeleteCategory = async (req,res)=>{
    const { id } = req.params;
    try {
        const result = await deleteCategory(connection, id);
        if (!result) {
            return res.status(500).json({ error: 'Error al insertar en la base de datos' });
        }
        res.status(200).json({ message: 'Categoría eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al insertar en la base de datos' });
        //console.log(error);
    }
}


module.exports = { getCategories, createCategory, getCategory, updateCategoryC, DeleteCategory};





