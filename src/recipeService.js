import fs from "fs";
import { getCurrentUser } from "./router.js";

const MAX_RECIPES = 110;
//dicionario con id unible a json y valor int que se incorpora cada vez que se vota

export let recipesMap = new Map();
export let ratingMap = new Map();
let nextId = 0

// Leer el archivo JSON
const data = fs.readFileSync('./public/assets/recetas.json', 'utf8');
const jsonData = JSON.parse(data);


// Estructurar las recetas en un mapa
jsonData.recipes.forEach(recipe => {
    if (!recipe.reviews) recipe.reviews = [];

    recipesMap.set(recipe.id, recipe);
    ratingMap.set(recipe.id, [recipe.rate])
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
export async function setRating(id, rate) {
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

// Función para obtener el rango de duración de las recetas
export function getDurationRange() {
    let min = Number.MAX_SAFE_INTEGER;
    let max = Number.MIN_SAFE_INTEGER;

    for (let recipe of recipesMap.values()) {
        if (recipe.totalTime) {
            if (recipe.totalTime < min) min = recipe.totalTime;
            if (recipe.totalTime > max) max = recipe.totalTime;
        }
    }

    return [min, max];
}

// Función para devolver todos los tipos de dieta
export function getDiets() {
    let diets = new Set();
    for (let recipe of recipesMap.values()) {
        if (recipe.dietLabels) recipe.dietLabels.forEach(diet => diets.add(diet));
    }
    return diets;
}

// Función para devolver todas las etiquetas de salud
export function getHealthLabels() {
    let healthLabels = new Set();
    for (let recipe of recipesMap.values()) {
        if (recipe.healthLabels) recipe.healthLabels.forEach(label => healthLabels.add(label));
    }
    return healthLabels;
}

// Función para obtener todos los alérgenos
export function getCautions() {
    let cautions = new Set();
    for (let recipe of recipesMap.values()) {
        if (recipe.cautions) recipe.cautions.forEach(caution => cautions.add(caution));
    }
    return cautions;
}

// Función para obtener todos los ingredientes
export function getIngredients() {
    let ingredients = new Set();
    for (let recipe of recipesMap.values()) {
        if (recipe.ingredients) recipe.ingredients.forEach(ingredient => ingredients.add(ingredient.food));
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
        if (recipe.mealType) recipe.mealType.forEach(type => mealTypes.add(type));
    }
    return mealTypes;
}

// Función para obtener todos los tipos de cocina
export function getCuisineTypes() {
    let cuisineTypes = new Set();
    for (let recipe of recipesMap.values()) {
        if (recipe.cuisineType) recipe.cuisineType.forEach(type => cuisineTypes.add(type));
    }
    return cuisineTypes;
}

// Función para obtener el rango de kcals
export function getKcalRange() {
    let minKcal = Number.MAX_SAFE_INTEGER;
    let maxKcal = Number.MIN_SAFE_INTEGER;

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

export function filterRecipes(filters) {
    let res = Array.from(recipesMap.values()).filter(recipe => {
        // Difficulty
        if (filters.difficulty) {
            if (filters.difficulty.mode === "range") {
                if (recipe.difficulty < Math.min(...filters.difficulty.values) || recipe.difficulty > Math.max(...filters.difficulty.values)) return false;
            } else {
                const isValid = Array.from(filters.difficulty.values).some(diff => {
                    switch (diff) {
                        case "easy":
                            return recipe.difficulty <= 2;
                        case "medium":
                            return recipe.difficulty === 3;
                        case "hard":
                            return recipe.difficulty >= 4;
                        default:
                            return false;
                    }
                });
                if (!isValid) return false;
            }
        }

        // People
        if (filters.people) {
            if (filters.people.mode === "range") {
                if (recipe.people < Math.min(...filters.people.values) || recipe.people > Math.max(...filters.people.values)) return false;
            } else {
                if (recipe.people != filters.people.values) return false;
            }
        }

        // Time
        if (filters.time) {
            if (recipe.totalTime < Math.min(...filters.time.values) || recipe.totalTime > Math.max(...filters.time.values)) return false;
        }

        // Diet types
        if (filters.diet && (recipe.dietLabels)) {
            if (!Array.from(filters.diet).some(diet => recipe.dietLabels.includes(diet))) return false;
        }

        // Health labels
        if (filters.health) {
            if (!Array.from(filters.health).some(label => recipe.healthLabels.includes(label))) return false;
        }

        // Cautions
        if (filters.cautions) {
            let cautions = Array.from(filters.cautions);
            let nCautions = getCautions().size;

            if (!cautions.includes("Gluten") && cautions.length == nCautions - 1) {
                return !recipe.hasGluten
            }
            if (cautions.every(caution => recipe.cautions.includes(caution))) return true
            else return false;
        }

        // Ingredients
        if (filters.ingredients) {
            if (!Array.from(filters.ingredients).some(ingredient => {
                return recipe.ingredients.some(recipeIngredient => recipeIngredient.food === ingredient);
            })) return false;
        }

        // Dish types
        if (filters.dishType) {
            if (!Array.from(filters.dishType).some(type => recipe.dishType && recipe.dishType.includes(type))) return false;
        }

        // Meal types
        if (filters.mealType) {
            if (!Array.from(filters.mealType).some(type => recipe.mealType.includes(type))) return false;
        }

        // Cuisine types
        if (filters.cuisineType) {
            if (!Array.from(filters.cuisineType).some(type => recipe.cuisineType.includes(type))) return false;
        }

        // Calories
        if (filters.calories) {
            if (recipe.calories < Math.min(...filters.calories.values) || recipe.calories > Math.max(...filters.calories.values)) return false;
        }

        return true;
    });

    return res;
}

