document.getElementById('newRecipeForm').addEventListener('submit', function (event) {


    //guardar datos del formulario
    const newRecipe = {
        title: document.getElementById('title').value,
        image: document.getElementById('image').value,
        totalTime: document.getElementById('totalTime').value,
        people: document.getElementById('people').value,
        difficulty: document.getElementById('difficulty').value,
        vegetarian: document.getElementById('vegetarian').value.toLowerCase() === 'true',
        glutenFree: document.getElementById('glutenFree').value.toLowerCase() === 'true',
        calories: document.getElementById('calories').value
    };

    //guardar la receta en localStorage
    const newRecipes = JSON.parse(localStorage.getItem('newRecipes')) || [];
    newRecipes.push(newRecipe);
    localStorage.setItem('newRecipes', JSON.stringify(newRecipes));

    //enviar la receta al servidor
    fetch('/newrecipe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecipe),
    })
        .catch(error => {
            console.error('Error:', error);
            alert('Ocurrió un error al guardar la receta');
        });
});