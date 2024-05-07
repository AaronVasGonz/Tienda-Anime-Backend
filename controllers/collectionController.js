const path = require('path');
const fs = require('fs');
const {getCollections, getCollectionById,
getCollectionByName,saveCollectionToDb,
updateCollectionToDb, deleteCollectionToDb} = require('../functions/dbFunctions');
const {deleteFilePath} = require('../functions/actions');
const mysql = require('mysql');
const config = require('../config/config');
const connection = mysql.createConnection(config);

const getCollectionsC = async (req, res) => {
    try {
      const collections = await getCollections(connection);
      const imagedir = fs.readdirSync(path.join(__dirname, "../images/collections"));
      const collectionsWithImages = collections.map((collection) => {
        const imageName = `${collection.imagen}`;
        const imagePath = path.join(__dirname, '../images/collections', imageName);
        const imageExists = imagedir.includes(imageName);
        const imageUrl = imageExists ? `${req.protocol}://${req.get('host')}/images/collections/${imageName}` : null;
        return { ...collection, imageUrl };
      });
      res.json({ collections: collectionsWithImages });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al obtener colecciones' });
    }
  };

const getCollectionByIdC = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await getCollectionById(connection, id);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Colección no encontrada' });
        }

        return res.status(200).json({ collection: result[0] });
    } catch (error) {
        console.error("Error al obtener colecciones:", error);
    
    }
}

const  createCollection = async (req, res) => {
    const { Nombre_Coleccion, Descripcion, status } = req.body;
    const fileNamePath = req.file?.path ?? null;
    const fileName = req.file.filename;
    //console.log(fileName)
    if (!Nombre_Coleccion) {
        deleteFilePath(fileNamePath);
        return res.status(400).json({ error: 'Nombre de colección es requerido' });
    }
    try {
        const results = await getCollectionByName(connection, Nombre_Coleccion, fileNamePath);

        if (results.length > 0) {
            deleteFilePath(fileNamePath);
            return res.status(400).json({ error: 'La colección ya existe' });
        }
        const result = await saveCollectionToDb(connection, Nombre_Coleccion, Descripcion, status, fileName, fileNamePath);

        if (!result) {
            deleteFilePath(fileNamePath);
            return res.status(500).json({ error: 'Error al insertar en la base de datos' });
        }

        //console.log('Colección insertada correctamente en la base de datos');
        return res.status(200).json({ message: 'Colección insertada correctamente' });

    } catch (error) {
        deleteFilePath(fileNamePath);
        console.error("Error al obtener colecciones:", error);
        return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
    }
}

const UpdateCollection = async (req, res) => {
    const fileNamePath = req.file?.path ?? null;
    try {

        if (typeof req.body.imagen === 'string') {
            const { id, Nombre_Coleccion, Descripcion, status, imagen } = req.body;
            const result = await updateCollectionToDb(connection, id, Nombre_Coleccion, Descripcion, status, imagen, null);
            if (!result) {
                return res.status(500).json({ error: 'Error al insertar en la base de datos' });
            }
            res.status(200).json({ message: 'Colección actualizada correctamente' });
        } else {
            const { id, Nombre_Coleccion, Descripcion, status } = req.body;
            const fileName = req.file.filename;
            const result = await updateCollectionToDb(connection, id, Nombre_Coleccion, Descripcion, status, fileName, fileNamePath);
            if (!result) {
                return res.status(500).json({ error: 'Error al insertar en la base de datos' });
            }
            res.status(200).json({ message: 'Colección actualizada correctamente' });

        }
    } catch (error) {
        deleteFilePath(fileNamePath);
        console.error("Error al actualizar coleccion", error);
    }
}

const DeleteCollection = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await deleteCollectionToDb(connection, id);
        if (!result) {
            return res.status(500).json({ error: 'Error al eliminar en la base de datos' });
        }
        res.status(200).json({ message: 'Collection deleted successfully' });
    } catch (error) {
        console.error("Error al borrar coleccion", error);
    }
}
 module.exports = { getCollectionsC, getCollectionByIdC, createCollection, UpdateCollection, DeleteCollection };




