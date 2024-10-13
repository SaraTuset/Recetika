// document.ready
$(() => {
    loadRecipes();
});

async function loadRecipes() {
    const response = await fetch('/randomrecipes');
    let newRecipes = await response.text();

    let recipesContainer = $('#recipesContainer');
    $(recipesContainer).append(newRecipes);
}

$('.loadMoreRecipesBut').click(() => {
    loadRecipes();
});

//Falta añadir comprobación de si quedan mas recetas o no para esconder el botón, y de añadir un delay y animación de giro de flechas

