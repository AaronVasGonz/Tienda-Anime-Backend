const express = require('express');

const routerProviders = express.Router();
const cors = require('cors')
const {GetProviders, CreateProvider, GetProviderById, UpdateProvider, DeleteProvider} = require('../controllers/providersController');
const authAdmin = require('../middlewares/authAdmin');

routerProviders.use(cors());
routerProviders.use(express.json());

routerProviders.get('/providersAdmin', authAdmin, GetProviders);

routerProviders.post('/providersAdmin', authAdmin, CreateProvider);

routerProviders.get('/providersAdmin/:id', authAdmin, GetProviderById)

routerProviders.put('/providersAdmin/:id', authAdmin, UpdateProvider);

routerProviders.delete('/providersAdmin/:id', authAdmin, DeleteProvider);

module.exports = routerProviders;