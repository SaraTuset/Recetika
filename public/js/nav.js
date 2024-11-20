window.onload = function () {
    const username = '{{username}}';
    const loginNav = document.getElementById("login_nav");

    if (username) {
        loginNav.innerHTML = `
                <span class="navbar_username">${username}</span>
            `;
    } else {
        loginNav.innerHTML = `
                <button class="login_button" onclick="location.href='/login'">
                    <i class="fa-solid fa-arrow-right-to-bracket" style="margin-right: 5px;"></i>
                    Iniciar Sesión
                </button>
                <button class="register_button" onclick="location.href='/register'">
                    <i class="fa-solid fa-user-plus" style="margin-right: 5px;"></i>
                    Registrarse
                </button>
            `;
    }
}