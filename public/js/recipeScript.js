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

