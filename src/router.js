import express from 'express';
import request from 'request';
import { recipesMap, getRecipes, findByQuery, getDurationRange, getCautions, 
getCuisineTypes, getDiets, getDishTypes, getHealthLabels, getIngredients, getKcalRange,
getMealTypes, filterRecipes } from './recipeService.js';
/*import { firebase } from './firebaseConfig.js';*/

// Array temporal para almacenar usuarios
let users = [];

let allShown = false; // Variable que controla si se han mostrado todas las recetas
let searchOn = false; // Variable que controla si se está buscando o no
let filteringOn = false; // Variable que controla si se está filtrando o no
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

router.post('/newrecipe', (req, res) => {
    const { title, image, totalTime, people, difficulty, vegetarian, glutenFree, calories } = req.body;
    //validar que todos los campos estan llenos
    if (!title || !image || !totalTime || !people || !difficulty || !vegetarian || !glutenFree || !calories) {
        return res.status(400).send(`
            <h3>Por favor complete el formulario para poder guardar.</h3>
            <button onclick="window.history.back()">seguir configurando la receta</button>
            <button onclick="window.location.href='/'">Volver a la página principal</button>
        `);
    }
    //crear eel objeto receta
    const saveRecipe = {
        id: Date.now(),//para generar un id unico
        title: req.body.title,
        image: req.body.image,
        totalTime: parseInt(req.body.totalTime),
        people: parseInt(req.body.people),
        difficulty: parseInt(req.body.difficulty),
        vegetarian: req.body.vegetarian === 'true',
        glutenFree: req.body.glutenFree === 'true',
        calories: parseInt(req.body.calories),
    };
    //mostrar por consola la informacion guardada en localStorage
    console.log('nueva receta guardada: ', saveRecipe);

    res.status(201).send(`
        <h3>Receta guardada correctamente.</h3>
        <button onclick="window.location.href='/'">Volver a la página principal</button>
        `);

});

// Ruta temporal a la calculadora de calorías
router.get('/calculator', (req, res) => {
    res.render('caloriesCalculator');
});

router.get("/recipes", (req, res) => { // Obtiene recetas (bien aleatorias o por búsqueda/filtrado)
    if (!fromUrl) {
        let recipes;
        if (!searchOn && !filteringOn) {
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
    filteringOn = false;
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

router.post('/filter-recipes', (req, res) => {
    filteringOn = true;
    const filters = req.body;
    const filteredRecipes = filterRecipes(filters);

    currentQueries = filteredRecipes.slice(MAX_RECIPES_PER_PAGE);

    allShown = (currentQueries.length == 0);

    res.setHeader("allShown", allShown);

    res.render("recipe", {
        recipe: filteredRecipes.slice(0, MAX_RECIPES_PER_PAGE),
        allShown: allShown
    });
});

export default router;