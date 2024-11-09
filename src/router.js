import express from 'express';
import { recipesMap, getRecipes, setRating } from './recipeService.js';
/*import { firebase } from './firebaseConfig.js';*/

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

router.post('/newrecipe',(req, res) =>{
    const{title, image, totalTime, people, difficulty, vegetarian, glutenFree, calories} = req.body;
    //validar que todos los campos estan llenos
    if (!title || !image || !totalTime || !people || !difficulty || !vegetarian || !glutenFree || !calories){
        return res.status(400).send(`
            <h3>Por favor complete el formulario para poder guardar.</h3>
            <button onclick="window.history.back()">seguir configurando la receta</button>
            <button onclick="window.location.href='/'">Volver a la página principal</button>
        `);
    }
    //crear eel objeto receta
    const saveRecipe = {
        id: Date.now(),//para generar un id unico
        title:req.body.title,
        image:req.body.image,
        totalTime:parseInt(req.body.totalTime),
        people:parseInt(req.body.people),
        difficulty:parseInt(req.body.difficulty),
        vegetarian:req.body.vegetarian === 'true',
        glutenFree:req.body.glutenFree === 'true',
        calories:parseInt(req.body.calories),
        rate: 4.5 //Math.random() * (5 - 0.5) + 0.5, // Asigna un entero aleatorio entre 0.5 y 5
    };
    //mostrar por consola la informacion guardada en localStorage
    console.log('nueva receta guardada: ', saveRecipe);

    
    res.status(201).send(`
        <h3>Receta guardada correctamente.</h3>
        <button onclick="window.location.href='/'">Volver a la página principal</button>
        `);
    
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
        recipe: recipes
    });
});

router.get("/randomrecipes", (req, res) => {
    const recipes = getUniqueRandomRecipes(MAX_RECIPES_PER_PAGE);

    //check if all recipes are now displayed
    if (sentRecipeIds.size === TOTAL_RECIPES) {
        return res.json({ noMoreRecipes: true });
    }

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

router.post('/updateRating', (req, res) => {
    const { id, rate } = req.body;
    
    if (!id || !rate) {
        return res.status(400).json({ message: 'Faltan parámetros' });
    }

    const media = setRating(id)

    console.log(`Receta actualizada - ID: ${id}, Nueva media: ${media}`);
    res.json({ message: 'Thanks for rating', newRate: media.toFixed(1) });
});


export default router;