import fs from "fs";

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
    recipe.rate = 4.5  
    recipesMap.set(recipe.id, recipe);
    ratingMap.set(recipe.id, [recipe.rate])
});

// Función para obtener las recetas en un rango específico
export function getRecipes(from, to) {
    const recipesArray = Array.from(recipesMap.values());
    console.log(recipesArray.slice(from, to))
    return recipesArray.slice(from, to);
}

//Setea y exporta valoración
export function setRating(id, rate){
    valores = ratingMap.get(id);
    valores.add(rate);
    suma = valores.reduce((acumulador, valorActual) => acumulador + valorActual, 0);
    media =  suma / valores.length;
    ratingMap.set(id, valores);
    recipesMap[id].rate=media;
    console.log(ratingMap.get(id));
    return media;
}
