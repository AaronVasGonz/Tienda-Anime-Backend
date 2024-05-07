
const mysql = require('mysql');
const config = require('../config/config');
const connection = mysql.createConnection(config);
const { body, validationResult } = require('express-validator');

const { getProviders, saveProvider,
    getProviderById, updateProvider,
    deleteProvider
} = require('../functions/db/providersDb');
const authAdmin = require('../middlewares/authAdmin');


const GetProviders = async (req, res) => {
    try {
        const result = await getProviders(connection);
        if (result.length === 0) {
            return res.status(404).json({ error: 'No se encontraron proveedores' });
        }
        res.status(200).json({ providers: result });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener proveedores' });
        //console.log(error);
    }
}

const CreateProvider = async (req, res) => {
    const { sanitizedName, sanitizedDescription, sanitizedNumber, sanitizedEmail, sanitizedAddress, sanitizedSatus } = req.body;
    try {
        const result = await saveProvider(connection, sanitizedName, sanitizedDescription, sanitizedNumber, sanitizedEmail, sanitizedAddress, sanitizedSatus);
        if (!result) {
            return res.status(500).json({ error: 'Error al insertar en la base de datos' });
        }
        res.status(200).json({ message: 'Proveedor insertado de manera exitosa!' });
    } catch (error) {
        res.status(500).json({ error: 'Error al insertar en la base de datos' });
        //console.log(error);
    }
}

const GetProviderById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await getProviderById(connection, id);
        if (result.length === 0) {
            res.status(404).json({ error: 'Proveedor no encontrado' });
        }
        res.status(200).json({ provider: result[0] });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener proveedor' });
        //console.log(error);
    }
}

const UpdateProvider = async (req, res) => {
    const { id } = req.params;
    const { sanitizedName, sanitizedDescription, sanitizedNumber, sanitizedEmail, sanitizedAddress, sanitizedStatus } = req.body;
    console.log(sanitizedName, sanitizedDescription, sanitizedNumber, sanitizedEmail, sanitizedAddress, sanitizedStatus);
    try {
        const result = await updateProvider(connection, id, sanitizedName, sanitizedDescription, sanitizedNumber, sanitizedEmail, sanitizedAddress, sanitizedStatus);
        if (!result) {
            res.status(500).json({ error: 'Error al insertar en la base de datos' });
        }
        res.status(200).json({ message: 'Proveedor actualizado de manera exitosa!' });
    } catch (error) {
        res.status(500).json({ error: 'Error al insertar en la base de datos' });
        //console.log(error);
    }
}

const DeleteProvider = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await deleteProvider(connection, id);
        if (!result) {
            res.status(500).json({ error: 'Error al borrar en la base de datos' });
        }
        res.status(200).json({ message: 'Provedor eliminado de manera exitosa!' });
    } catch (error) {
        res.status(500).json({ error: 'Error al borrar en la base de datos' });
        //console.log(error);
    }
}

module.exports = { GetProviders, CreateProvider, GetProviderById, UpdateProvider, DeleteProvider }