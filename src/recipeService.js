import fs from "fs";

const MAX_RECIPES = 110;

export let recipesMap = new Map();
let nextId = 0

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
    return recipesArray.slice(from, to);
}

export function findByQuery(query) {
    const recipesArray = Array.from(recipesMap.values());
    return recipesArray.filter(recipe => recipe.label.toLowerCase().includes(query.toLowerCase()));
}

