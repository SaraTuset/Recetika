import express from 'express';
import mustacheExpress from 'mustache-express';
import bodyParser from 'body-parser';
import path from 'path';
import { __dirname } from './dirname.js';  // Asegúrate de que funcione tu módulo dirname
import router from './router.js';
import functions from 'firebase-functions';

const app = express();

// Configuración del motor de vistas Mustache
app.set('views', path.join(__dirname, '/../views'));
app.set("view engine", "html");
app.engine("html", mustacheExpress());

// Middleware para analizar los datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/../public')));
app.use(express.json());

// Usar el router para manejar todas las rutas
app.use('/', router);

// Puerto de escucha del servidor
app.listen(3000, () => console.log('Listening on port 3000!'));
console.log('Server is running on http://localhost:3000');

// Exportar la app para Firebase Functions
export const api = functions.https.onRequest(app);
