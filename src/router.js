import express from 'express';
import { recipesMap, getRecipes, getRandomRecipes } from './recipeService.js';

const router = express.Router();
const TOTAL_RECIPES = 422;
const MAX_RECIPES_PER_PAGE = 4;

// Definir rutas
router.get('/login', (req, res) => {
    res.render('login');
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
    const recipes = getRandomRecipes(MAX_RECIPES_PER_PAGE);

    res.render("recipe", {
        recipe: recipes
    });
});

export default router;