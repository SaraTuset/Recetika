import fs from "fs";

const MAX_RECIPES = 110;

export let recipesMap = new Map();

// Leer el archivo JSON
const data = fs.readFileSync('./public/assets/recetas.json', 'utf8');
const jsonData = JSON.parse(data);

// Estructurar las recetas en un mapa
jsonData.recipes.forEach(recipe => {
    recipesMap.set(recipe.id, recipe);
});

// Función para obtener las recetas en un rango específico
export function getRecipes(from, to) {
    const recipesArray = Array.from(recipesMap.values());
    console.log(recipesArray.slice(from, to))
    return recipesArray.slice(from, to);
}

// Función para obtener recetas aleatorias para la landing page
export function getRandomRecipes(amount) {
    const randomRecipes = [];
    for (let i = 0; i < amount; i++) {
        const randomIndex = Math.floor(Math.random() * MAX_RECIPES);
        randomRecipes.push(recipesMap.get(randomIndex));
    }
    return randomRecipes;
}