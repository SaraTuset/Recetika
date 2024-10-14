import express from 'express';
import { recipesMap, getRecipes } from './recipeService.js';
import { getPeople, setPerson } from './caloriesPeopleService.js';

// Array temporal para almacenar usuarios
let users = [];

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

//Ruta temporal a la calculadora de calorías
router.get('/calculator', (req, res) => {
    res.render('caloriesCalculator');
});

router.get('/', (req, res) => {
    res.render("landing");
    
});

router.get("/recipes", (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const to = parseInt(req.query.to) || from + MAX_RECIPES_PER_PAGE;

    const recipes = getRecipes(from, to);

        res.render("recipe", {
            recipe: recipes
        });
});

router.get("/randomrecipes", (req, res) => {
    const recipes = getUniqueRandomRecipes(MAX_RECIPES_PER_PAGE);

    res.render("recipe", {
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

    let {name, calories} = req.body
    setPerson(name,calories)
    
});

// *** Nuevo código para el registro y el login de usuarios *** //

// Ruta para manejar el registro de usuarios
router.post('/register', (req, res) => {
    const { email, password } = req.body;

    // Verificar si el usuario ya está registrado
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
        res.send('¡Inicio de sesión exitoso! Bienvenido.');
    } else {
        res.send('Correo o contraseña incorrectos.');
    }
});


export default router;