// Array para almacenar los usuarios registrados
let users = [];

//Cogemos los distintos datos del formulario de registro
const formContainer = document.getElementById('form-container');
const registerForm = document.getElementById('register-form');
const loginLink = document.getElementById('login-link');

// Manejar registro de usuarios
registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    // Guardar usuario en el array
    users.push({ email, password });
    alert("¡Registro exitoso!");

    // Limpiar campos de registro
    document.getElementById('register-email').value = '';
    document.getElementById('register-password').value = '';
});

// Cambiar al formulario de inicio de sesión
loginLink.addEventListener('click', function(e) {
    e.preventDefault();
    formContainer.innerHTML = `
        <h2>Iniciar sesión</h2>
        <form id="login-form">
            <input type="email" id="login-email" placeholder="Correo electrónico" required>
            <input type="password" id="login-password" placeholder="Contraseña" required>
            <button type="submit">Iniciar sesión</button>
        </form>
        <div class="toggle">
            ¿No tienes una cuenta? <a href="#" id="register-link">Registrarse</a>
        </div>
    `;

    // Manejar inicio de sesión
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // Validar si el usuario existe en el array
        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            // Redirige a YouTube si las credenciales son correctas
            window.location.href = "https://www.youtube.com";
        } else {
            alert("Correo electrónico o contraseña incorrectos");
        }
    });

    // Regresar al formulario de registro
    document.getElementById('register-link').addEventListener('click', function(e) {
        e.preventDefault();
        formContainer.innerHTML = registerForm.outerHTML + '<div class="toggle">¿Ya tienes una cuenta? <a href="#" id="login-link">Iniciar sesión</a></div>';
        addEventListeners();
    });
});

function addEventListeners() {
    loginLink.addEventListener('click', function(e) {
        e.preventDefault();
        formContainer.innerHTML = `
            <h2>Iniciar sesión</h2>
            <form id="login-form">
                <input type="email" id="login-email" placeholder="Correo electrónico" required>
                <input type="password" id="login-password" placeholder="Contraseña" required>
                <button type="submit">Iniciar sesión</button>
            </form>
            <div class="toggle">
                ¿No tienes una cuenta? <a href="#" id="register-link">Registrarse</a>
            </div>
        `;

        const loginForm = document.getElementById('login-form');
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            const user = users.find(user => user.email === email && user.password === password);

            if (user) {
                window.location.href = "https://www.youtube.com";
            } else {
                alert("Correo electrónico o contraseña incorrectos");
            }
        });

        document.getElementById('register-link').addEventListener('click', function(e) {
            e.preventDefault();
            formContainer.innerHTML = registerForm.outerHTML + '<div class="toggle">¿Ya tienes una cuenta? <a href="#" id="login-link">Iniciar sesión</a></div>';
            addEventListeners();
        });
    });
}

addEventListeners();