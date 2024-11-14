import express from 'express';
import { recipesMap, getRecipes, getRecipeById, getRecipesByName } from './recipeService.js';

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

router.get('/newrecipe', (req, res) => {
    res.render('newrecipe');
});

router.get('/recipe/:id', (req, res) => { // Visualizar una receta por medio de su ID
    let recipe = getRecipeById(req.params.id);
    res.render('view_recipe', {
        recipe,
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
    if (sentRecipeIds.size === TOTAL_RECIPES) {
        return res.json({ noMoreRecipes: true });
    }

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
        res.render("landing", { username: user.email.split('@')[0] });
    } else {
        res.send('Correo o contraseña incorrectos. Vuelva a intentarlo <a href="/login">Inténtelo de nuevo</a>');
    }
});


export default router;