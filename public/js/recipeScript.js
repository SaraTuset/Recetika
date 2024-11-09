// document.ready
$(() => {
    let hasSearch = window.location.href.includes("search");
    loadRecipes(hasSearch);
});

export function formatRecipe(newRecipes) {
    putDifficulties();

    //Format calories
    $(".calories").each((index, element) => {
        let calories = parseFloat($(element).attr("alt"));
        calories = (calories / 1000).toFixed(2);
        $(element).find("#formattedCalories").text(calories + " KCal");
    });
}

async function loadRecipes(searchOn) {
    const response = await fetch('/recipes?search=' + searchOn, );

    const allShown = response.headers.get("allShown") === "true";

    if (allShown)
        $(".loadMoreRecipesBut").hide();
    else
        $(".loadMoreRecipesBut").show();

    const newRecipes = await response.text();

    formatRecipe(newRecipes);

    if (!searchOn) {
        let recipesContainer = $('#recipesContainer');
        $(recipesContainer).append(newRecipes);
    }
}

$('.loadMoreRecipesBut').on("click", (event) => {
    $(event.currentTarget).find("i").addClass("fa-spin");
    setTimeout(() => {
        loadRecipes(false);
        $(event.currentTarget).find("i").removeClass("fa-spin");

    }, 1000);


});

function putDifficulties() {
    $(".diff").each((index, element) => {

        let difficulty = $(element).attr("alt");
        switch (difficulty) {
            case "1":
                // Text
                $(element).find("#difficultyGrade").text("Fácil");

                // Dif 1
                $(element).find(".diff1").addClass("fa-solid");
                $(element).find(".diff1").removeClass("fa-regular");

                // Dif 2
                $(element).find(".diff2").addClass("fa-regular");
                $(element).find(".diff2").removeClass("fa-solid");

                // Dif 3
                $(element).find(".diff3").addClass("fa-regular");
                $(element).find(".diff3").removeClass("fa-solid");

                // Dif 4
                $(element).find(".diff4").addClass("fa-regular");
                $(element).find(".diff4").removeClass("fa-solid");

                // Dif 5
                $(element).find(".diff5").addClass("fa-regular");
                $(element).find(".diff5").removeClass("fa-solid");

                break;
            case "2":
                // Text
                $(element).find("#difficultyGrade").text("Fácil");

                // Dif 1
                $(element).find(".diff1").addClass("fa-solid");
                $(element).find(".diff1").removeClass("fa-regular");

                // Dif 2
                $(element).find(".diff2").addClass("fa-solid");
                $(element).find(".diff2").removeClass("fa-regular");

                // Dif 3
                $(element).find(".diff3").addClass("fa-regular");
                $(element).find(".diff3").removeClass("fa-solid");

                // Dif 4
                $(element).find(".diff4").addClass("fa-regular");
                $(element).find(".diff4").removeClass("fa-solid");

                // Dif 5
                $(element).find(".diff5").addClass("fa-regular");
                $(element).find(".diff5").removeClass("fa-solid");

                break;
            case "3":
                // Text
                $(element).find("#difficultyGrade").text("Medio");

                // Dif 1
                $(element).find(".diff1").addClass("fa-solid");
                $(element).find(".diff1").removeClass("fa-regular");

                // Dif 2
                $(element).find(".diff2").addClass("fa-solid");
                $(element).find(".diff2").removeClass("fa-regular");

                // Dif 3
                $(element).find(".diff3").addClass("fa-solid");
                $(element).find(".diff3").removeClass("fa-regular");

                // Dif 4
                $(element).find(".diff4").addClass("fa-regular");
                $(element).find(".diff4").removeClass("fa-solid");

                // Dif 5
                $(element).find(".diff5").addClass("fa-regular");
                $(element).find(".diff5").removeClass("fa-solid");

                break;
            case "4":
                // Text
                $(element).find("#difficultyGrade").text("Difícil");

                // Dif 1
                $(element).find(".diff1").addClass("fa-solid");
                $(element).find(".diff1").removeClass("fa-regular");

                // Dif 2
                $(element).find(".diff2").addClass("fa-solid");
                $(element).find(".diff2").removeClass("fa-regular");

                // Dif 3
                $(element).find(".diff3").addClass("fa-solid");
                $(element).find(".diff3").removeClass("fa-regular");

                // Dif 4
                $(element).find(".diff4").addClass("fa-solid");
                $(element).find(".diff4").removeClass("fa-regular");

                // Dif 5
                $(element).find(".diff5").addClass("fa-regular");
                $(element).find(".diff5").removeClass("fa-solid");

                break;
            default: {
                // Text
                $(element).find("#difficultyGrade").text("Difícil");

                // Dif 1
                $(element).find(".diff1").addClass("fa-solid");
                $(element).find(".diff1").removeClass("fa-regular");

                // Dif 2
                $(element).find(".diff2").addClass("fa-solid");
                $(element).find(".diff2").removeClass("fa-regular");

                // Dif 3
                $(element).find(".diff3").addClass("fa-solid");
                $(element).find(".diff3").removeClass("fa-regular");

                // Dif 4
                $(element).find(".diff4").addClass("fa-solid");
                $(element).find(".diff4").removeClass("fa-regular");

                // Dif 5
                $(element).find(".diff5").addClass("fa-solid");
                $(element).find(".diff5").removeClass("fa-regular");
            }
                break;
        }
    });
}

//Falta añadir comprobación de si quedan mas recetas o no para esconder el botón, y de añadir un delay y animación de giro de flechas

