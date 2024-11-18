document.addEventListener('DOMContentLoaded', function () {
    const ingredientsContainer = document.getElementById('ingredientsContainer');
    const addIngredientButton = document.getElementById('addIngredientButton');
    const nutrientsContainer = document.getElementById('nutrientsContainer');
    const addNutrientButton = document.getElementById('addNutrientButton');

    // Función para añadir un nuevo ingrediente
    function addIngredientField() {
        const ingredientGroup = document.createElement('div');
        ingredientGroup.className = 'ingredient-group mb-3';

        ingredientGroup.innerHTML = `
            <div class="row g-3">
                <div class="col-md-3">
                    <label for="ingredientName" class="form-label">Nombre</label>
                    <input type="text" class="form-control ingredient-name"placeholder="ej:1 cucharada de sal">
                </div>
                <div class="col-md-2">
                    <label for="ingredientQuantity" class="form-label">Cantidad</label>
                    <input type="number" class="form-control ingredient-quantity" step="any" min="0">
                </div>
                <div class="col-md-3">
                    <label for="ingredientMeasure" class="form-label">Medida</label>
                    <input type="text" class="form-control ingredient-measure"placeholder="cuchara,g,ml...">
                </div>
                <div class="col-md-3">
                    <label for="ingredientFood" class="form-label">Ingrediente</label>
                    <input type="text" class="form-control ingredient-food"placeholder="sal">
                </div>
                <div class="col-md-2">
                    <label for="ingredientWeight" class="form-label">Peso(g)</label>
                    <input type="number" class="form-control ingredient-weight" step="any" min="0">
                </div>
                <div class="col-md-3">
                    <label for="ingredientFoodCategory" class="form-label">Tipo de ingrediente*</label>
                    <input type="text" class="form-control ingredient-foodCategory"placeholder="salsa,condimento...">
                </div>
                <div class="col-md-3">
                    <label for="ingredientFoodId" class="form-label">ID</label>
                    <input type="text" class="form-control ingredient-foodId">
                </div>
                <div class="col-md-3">
                    <label for="ingredientImage" class="form-label">Imagen del ingrediente</label>
                    <input type="text" class="form-control ingredient-image">
                </div>
            </div>
        `;

        ingredientsContainer.appendChild(ingredientGroup);
    }

    // Función para añadir un nuevo nutriente
    function addNutrientField() {
        const nutrientGroup = document.createElement('div');
        nutrientGroup.className = 'nutrient-group mb-3';

        nutrientGroup.innerHTML = `
            <div class="row g-3">
                <div class="col-md-3">
                    <label for="nutrientLabel" class="form-label">Nutriente</label>
                    <input type="text" class="form-control nutrient-label" placeholder="ENERC_KCAL,FAT...">
                </div>
                <div class="col-md-3">
                    <label for="nutrientQuantity" class="form-label">Cantidad</label>
                    <input type="number" class="form-control nutrient-quantity" step="any" min="0">
                </div>
                <div class="col-md-2">
                    <label for="nutrientUnit" class="form-label">Unidad</label>
                    <input type="text" class="form-control nutrient-unit" placeholder="mg,kcal...">
                </div>
            </div>
        `;

        // Convertir el campo de nombre de nutriente a mayúsculas
        const nutrientInput = nutrientGroup.querySelector('.nutrient-label');
        nutrientInput.addEventListener('input', function () {
            this.value = this.value.toUpperCase();
        });

        nutrientsContainer.appendChild(nutrientGroup);
    }

    // Añadir el primer conjunto de campos de ingredientes y nutrientes al cargar la página
    addIngredientField();
    addNutrientField();

    // Eventos para añadir más ingredientes y nutrientes
    addIngredientButton.addEventListener('click', addIngredientField);
    addNutrientButton.addEventListener('click', addNutrientField);

    // Manejo del envío del formulario
    document.getElementById('newRecipeForm').addEventListener('submit', function (event) {
        event.preventDefault();

        // Procesar los ingredientes
        const ingredientElements = document.querySelectorAll('.ingredient-group');
        const ingredients = Array.from(ingredientElements).map(group => ({
            text: group.querySelector('.ingredient-name').value,
            quantity: parseFloat(group.querySelector('.ingredient-quantity').value),
            measure: group.querySelector('.ingredient-measure').value,
            food: group.querySelector('.ingredient-food').value,
            weight: parseFloat(group.querySelector('.ingredient-weight').value),
            foodCategory:group.querySelector('.ingredient-foodCategory').value,
            foodId: group.querySelector('.ingredient-foodId').value,
            image: group.querySelector('.ingredient-image').value
        }));

        // Procesar los nutrientes
        const nutrientElements = document.querySelectorAll('.nutrient-group');
        const nutrients = {};
        Array.from(nutrientElements).forEach(group => {
            const label = group.querySelector('.nutrient-label').value;
            const quantity = parseFloat(group.querySelector('.nutrient-quantity').value);
            const unit = group.querySelector('.nutrient-unit').value;
            nutrients[label] = {
                label: label,
                quantity: quantity,
                unit: unit
            };
        });

        const formData = {
            label: document.getElementById('title').value,
            image: document.getElementById('image').value,
            yield: document.getElementById('yield').value,
            dietLabels: document.getElementById('dietLabels').value.split(','),
            healthLabels: document.getElementById('healthLabels').value.split(','),
            cautions: document.getElementById('cautions').value.split(','),
            ingredients: ingredients,
            people: document.getElementById('people').value,
            difficulty: parseInt(document.getElementById('difficulty').value),
            vegetarian: document.getElementById('vegetarian').value === 'true',
            hasGluten: document.getElementById('glutenFree').value === 'true',
            totalNutrients: nutrients,  // Nutrientes como objeto
            dishType: document.getElementById('dishType').value.split(','),
            mealType: document.getElementById('mealType').value.split(','),
            cuisineType: document.getElementById('cuisineType').value.split(','),
            totalTime: document.getElementById('totalTime').value,
            totalWeight: parseFloat(document.getElementById('totalWeight').value),
            calories: parseFloat(document.getElementById('calories').value)
        };

        fetch('/newrecipe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) {
                alert('Receta guardada correctamente');
                window.location.href = '/';
            } else {
                alert('Error al guardar la receta.');
            }
        });
    });
});