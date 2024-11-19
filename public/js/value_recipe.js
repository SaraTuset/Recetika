const FILLED = "#FFD700";
const FILLED_RGB = "rgb(255, 215, 0)";
const EMPTY = "#D3D3D3";
const HALF = "#FFED85";

$(() => {
    function putRatings() {
        $(".rating").each(async (index, rating) => {
            const id = $(rating).find(".recipeId").text();
            const valor = await $.get(`/ratemean/${index}`);
            const stars = $(rating).find(".rating");

            let myRatings = $(rating).parent().find(".myratings");
            $(myRatings).text(valor);
            colorStars(stars, valor, "filled");
            colorStars(stars, valor, "empty");
        });
    }

    $(".loadMoreRecipesBut").on('click', async (e) => {
        putRatings();
    });
    // Nada mas cargarse hay que colocar las medias de valoración
    $(".recipe").each(async (index, recipe) => {
        putRatings();
    });

    // Selecciona todos los inputs dentro de la clase rating
    let ratingInputs;

    $(".rating label").on("click", (e) => {
            // Obtener el id y el valor del input seleccionado
            const id = $(e.target).closest(".recipe").find(".recipeId").text();
            const valor = parseFloat($(e.target).prev().val());

            let stars = $(e.target).parent();
            colorStars(stars, valor, "empty");
            colorStars(stars, valor, "filled");
            

            // Llamar a la función secundaria con los valores obtenidos
            let media = actualizarMedia(id, valor);
    });

    let lastValue = 0;

    $(".rating label").on("mouseover", (e) => {
        let lastValue = $(e.target).prev().val();
        let stars = $(e.target).parent();
        let valor = parseFloat($(e.target).prev().val());
        let starsArray = Array.from($(stars).find("label"));
        let noChange = starsArray.some(star => $(star).css("color") === FILLED_RGB);

        if (noChange) {
            return;
        }
        colorStars(stars, valor);

    });

    $(".rating label").on("mouseleave", (e) => {
        let stars = $(e.target).parent();
        
        let starsArray = Array.from($(stars).find("label"));
        let noChange = starsArray.some(star => $(star).css("color") === FILLED_RGB);
        let valor = parseFloat($(e.target).prev().val());

        if (noChange) return;
        colorStars(stars, valor, "empty");

    });
   
})

async function actualizarMedia(id, valor){

    let newMean;

    $.ajax({
        url: '/nuevaValoracion',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ id, valor }),
        success: (data) => {
            let meanText = $(`.id${id}`).parent().find(".myratings")
            let ratingText = $(`.id${id}`).parent().find("#rated")
            $(meanText).text(data.media);

            $(ratingText).text('¡Gracias por tu valoración! ');
        },
        error: (error) => {
            console.log(error)
        }
    });


    //return media
}

export function colorStars(stars, valor, mode) {
    let color;

    switch (mode) {
        case "filled":
            color = FILLED;
            break;
        case "empty":
            color = EMPTY;
            $(stars).find("label").css("color", color);
            break;
        default:
            color = HALF;
            break;
    }
    switch (valor) {
        case 0.5:
            $(stars).find("[id=starhalf]").next().css("color", color);
            break;
        case 1:
            $(stars).find("[id=starhalf]").next().css("color", color);
            $(stars).find("[id=star1]").next().css("color", color);
            break;
        case 1.5:
            $(stars).find("[id=starhalf]").next().css("color", color);
            $(stars).find("[id=star1]").next().css("color", color);
            $(stars).find("[id=star1half]").next().css("color", color);
            break;
        case 2:
            $(stars).find("[id=starhalf]").next().css("color", color);
            $(stars).find("[id=star1]").next().css("color", color);
            $(stars).find("[id=star1half]").next().css("color", color);
            $(stars).find("[id=star2]").next().css("color", color);
            break;
        case 2.5:
            $(stars).find("[id=starhalf]").next().css("color", color);
            $(stars).find("[id=star1]").next().css("color", color);
            $(stars).find("[id=star1half]").next().css("color", color);
            $(stars).find("[id=star2]").next().css("color", color);
            $(stars).find("[id=star2half]").next().css("color", color);
            break;
        case 3:
            $(stars).find("[id=starhalf]").next().css("color", color);
            $(stars).find("[id=star1]").next().css("color", color);
            $(stars).find("[id=star1half]").next().css("color", color);
            $(stars).find("[id=star2]").next().css("color", color);
            $(stars).find("[id=star2half]").next().css("color", color);
            $(stars).find("[id=star3]").next().css("color", color);
            break;
        case 3.5:
            $(stars).find("[id=starhalf]").next().css("color", color);
            $(stars).find("[id=star1]").next().css("color", color);
            $(stars).find("[id=star1half]").next().css("color", color);
            $(stars).find("[id=star2]").next().css("color", color);
            $(stars).find("[id=star2half]").next().css("color", color);
            $(stars).find("[id=star3]").next().css("color", color);
            $(stars).find("[id=star3half]").next().css("color", color);
            break;
        case 4:
            $(stars).find("[id=starhalf]").next().css("color", color);
            $(stars).find("[id=star1]").next().css("color", color);
            $(stars).find("[id=star1half]").next().css("color", color);
            $(stars).find("[id=star2]").next().css("color", color);
            $(stars).find("[id=star2half]").next().css("color", color);
            $(stars).find("[id=star3]").next().css("color", color);
            $(stars).find("[id=star3half]").next().css("color", color);
            $(stars).find("[id=star4]").next().css("color", color);
            break;
        case 4.5:
            $(stars).find("[id=starhalf]").next().css("color", color);
            $(stars).find("[id=star1]").next().css("color", color);
            $(stars).find("[id=star1half]").next().css("color", color);
            $(stars).find("[id=star2]").next().css("color", color);
            $(stars).find("[id=star2half]").next().css("color", color);
            $(stars).find("[id=star3]").next().css("color", color);
            $(stars).find("[id=star3half]").next().css("color", color);
            $(stars).find("[id=star4]").next().css("color", color);
            $(stars).find("[id=star4half]").next().css("color", color);
            break;
        default:
            $(stars).find("[id=starhalf]").next().css("color", color);
            $(stars).find("[id=star1]").next().css("color", color);
            $(stars).find("[id=star1half]").next().css("color", color);
            $(stars).find("[id=star2]").next().css("color", color);
            $(stars).find("[id=star2half]").next().css("color", color);
            $(stars).find("[id=star3]").next().css("color", color);
            $(stars).find("[id=star3half]").next().css("color", color);
            $(stars).find("[id=star4]").next().css("color", color);
            $(stars).find("[id=star4half]").next().css("color", color);
            $(stars).find("[id=star5]").next().css("color", color);
            break;
    }
}
