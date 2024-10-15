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

$('.loadMoreRecipesBut').on("click", (event) => {
    $(event.currentTarget).find("i").addClass("fa-spin");
    setTimeout(() => {
        loadRecipes();
        $(event.currentTarget).find("i").removeClass("fa-spin");

    }, 1000);
});

//Falta añadir comprobación de si quedan mas recetas o no para esconder el botón, y de añadir un delay y animación de giro de flechas

