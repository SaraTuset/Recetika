var modal = document.getElementsByClassName("form_container");

var btn = document.getElementsByClassName("new_recipe_button");

var span = document.getElementsByClassName("close");

btn.onclick = function () {
    console.log(btn);
    modal.style.display = "block";
}

span.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}