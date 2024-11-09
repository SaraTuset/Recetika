import { formatRecipe } from "./recipeScript.js";

$(() => {
    $("#magnifier-icon-link").on("click", (e) => { // Si se le da al botón de buscar...
        let query = $(e.target).parent().parent().find("#search-bar").val();
        $.ajax({
            type: "GET",
            url: "/searchByQuery",
            data: {
                q: query
            },
            
            success: (response, status, jqHXR) => {
                let allShown = jqHXR.getResponseHeader("allShown") === "true";
                $("#recipesContainer").empty();
                $("#recipesContainer").append(response);

                if 
                    (allShown) $(".loadMoreRecipesBut").hide();
                else
                    $(".loadMoreRecipesBut").show();
                
                formatRecipe(response);
            }

        });
    });

    $("#search-bar").on("keyup", (e) => { // Si se le da al enter en la barra de búsqueda...
        if (e.key === "Enter") {
            $("#magnifier-icon-link").trigger("click");
        }
    });
});