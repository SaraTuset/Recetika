import express from 'express';
import request from 'request';
import fs from 'fs';
import path from 'path';
import {
    recipesMap, getRecipes, findByQuery, getDurationRange, getCautions,
    getCuisineTypes, getDiets, getDishTypes, getHealthLabels, getIngredients, getKcalRange,
    getMealTypes, filterRecipes, getRecipesCount, getRatingsMean, setRating, getRecipeById, getRecipesByName
} from './recipeService.js';
/*import { firebase } from './firebaseConfig.js';*/
import { __dirname } from './dirname.js';
import bodyParser from 'body-parser';
import { ref } from 'firebase-functions/v1/database';

// Array temporal para almacenar usuarios
let users = [];

let allShown = false; // Variable que controla si se han mostrado todas las recetas
let searchOn = false; // Variable que controla si se está buscando o no
let filteringOn = false; // Variable que controla si se está filtrando o no
let fromUrl = false; // Variable que controla si se está buscando desde una URL o no
let currentQueries;

const router = express.Router();
const TOTAL_RECIPES = getRecipesCount();
const MAX_RECIPES_PER_PAGE = 4;
router.use(bodyParser.urlencoded({ extended: true }));

// Set para almacenar los IDs de las recetas ya enviadas
let sentRecipeIds;

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

router.get('/recipe/:id', (req, res) => { // Visualizar una receta por medio de su ID
    let recipe = getRecipeById(req.params.id);
    let reviews = recipe.reviews;
    const username = req.session.user ? req.session.user.email.split('@')[0] : null;
    res.render('view_recipe', {
        recipe,
        reviews,
        username,
        format_calories: function () {
            return function () {
                const form_cal = parseFloat(recipe.calories);
                return form_cal.toFixed(2);
            }
        },
        capitalize_cuisineType: function () {
            return function () {
                const cuisineType = recipe.cuisineType.toString();
                const cap_cuisineType = cuisineType.charAt(0).toUpperCase() + cuisineType.slice(1);
                return cap_cuisineType;
            }
        },
    });
});

router.post('/newrecipe', (req, res) => {
    const { title, image, totalTime, cuisineType, people, difficulty, vegetarian, glutenFree, calories } = req.body;
    //validar que todos los campos estan llenos
    if (!title || !image || !totalTime || !cuisineType || !people || !difficulty || !vegetarian || !glutenFree || !calories) {
        return res.status(400).send(`
            <h3>Por favor complete el formulario para poder guardar.</h3>
            <button onclick="window.history.back()">seguir configurando la receta</button>
            <button onclick="window.location.href='/'">Volver a la página principal</button>
        `);
    }
    //crear eel objeto receta
    const saveRecipe = {
        id: Date.now(),//para generar un id unico
        label: req.body.title,
        image: req.body.image,
        totalTime: parseInt(req.body.totalTime),
        cuisineType: req.body.cuisineType,
        people: parseInt(req.body.people),
        difficulty: parseInt(req.body.difficulty),
        vegetarian: req.body.vegetarian === 'true',
        glutenFree: req.body.glutenFree === 'true',
        calories: parseInt(req.body.calories),
        reviews: [],
    };

    //guardar receta en map
    recipesMap.set(saveRecipe.id, saveRecipe);

    //guardar receta en el json
    const filePath = path.resolve('./public/assets/recetas.json');
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    jsonData.recipes.push(saveRecipe);
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 4));

    //mostrar por consola la informacion guardada en localStorage
    console.log('nueva receta guardada: ', saveRecipe);

    res.status(201).send(`
        <h3>Receta guardada correctamente.</h3>
        <button onclick="window.location.href='/'">Volver a la página principal</button>
        `);
});

// Ruta temporal a la calculadora de calorías
router.get('/calculator', (req, res) => {
    const username = req.session.user ? req.session.user.email.split('@')[0] : null;
    res.render('caloriesCalculator', { username });
});

router.get('/', (req, res) => {
    sentRecipeIds = new Set();

    searchOn = false;
    filteringOn = false;
    fromUrl = false;

    const username = req.session.user ? req.session.user.email.split('@')[0] : null;

    res.render("landing", { username });
});

router.get("/recipes", (req, res) => {

});

router.get("/randomrecipes", (req, res) => {

    if (!fromUrl) {
        if (!searchOn && !filteringOn) {
            const recipes = getUniqueRandomRecipes(MAX_RECIPES_PER_PAGE);

            //check if all recipes are now displayed
            res.setHeader("noMoreRecipes", (sentRecipeIds.size === TOTAL_RECIPES));

            res.render("preview_recipe", {
                recipe: recipes
            });
        } else {
            let recipes = currentQueries.slice(0, MAX_RECIPES_PER_PAGE);
            currentQueries = currentQueries.slice(MAX_RECIPES_PER_PAGE);

            let allShown = currentQueries.length == 0;
            res.setHeader("noMoreRecipes", allShown);
            res.render("preview_recipe", {
                recipe: recipes
            });
        }
    }

});

router.delete("/deleterecipe", (req, res) => {
    const recipeId = req.body.recipeId;
    console.log(recipeId)
    const recipe = recipesMap.get(parseInt(recipeId));
    console.log(recipe)
    recipesMap.delete(parseInt(recipeId));
    res.send(recipe);
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

router.post("/nuevaValoracion", async (req, res) => {
    const { id, valor } = req.body;
    let media = (await setRating(id, valor)).toFixed(1);

    const username = req.session.user ? req.session.user.email.split('@')[0] : null;
    res.json({ media, username });
});

router.get("/ratemean/:id", async (req, res) => {
    const id = req.params.id;
    const media = getRatingsMean(parseInt(id)).toFixed(1);
    res.json(media);
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
        // Reinicio de la sesión
        sentRecipeIds = new Set();

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

    res.render("preview_recipe", {
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

    res.render("preview_recipe", {
        recipe: filteredRecipes.slice(0, MAX_RECIPES_PER_PAGE),
        allShown: allShown
    });
});

router.get("/currentuser", (req, res) => {
    const username = req.session.user ? req.session.user.email.split('@')[0] : null;
    res.json(username);
});

export function getCurrentUser() {
    return request('/currentuser', (error, response, body) => { return response });
}

router.get('/form_new_recipe', (req, res) => {
    res.render('new_review');
});

router.post('/addReview', (req, res) => {
    console.log(req.body);
    const { recipe_name, username, date, rating, review } = req.body;

    const filePath = path.join(__dirname, '../public/assets/recetas.json');
    let data;

    if (Object.keys(req.body).length === 0) {
        return res.status(400).send('Petición incorrecta');
    }

    try {
        data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
        return res.status(500).send('Error al leer el archivo de recetas');
    }

    const recipe = data.recipes.find(r => r.label === recipe_name);
    if (!recipe) {
        return res.status(404).send('Receta no encontrada');
    }

    const newReview = {
        author: username,
        date: date,
        rating: parseInt(rating),
        comment: review
    };

    recipe.reviews.push(newReview);


    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        return res.status(500).send('Error al escribir en el archivo de recetas');
    }

    res.redirect("/");
});


router.post('/password', (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        return res.status(400).send('Las contraseñas no coinciden.');
    }

    // Buscar el usuario por correo
    const user = users.find(user => user.email === email);

    if (!user) {
        return res.status(404).send('Usuario no encontrado.');
    }

    // Actualizar la contraseña
    user.password = newPassword;
    console.log(`Contraseña actualizada para el usuario: ${email}`);

    // Redirigir al login con los datos prellenados
    res.redirect(`/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(newPassword)}`);
});



export default router;