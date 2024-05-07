const express = require('express');
const routerCollection = express.Router();
const authAdmin = require('../middlewares/authAdmin')
const cors = require('cors');
const  {fileUpload} = require('../middlewares/files');
const {getCollectionsC, getCollectionByIdC, createCollection, UpdateCollection, DeleteCollection} = require('../controllers/collectionController');
routerCollection.use(cors());

routerCollection.get('/collections', authAdmin, getCollectionsC);

routerCollection.post('/collections', authAdmin, fileUpload, createCollection );

routerCollection.get('/collections/:id', authAdmin, getCollectionByIdC);

routerCollection.post('/collections/:id', authAdmin, fileUpload, UpdateCollection);

routerCollection.delete('/collections/:id', authAdmin, DeleteCollection ) 

module.exports = routerCollection;
