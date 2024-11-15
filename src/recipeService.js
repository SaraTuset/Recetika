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

// Función para obtener el rango de duración de las recetas
export function getDurationRange() {
    let min = Number.MAX_SAFE_INTEGER;
    let max = Number.MIN_SAFE_INTEGER;

    for (let recipe of recipesMap.values()) {
        if (recipe.totalTime < min) min = recipe.totalTime;
        if (recipe.totalTime > max) max = recipe.totalTime;
    }

    return [min, max];
}

// Función para devolver todos los tipos de dieta
export function getDiets() {
    let diets = new Set();
    for (let recipe of recipesMap.values()) {
        recipe.dietLabels.forEach(diet => diets.add(diet));
    }
    return diets;
}

// Función para devolver todas las etiquetas de salud
export function getHealthLabels() {
    let healthLabels = new Set();
    for (let recipe of recipesMap.values()) {
        recipe.healthLabels.forEach(label => healthLabels.add(label));
    }
    return healthLabels;
}

// Función para obtener todos los alérgenos
export function getCautions() {
    let cautions = new Set();
    for (let recipe of recipesMap.values()) {
        recipe.cautions.forEach(caution => cautions.add(caution));
    }
    return cautions;
}

// Función para obtener todos los ingredientes
export function getIngredients() {
    let ingredients = new Set();
    for (let recipe of recipesMap.values()) {
        recipe.ingredients.forEach(ingredient => ingredients.add(ingredient.food));
    }
    return ingredients;
}

// Función para obtener todos los tipos de receta
export function getDishTypes() {
    let dishTypes = new Set();
    for (let recipe of recipesMap.values()) {
        if (recipe.dishType) recipe.dishType.forEach(type => dishTypes.add(type));
    }
    return dishTypes;
}

// Función para obtener todos los tipos de comida
export function getMealTypes() {
    let mealTypes = new Set();
    for (let recipe of recipesMap.values()) {
        recipe.mealType.forEach(type => mealTypes.add(type));
    }
    return mealTypes;
}

// Función para obtener todos los tipos de cocina
export function getCuisineTypes() {
    let cuisineTypes = new Set();
    for (let recipe of recipesMap.values()) {
        recipe.cuisineType.forEach(type => cuisineTypes.add(type));
    }
    return cuisineTypes;
}

// Función para obtener el rango de kcals
export function getKcalRange() {
    let minKcal = Infinity;
    let maxKcal = -Infinity;
    for (let recipe of recipesMap.values()) {
        if (recipe.calories) {
            if (recipe.calories < minKcal) minKcal = recipe.calories;
            if (recipe.calories > maxKcal) maxKcal = recipe.calories;
        }
    }
    return [minKcal, maxKcal];
}

export function findByQuery(query) {
    const recipesArray = Array.from(recipesMap.values());
    return recipesArray.filter(recipe => recipe.label.toLowerCase().includes(query.toLowerCase()));
}

