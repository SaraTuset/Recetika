window.onload = function () {
    const username = "{{username}}";
    const loginNav = document.getElementById("login_nav");
    const loginNavMobile = document.getElementById("login_nav_mobile");

    if (username != "{{username}}") {
        loginNav.innerHTML = loginNavMobile.innerHTML = `
                <span class="navbar_username">${username}</span>
                <button class="logout_button" onclick="location.href='/logout'">Cerrar sesión</button>
            `;
    } else {
        loginNav.innerHTML = loginNavMobile.innerHTML = `
                <button class="login_button menuItem" style="margin-bottom: 10px" onclick="location.href='/login'">
                    <i class="fa-solid fa-arrow-right-to-bracket" style="margin-right: 5px;"></i>
                    Iniciar Sesión
                </button>
                <button class="register_button menuItem" onclick="location.href='/register'">
                    <i class="fa-solid fa-user-plus" style="margin-right: 5px;"></i>
                    Registrarse
                </button>
            `;
    }
}
