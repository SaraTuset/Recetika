import fs from "fs";
import { getCurrentUser } from "./router.js";

const MAX_RECIPES = 110;

export let recipesMap = new Map();
let nextId = 0

// Leer el archivo JSON
const data = fs.readFileSync('./public/assets/recetas.json', 'utf8');
const jsonData = JSON.parse(data);

// Estructurar las recetas en un mapa
jsonData.recipes.forEach(recipe => {
    if (!recipe.reviews) recipe.reviews = [];

    recipesMap.set(recipe.id, recipe);
});

// Función que devuelve el numero de recetas
export function getRecipesCount() {
    return recipesMap.size;
}

// Función para obtener las recetas en un rango específico
export function getRecipes(from, to) {
    const recipesArray = Array.from(recipesMap.values());
    return recipesArray.slice(from, to);
}

// Función para obtener una receta por su ID
export function getRecipeById(id) {
    id = parseInt(id);
    return recipesMap.get(id);
}

//Setea y exporta valoración
export async function setRating(id, rate){
    id = parseFloat(id);

    let recipe = recipesMap.get(id);
    let valores = recipe.reviews;
    let newReview = {};
    newReview.author = "Anónimo";

    let user = getCurrentUser();
    if (user) newReview.author = user;

    newReview.date = new Date().toLocaleDateString().replace(/\//g, "-");
    newReview.rating = parseInt(rate);
    newReview.comment = "";

    valores.push(newReview);


    recipe.reviews = valores;
    recipesMap.set(id, recipe);

    return getRatingsMean(id);
}

export function getRatingsMean(id) {
    let recipe = recipesMap.get(id);
    if (!recipe) return 0;
    let valores = recipesMap.get(id).reviews;
    if (!valores || valores.length === 0) return 0;
    let suma = 0;
    valores.forEach((valor) => {
        suma += valor.rating;
    });

    return suma / valores.length;
}

// Función para obtener recetas por su nombre
export function getRecipesByName(name) {
    const recipesArray = Array.from(recipesMap.values());
    const recipe = recipesArray.filter(recipe => recipe.label && recipe.label.toLowerCase().includes(name.toLowerCase()));
    console.log(recipe);
    return recipe;
}