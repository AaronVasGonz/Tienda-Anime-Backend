const express = require('express');
const app = express();
const port = 3001;
const cors = require("cors");
const path = require('path');
const bodyParser = require('body-parser');

// Middleware para analizar el cuerpo de las solicitudes como JSON
app.use(express.json());
app.use(express.json({ limit: '10mb' })); // Aumentar el límite de carga para JSON a 10MB
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Aumentar el límite de carga para datos codificados en URL a 10MB

const corsOptions = {
  origin: 'http://localhost:3000'
};
app.use(cors());

// Ruta principal
app.get('/api', (req, res) => {
  res.send('¡Hola, mundo!');
});

// Routers

//archivo estatico de ima
app.use('/images', express.static(path.join(__dirname, 'images')));


const routerLogin = require('./routers/login.js');
app.use('/api', routerLogin);

const routerRegistro = require('./routers/registro.js');
app.use('/api', routerRegistro);

const routerAuth = require('./routers/auth.js');
app.use('/api', routerAuth);

const routerUsersAdmin = require('./routers/usersAdmin.js');
app.use('/api', routerUsersAdmin);


const routerCollection = require('./routers/collection.js');
app.use('/api', routerCollection);


const routerCategoriesAdmin = require('./routers/categoriesAdmin.js');
app.use('/api', routerCategoriesAdmin);

const routerProducts = require('./routers/Products.js');
app.use('/api', routerProducts);

const routerProviders = require('./routers/Providers.js');
app.use('/api', routerProviders);

// Middleware para manejar rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).send('Recurso no encontrado');
});


// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});