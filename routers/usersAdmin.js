const express = require('express');
const routerUsersAdmin = express.Router();
const authAdmin = require('../middlewares/authAdmin');
const cors = require('cors');
const {GetUsers, CreateUser , GetUserById, UpdateUser, DeleteUser,validateUser} = require('../controllers/usersController');

routerUsersAdmin.use(express.json());
routerUsersAdmin.use(cors());

routerUsersAdmin.get('/usersAdmin', authAdmin, GetUsers);

routerUsersAdmin.post('/usersAdmin', authAdmin, validateUser, CreateUser);

routerUsersAdmin.get('/usersAdmin/:id', authAdmin, GetUserById);

routerUsersAdmin.put('/usersAdmin/:id', authAdmin, UpdateUser);

routerUsersAdmin.delete('/usersAdmin/:id', authAdmin ,DeleteUser)

module.exports = routerUsersAdmin;
