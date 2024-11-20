import express, { request } from 'express';
import { recipesMap, getRecipes, getRecipeById, getRecipesByName, getRecipesCount, setRating, getRatingsMean } from './recipeService.js';

import fs from 'fs';
import path from 'path';

// Array temporal para almacenar usuarios
let users = [];

const router = express.Router();
const TOTAL_RECIPES = getRecipesCount();
const MAX_RECIPES_PER_PAGE = 4;

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
    res.render('newrecipe');
});

router.get('/recipe/:id', (req, res) => { // Visualizar una receta por medio de su ID
    let recipe = getRecipeById(req.params.id);
    let reviews = recipe.reviews;
    res.render('view_recipe', {
        recipe,
        reviews,
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
        displayStars: function (strNumStars) {

        }
    });
});

router.post('/newrecipe', (req, res) => {
    const { title, image, totalTime, cuisineType, people, difficulty, vegetarian, glutenFree, calories } = req.body;
    //validar que todos los campos estan llenos
    if (!title || !image || !totalTime || !cuisineType || !people || !difficulty || !vegetarian || !glutenFree || !calories) {
        return alert('Por favor, llena todos los campos');
    }
    //crear eel objeto receta
    const saveRecipe = {
        id: Date.now(),//para generar un id unico
        title: req.body.title,
        image: req.body.image,
        totalTime: parseInt(req.body.totalTime),
        cuisineType: req.body.cuisineType,
        people: parseInt(req.body.people),
        difficulty: parseInt(req.body.difficulty),
        vegetarian: req.body.vegetarian === 'true',
        glutenFree: req.body.glutenFree === 'true',
        calories: parseInt(req.body.calories),
    };
    //mostrar por consola la informacion guardada en localStorage
    console.log('nueva receta guardada: ', saveRecipe);

    res.render('view_recipe', {
        recipe: saveRecipe,
    });
});

// Ruta para restablecer la contraseña
router.post('/reset-password', async (req, res) => {
    /*const { email } = req.body;
    console.log(email)
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      res.status(200).send('Password reset email sent');
    } catch (error) {
      res.status(400).send(error.message);
    }*/
});

//Ruta temporal a la calculadora de calorías
router.get('/calculator', (req, res) => {
    res.render('caloriesCalculator');
});

router.get('/', (req, res) => {
    sentRecipeIds = new Set();

    res.render("landing");
});

router.get("/recipes", (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const to = parseInt(req.query.to) || from + MAX_RECIPES_PER_PAGE;

    const recipes = getRecipes(from, to);


    res.render("recipe", {
        recipe: recipes,
    });
});

router.get("/randomrecipes", (req, res) => {
    const recipes = getUniqueRandomRecipes(MAX_RECIPES_PER_PAGE);

    //check if all recipes are now displayed
    res.set("noMoreRecipes", (sentRecipeIds.size === TOTAL_RECIPES));

    res.render("preview_recipe", {
        recipe: recipes
    });
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
    res.json({media, username});
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

    // Buscar el usuario en el array de usuarios registrados
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        // Reinicio de la sesión
        sentRecipeIds = new Set();

        res.render("landing", { username: user.email.split('@')[0] });
    } else {
        res.send('Correo o contraseña incorrectos. Vuelva a intentarlo <a href="/login">Inténtelo de nuevo</a>');
    }
});

router.get('/form_new_recipe', (req, res) => {
    res.render('new_review');
});

router.post('/addReview', (req, res) => {
    console.log(req.body);
    const { recipe_name, username, date, rating, review } = req.body;


    if (!recipe_name || !username || !date || !rating || !review) {
        return res.status(400).send('Todos los campos son obligatorios');
    }

    const filePath = path.join(__dirname, '../assets/recetas.json');
    const recetas = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const recipe = recetas.find(r => r.label === recipe_name);
    if (!recipe) {
        return res.status(404).send('Receta no encontrada');
    }

    const newReview = {
        username,
        date,
        rating: parseInt(rating),
        review
    };

    recipe.reviews.push(newReview);

    fs.writeFileSync(filePath, JSON.stringify(recetas, null, 2), 'utf8');

    res.send('¡Reseña añadida exitosamente!');
    res.render('view_recipe', {
        recipe,
        reviews: recipe.reviews
    });
});

export default router;