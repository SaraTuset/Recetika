import express from 'express';
import mustacheExpress from 'mustache-express';
import bodyParser from 'body-parser';
import { __dirname } from './dirname.js';
import router from './router.js';
import functions from 'firebase-functions'

const app = express();

app.set('views', __dirname + '/../views');
app.set("view engine", "html");
app.engine("html", mustacheExpress());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/../public'));

app.use('/', router);

app.listen(3000, () => console.log('Listening on port 3000!'));
console.log('Server is running on http://localhost:3000');

export const api = functions.https.onRequest(app);
