const recipe_name_container = document.querySelector(".recipe_title");
const form_container = document.querySelector(".form_container");
const form = document.querySelector(".form");
const btn = document.querySelector(".new_recipe_button");
const span = document.querySelector(".close");
const clean_form = document.querySelector(".clean_button");
const send_form = document.querySelector(".send_button");
const title = document.querySelector("#title");

const recipe_name = recipe_name_container.innerHTML;
title.innerHTML += recipe_name_container.innerHTML;

btn.addEventListener('click', function () {
    form_container.style.display = "block";
    title.innerHTML += " | Nueva reseña";
});

span.onclick = function () {
    form_container.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == form_container) {
        form_container.style.display = "none";
    }
}

clean_form.addEventListener('click', function () {
    document.getElementById("username").value = "";
    document.getElementById("date").value = "";
    document.getElementById("rating").value = "";
    document.getElementById("review").value = "";
});

form.addEventListener('submit', function (event) {
    event.preventDefault();
    let username = document.getElementById("username").value;
    let date = document.getElementById("date").value;
    let rating = document.getElementById("rating").value;
    let review = document.getElementById("review").value;

    console.log(rating);

    if (username == "" || date == "" || rating == "" || review == "") {
        alert("Por favor, llena todos los campos");
    } else {
        const data = {
            recipe_name: recipe_name,
            username: username,
            date: date,
            rating: parseInt(rating),
            review: review
        };

        console.log("Datos a enviar: ", data);

        fetch('/addReview', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
            .catch(error => {
                console.error('Error:', error);
            });
    }
});
