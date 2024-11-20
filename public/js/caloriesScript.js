// Datos de los alimentos y sus valores nutricionales por gramos

const alimentos = {
    tortilla: { calorias: 2.2, carbohidratos: 0.12, azucares: 0.01, proteinas: 0.08, grasas: 0.15 },
    pollo: { calorias: 1.6, carbohidratos: 0, azucares: 0, proteinas: 0.3, grasas: 0.05 },
    tarta: { calorias: 3.5, carbohidratos: 0.25, azucares: 0.2, proteinas: 0.05, grasas: 0.22 },
    sopa: { calorias: 0.6, carbohidratos: 0.1, azucares: 0.02, proteinas: 0.03, grasas: 0.01 },
    manzana: { calorias: 0.52, carbohidratos: 0.14, azucares: 0.1, proteinas: 0.003, grasas: 0.002 },
    arroz: { calorias: 1.3, carbohidratos: 0.28, azucares: 0, proteinas: 0.026, grasas: 0.001 },
    aguacate: { calorias: 1.6, carbohidratos: 0.08, azucares: 0, proteinas: 0.02, grasas: 0.15 },
    salmón: { calorias: 2.1, carbohidratos: 0, azucares: 0, proteinas: 0.2, grasas: 0.13 },
    panIntegral: { calorias: 2.5, carbohidratos: 0.46, azucares: 0.05, proteinas: 0.09, grasas: 0.04 },
    chocolateNegro: { calorias: 5.7, carbohidratos: 0.34, azucares: 0.23, proteinas: 0.05, grasas: 0.31 },
    huevoCocido: { calorias: 1.55, carbohidratos: 0.01, azucares: 0.006, proteinas: 0.13, grasas: 0.11 },
    espinacas: { calorias: 0.23, carbohidratos: 0.036, azucares: 0.004, proteinas: 0.029, grasas: 0.003 },
    yogurNatural: { calorias: 0.6, carbohidratos: 0.05, azucares: 0.04, proteinas: 0.034, grasas: 0.033 },
    plátano: { calorias: 0.89, carbohidratos: 0.23, azucares: 0.12, proteinas: 0.011, grasas: 0.003 },
    quesoCheddar: { calorias: 4.0, carbohidratos: 0.01, azucares: 0.0, proteinas: 0.25, grasas: 0.33 },
    fresas: { calorias: 0.32, carbohidratos: 0.08, azucares: 0.05, proteinas: 0.01, grasas: 0.002 }

};

let totalCaloriasDiarias = 0;
let caloriasConsumidas = 0;
let alimentoSeleccionado = null;

function calcularCaloriasDiarias() {
    const nombre = document.getElementById('nombre').value;
    const edad = parseInt(document.getElementById('edad').value);
    const genero = document.getElementById('genero').value;
    const peso = parseFloat(document.getElementById('peso').value);
    const altura = parseFloat(document.getElementById('altura').value);
    const actividad = document.getElementById('actividad').value;

    if (nombre && edad && genero && peso && altura && actividad) {
        if (genero === "male") {
            totalCaloriasDiarias = 10 * peso + 6.25 * altura - 5 * edad + 5;
        } else {
            totalCaloriasDiarias = 10 * peso + 6.25 * altura - 5 * edad - 161;
        }

        switch (actividad) {
            case "sedentario":
                totalCaloriasDiarias *= 1.2;
                break;
            case "ligero":
                totalCaloriasDiarias *= 1.375;
                break;
            case "moderado":
                totalCaloriasDiarias *= 1.55;
                break;
            case "activo":
                totalCaloriasDiarias *= 1.725;
                break;
        }

        document.getElementById('caloriasRestantes').innerText = `Has consumido 0 de ${Math.round(totalCaloriasDiarias)} kcal recomendadas.`;
        document.getElementById('progreso').style.width = '0%';

        document.getElementById('calculadoraNutricional').classList.remove('d-none');
    } else {
        alert("Por favor, completa todos los campos.");
    }
}

function seleccionarAlimento(alimento) {
    alimentoSeleccionado = alimento;
    document.getElementById('gramos').value = '';
    ocultarResultados();
}

function ocultarResultados() {
    document.getElementById('tablaNutricional').classList.add('d-none');
    document.getElementById('añadirComida').classList.add('d-none');
}

function calcularNutricion() {
    const gramos = parseFloat(document.getElementById('gramos').value);

    if (!isNaN(gramos) && alimentoSeleccionado) {
        const alimento = alimentos[alimentoSeleccionado];

        const calorias = alimento.calorias * gramos;
        const carbohidratos = alimento.carbohidratos * gramos;
        const azucares = alimento.azucares * gramos;
        const proteinas = alimento.proteinas * gramos;
        const grasas = alimento.grasas * gramos;

        document.getElementById('calorias').innerText = `${calorias.toFixed(2)} kcal`;
        document.getElementById('carbohidratos').innerText = `${carbohidratos.toFixed(2)} g`;
        document.getElementById('azucares').innerText = `${azucares.toFixed(2)} g`;
        document.getElementById('proteinas').innerText = `${proteinas.toFixed(2)} g`;
        document.getElementById('grasas').innerText = `${grasas.toFixed(2)} g`;

        document.getElementById('tablaNutricional').classList.remove('d-none');
        document.getElementById('añadirComida').classList.remove('d-none');
    } else {
        ocultarResultados();
    }
}

function añadirComida() {
    const gramos = parseFloat(document.getElementById('gramos').value);
    const alimento = alimentos[alimentoSeleccionado];

    const calorias = alimento.calorias * gramos;

    caloriasConsumidas += calorias;
    const porcentajeProgreso = (caloriasConsumidas / totalCaloriasDiarias) * 100;

    document.getElementById('progreso').style.width = `${porcentajeProgreso}%`;
    document.getElementById('progreso').ariaValueNow = `${porcentajeProgreso}`;
    document.getElementById('caloriasRestantes').innerText = `Has consumido ${Math.round(caloriasConsumidas)} de ${Math.round(totalCaloriasDiarias)} kcal recomendadas.`;
}
function reiniciarCalorias() {
    caloriasConsumidas = 0; // Reiniciar calorías consumidas
    document.getElementById('progreso').style.width = '0%'; // Reiniciar barra de progreso
    document.getElementById('progreso').ariaValueNow = '0';
    document.getElementById('caloriasRestantes').innerText = `Has consumido 0 de ${Math.round(totalCaloriasDiarias)} kcal recomendadas.`; // Actualizar texto
}
