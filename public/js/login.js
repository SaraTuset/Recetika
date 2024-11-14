// Array para almacenar los usuarios registrados
let users = [];

//Cogemos los distintos datos del formulario de registro
const formContainer = document.getElementById('form-container');
const registerForm = document.getElementById('register-form');
const loginLink = document.getElementById('login-link');

// Manejar registro de usuarios
registerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const userExists = users.some(user => user.email === email);

    if (userExists) {
        alert("Este correo ya está registrado. Por favor, utiliza otro.");
    } else {
        // Guardar usuario en el array si no existe
        users.push({ email, password });
        alert("¡Registro exitoso!");

        // Limpiar campos de registro
        document.getElementById('register-email').value = '';
        document.getElementById('register-password').value = '';
    }
});



function addEventListeners() {
    const loginLink = document.getElementById('login-link');
    if (loginLink) {
        loginLink.addEventListener('click', function (e) {
            e.preventDefault();

            const loginForm = document.getElementById('login-form');
            if (loginForm) {
                loginForm.addEventListener('submit', function (e) {
                    e.preventDefault();
                    const email = document.getElementById('login-email').value;
                    const password = document.getElementById('login-password').value;

                    // Validar si el usuario existe en el array
                    const user = users.find(user => user.email === email && user.password === password);

                    if (user) {
                        window.location.href = "https://www.youtube.com"; // Cambiar URL a tu página de bienvenida
                    } else {
                        alert("Correo electrónico o contraseña incorrectos");
                    }
                });
            }
        });
    }
}


addEventListeners();