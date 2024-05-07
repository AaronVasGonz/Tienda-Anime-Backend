const express = require('express');
const cors = require('cors');
const authAdmin = require('../middlewares/authAdmin');
const{getCategories ,createCategory, getCategory, updateCategoryC , DeleteCategory} = require('../controllers/categoriesController');
const routerCategoriesAdmin = express.Router();
routerCategoriesAdmin.use(cors());
routerCategoriesAdmin.use(express.json());

routerCategoriesAdmin.get('/categoriesAdmin', authAdmin ,getCategories);

routerCategoriesAdmin.post('/categoriesAdmin', authAdmin, createCategory);

routerCategoriesAdmin.get('/categoriesAdmin/:id', getCategory);

routerCategoriesAdmin.put('/categoriesAdmin/:id', updateCategoryC)

routerCategoriesAdmin.delete('/categoriesAdmin/:id', authAdmin, DeleteCategory);

module.exports = routerCategoriesAdmin;
