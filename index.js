const express = require('express');
const app = express();
const port = 3001;
const cors = require("cors");
const bodyParser = require('body-parser');

// Middleware para analizar el cuerpo de las solicitudes como JSON
app.use(express.json());


const corsOptions = {
  origin: 'http://localhost:3000'
};
app.use(cors(corsOptions));

// Ruta principal
app.get('/api', (req, res) => {
  res.send('¡Hola, mundo!');
});

// Routers
const routerLogin = require('./routers/login.js');
app.use('/api', routerLogin);

const routerRegistro = require('./routers/registro.js');
app.use('/api', routerRegistro);

const routerAuth = require('./routers/auth.js');
app.use('/api', routerAuth);

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