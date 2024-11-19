const recipe_name = document.querySelector(".recipe_title");
const form = document.querySelector(".form_container");
const btn = document.querySelector(".new_recipe_button");
const span = document.querySelector(".close");
const clean_form = document.querySelector(".clean_button");
const send_form = document.querySelector(".send_button");
const title = document.querySelector("#title");

title.innerHTML += recipe_name.innerHTML;

btn.addEventListener('click', function () {
    form.style.display = "block";
    title.innerHTML += " | Nueva reseña";
});

span.onclick = function () {
    form.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == form) {
        form.style.display = "none";
    }
}

clean_form.addEventListener('click', function () {
    document.getElementById("username").value = "";
    document.getElementById("date").value = "";
    document.getElementById("rating").value = "";
    document.getElementById("review").value = "";
});

send_form.addEventListener('click', function () {
    let username = document.getElementById("username").value;
    let date = document.getElementById("date").value;
    let rating = document.getElementById("rating").value;
    let review = document.getElementById("review").value;

    if (username == "" || date == "" || rating == "" || review == "") {
        alert("Por favor, llena todos los campos");
    } else {
        const data = {
            recipe_name: recipe_name.innerHTML,
            username: username,
            date: date,
            rating: rating,
            review: review
        };

        fetch('/addReview', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })

        console.log(data);
    }
});
