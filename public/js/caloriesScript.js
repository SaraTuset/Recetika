const mealPercentages = {
    desayuno: 0.25,
    comida: 0.35,
    merienda: 0.15,
    cena: 0.25
};

function calculateCalories(age, gender, weight, height, activity) {
    let bmr;
    if (gender === 'male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    return Math.round(bmr * activity);
}

async function savePerson(name, calories) {
    const respuesta = await fetch('//NewCalorie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, calories }),  // Enviar los elementos como un objeto JSON
      });


}

async function displaySavedPeople() {
    const response = await fetch('/caloriePeople');
    let savedCalories = await response.text();

    const savedPeople = document.getElementById('savedPeople');
    savedPeople.innerHTML = '';
    let people = savedCalories
    if (people == {}){
        savedPeople.innerHTML = '<p>No hay resultados aún</p>';
    }
    for (let name in people) {
        const div = document.createElement('div');
        div.innerHTML = `
            <input type="checkbox" id="${name}" name="person" value="${name}">
            <label for="${name}">${name}: ${people[name]} calorías diarias</label>
        `;
        savedPeople.appendChild(div);
    }
}

function calculateMealCalories() {
    const selectedPeople = Array.from(document.querySelectorAll('input[name="person"]:checked'))
        .map(checkbox => checkbox.value);
    
    if (selectedPeople.length === 0) {
        alert('Por favor, selecciona al menos una persona.');
        return;
    }

    const people = JSON.parse(localStorage.getItem('caloriePeople')) || {};
    const totalCalories = selectedPeople.reduce((sum, name) => sum + people[name], 0);

    const mealResults = document.getElementById('mealResults');
    mealResults.innerHTML = '<h3>Calorías por Comida:</h3>';

    for (let meal in mealPercentages) {
        const mealCalories = Math.round(totalCalories * mealPercentages[meal]);
        const div = document.createElement('div');
        div.textContent = `${meal.charAt(0).toUpperCase() + meal.slice(1)}: ${mealCalories} calorías`;
        mealResults.appendChild(div);
    }
}

document.getElementById('caloriesForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const activity = parseFloat(document.getElementById('activity').value);

    const calories = calculateCalories(age, gender, weight, height, activity);

    savePerson(name, calories);

    document.getElementById('result').innerHTML = `${name} ha sido añadido/a con ${calories} calorías diarias estimadas.`;
    
    displaySavedPeople();
});

// Mostrar personas guardadas al cargar la página
displaySavedPeople();