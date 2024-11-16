import express from 'express';
import request from 'request';
import { recipesMap, getRecipes, findByQuery, getDurationRange, getCautions, 
getCuisineTypes, getDiets, getDishTypes, getHealthLabels, getIngredients, getKcalRange, getMealTypes } from './recipeService.js';
/*import { firebase } from './firebaseConfig.js';*/
import fs from 'fs';
import path from 'path';
import { __dirname } from './dirname.js';

// Array temporal para almacenar usuarios
let users = [];

let allShown = false; // Variable que controla si se han mostrado todas las recetas
let searchOn = false; // Variable que controla si se está buscando o no
let fromUrl = false; // Variable que controla si se está buscando desde una URL o no
let currentQueries;

const router = express.Router();
const TOTAL_RECIPES = 422;
const MAX_RECIPES_PER_PAGE = 4;

// Set para almacenar los IDs de las recetas ya enviadas
const sentRecipeIds = new Set();

// Función para obtener recetas aleatorias sin repetición
function getUniqueRandomRecipes(count) {
    const allRecipes = Array.from(recipesMap.values());
    const uniqueRecipes = [];

    while (uniqueRecipes.length < count && sentRecipeIds.size < allRecipes.length) {
        const randomIndex = Math.floor(Math.random() * allRecipes.length);
        const recipe = allRecipes[randomIndex];

        if (!sentRecipeIds.has(recipe.id)) {
            uniqueRecipes.push(recipe);
            sentRecipeIds.add(recipe.id);
        }
    }

    return uniqueRecipes;
}

// Definir rutas
router.get('/login', (req, res) => {
    res.render('login');
});



router.get('/register', (req, res) => {
    res.render('register');
});



router.get('/password', (req, res) => {
    res.render('password');
});

router.get('/newrecipe', (req, res) => {
    const username = req.session.user ? req.session.user.email.split('@')[0] : null;
    res.render('newrecipe', { username });
});

// Llevar los datos de la nueva receta a JSON de recetas
router.post('/newrecipe', (req, res) => {
    const formData = req.body;  // Recibes todo el objeto enviado por el formulario

    // Imprimir en la consola para confirmar que los datos llegaron
    console.log("Datos de la nueva receta recibidos:", formData);

    // Ruta del archivo recetas.json
    const filePath = path.join(__dirname, '../public/assets/recetas.json');

    // Leer el archivo recetas.json
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.status(500).send('Hubo un error al guardar la receta.');
        }

        // Parsear el contenido del archivo JSON
        let recipesData;
        try {
            recipesData = JSON.parse(data);
        } catch (parseError) {
            console.error('Error al parsear el archivo JSON:', parseError);
            return res.status(500).send('Error al procesar las recetas existentes.');
        }
        
        // Calcular el nuevo ID basado en la longitud del array actual
        const newId = recipesData.recipes.length;

        // Crear el objeto de la receta con el campo id al principio
        const newRecipe = {
            id: newId,
            ...formData // añadir los campos de formData
        };

        // Agregar la nueva receta al array de recetas
        recipesData.recipes.push(newRecipe);

        // Guardar el archivo actualizado
        fs.writeFile(filePath, JSON.stringify(recipesData, null, 2), 'utf-8', (writeError) => {
            if (writeError) {
                console.error('Error al guardar el archivo:', writeError);
                return res.status(500).send('Hubo un error al guardar la receta.');
            }

            // Responder con éxito
            console.log('Receta guardada correctamente.');
            res.status(200).send('Receta guardada correctamente');
        });
    });
});

// Ruta temporal a la calculadora de calorías
router.get('/calculator', (req, res) => {
    res.render('caloriesCalculator');
});

router.get("/recipes", (req, res) => { // Obtiene recetas (bien aleatorias o por búsqueda/filtrado)
    if (!fromUrl) {
        let recipes;
        if (!searchOn) {
            recipes = getUniqueRandomRecipes(MAX_RECIPES_PER_PAGE);

            //check if all recipes are now displayed
            if (sentRecipeIds.size === TOTAL_RECIPES) {
                allShown = true;
                return res.json({ noMoreRecipes: true });
            }
        } else {
            recipes = currentQueries.slice(0, MAX_RECIPES_PER_PAGE);

            if (req.query.search !== "true") {
                currentQueries = currentQueries.slice(MAX_RECIPES_PER_PAGE);
            }

            allShown = (currentQueries.length === 0);
        }

        res.setHeader("allShown", allShown);

        res.render("recipe", {
            recipe: recipes
        });
    }
});

router.get("/caloriePeople", (req, res) => {

    const people = getPeople()

    res.render("calories", {
        people: people
    });
});

router.post("/NewCalorie", (req, res) => {

    let { name, calories } = req.body
    setPerson(name, calories)

});


// *** Nuevo código para el registro y el login de usuarios *** //

// Ruta para manejar el registro de usuarios
router.post('/register', (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);  // Verifica los datos enviados en la solicitud

    const userExists = users.some(user => user.email === email);
    if (userExists) {
        return res.send('Este correo ya está registrado. Intenta con otro.');
    }

    // Guardar el nuevo usuario
    users.push({ email, password });
    res.send('¡Registro exitoso! <a href="/login">Inicia sesión aquí</a>');
});


// Ruta para manejar el login de usuarios
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        // Guarda el usuario en la sesión
        req.session.user = { email: user.email };
        res.render("landing", { username: user.email.split('@')[0] });
    } else {
        res.send('Correo o contraseña incorrectos. Vuelva a intentarlo <a href="/login">Inténtelo de nuevo</a>');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid'); // O el nombre de la cookie de la sesión
        res.redirect('/');
    });
});


router.get('/', (req, res) => {
    searchOn = false;
    fromUrl = false;

    const username = req.session.user ? req.session.user.email.split('@')[0] : null;
    res.render("landing", { username });
});

// Búsqueda de receta por query
router.get("/search", (req, res) => { // renderiza la landing con las recetas que coinciden con la búsqueda
    fromUrl = true;

    const query = req.query.q;
    const username = req.session.user ? req.session.user.email.split('@')[0] : null;

    let host = req.get("host");
    let url = host + `/search-by-query?q=${query}`;
    if (!url.includes("http")) url = "http://" + url;

    request(url, (error, response, body) => {
        if (error) {
            console.error('Error en la búsqueda', error);
            return res.send('Error en la búsqueda');
        }

        res.render("landing", {
            username: username,
            recipes: body
        });
    });

    fromUrl = false;
});

router.get("/search-by-query", (req, res) => {
    searchOn = true;
    const query = req.query.q;
    const recipes = findByQuery(query);

    currentQueries = recipes.slice(MAX_RECIPES_PER_PAGE);

    allShown = (currentQueries.length == 0);

    res.setHeader("allShown", allShown);

    res.render("recipe", {
        recipe: recipes.slice(0, MAX_RECIPES_PER_PAGE),
        allShown: allShown
    });
});

router.get('/duration-range', (req, res) => {
    const durationRange = getDurationRange(); // Suponiendo que esta función existe y devuelve el rango de duración
    res.json(durationRange);
});

router.get('/diets', (req, res) => {
    const diets = getDiets();
    res.json(Array.from(diets));
});

router.get('/health-labels', (req, res) => {
    const healthLabels = getHealthLabels();
    res.json(Array.from(healthLabels));
});

router.get('/cautions', (req, res) => {
    const cautions = getCautions();
    res.json(Array.from(cautions));
});

router.get('/ingredients', (req, res) => {
    const ingredients = getIngredients();
    res.json(Array.from(ingredients));
});

router.get('/dish-types', (req, res) => {
    const dishTypes = getDishTypes();
    res.json(Array.from(dishTypes));
});

router.get('/meal-types', (req, res) => {
    const mealTypes = getMealTypes();
    res.json(Array.from(mealTypes));
});

router.get('/cuisine-types', (req, res) => {
    const cuisineTypes = getCuisineTypes();
    res.json(Array.from(cuisineTypes));
});

router.get('/kcal-range', (req, res) => {
    const kcalRange = getKcalRange();
    res.json(kcalRange);
});

export default router;