import { formatRecipe } from "./load_recipes.js";

$(() => {
    $(".magnifier-icon-link").on("click", (e) => { // Si se le da al botón de buscar...
        let query = $(e.target).parent().parent().find(".search-bar").val();
        $.ajax({
            type: "GET",
            url: "/search-by-query",
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

    $(".search-bar").on("keyup", (e) => { // Si se le da al enter en la barra de búsqueda...
        if (e.key === "Enter") {
            $(".magnifier-icon-link").trigger("click");
        }
    });

    function calcDiff(diff1, diff2) {
        let diff = Math.abs(diff1 - diff2);
        let diffText = "";
        let diffLevel = "-";

        if (diff != 0) {
            diffText = Math.min(diff1, diff2) + " - " + Math.max(diff1, diff2);
        } else {
            diffText = diff1;
        }

        if (diffText == "1" || diffText == "2" || diffText == "1 - 2") {
            if (diffText == "1 - 2") diffLevel = "Fácil";
        } else if (diffText == "3") {
            diffLevel = "Medio";
        } else if (diffText == "4" || diffText == "5" || diffText == "4 - 5") {
            if (diffText == "4 - 5") diffLevel = "Difícil";
        } else {
            diffLevel = "-";
        }

        return [diffText, diffLevel];
    }

    function calcTimeRange(time1, time2) {
        return Math.min(time1, time2) + " - " + Math.max(time1, time2);
    }

    function calcKcalRange(kcal1, kcal2) {
        let min = (Math.min(kcal1, kcal2) / 1000).toFixed(2);
        let max = (Math.max(kcal1, kcal2) / 1000).toFixed(2);

        return min + " - " + max;
    }

    $("*[id=rangeDiff], *[id=selectDiff]").find("input").on("click", (e) => {
        let checkboxes = $(e.target).closest(".dropdown-column").find(".difficulty-checkboxes");
        let rangeSlider = $(e.target).closest(".dropdown-column").find(".range-slider");

        if ($(e.target).parent().attr("id") === "selectDiff") {
            $(checkboxes).show();
            $(rangeSlider).hide();
        } else {
            $(rangeSlider).show();
            $(checkboxes).hide();
        }
    });

    $("*[id=rangeDiff]").find("input").trigger("click");
    $("*[id=rangePeop]").find("input").trigger("click");


    $("*[id=rangePeop], *[id=selectPeop]").find("input").on("click", (e) => {
        let select = $(e.target).closest(".dropdown-column").find(".people-select");
        let rangeSlider = $(e.target).closest(".dropdown-column").find(".range-slider-people");

        $(select).toggle();
        $(rangeSlider).toggle();
    });

    $("*[id=rangePeople], *[id=selectPeople]").find("input").on("click", (e) => {
        let select = $(".people-select")[0];
        let rangeSlider = $(".range-slider-people");

        $(select).toggle();
        $(rangeSlider).toggle();
    });

    $(".dropBtn").on("click", (e) => {
        $(".dropdown-content").toggle();

        dropdownContent = $(".dropdown-content").html();

        diffChange = false;
        calChange = false;
        peopChange = false;
        timeChange = false;
        dietChange = false;
        healthChange = false;
        cautionsChange = false;
        ingredientsChange = false;
        dishTypeChange = false;
        mealTypeChange = false;
        cuisineTypeChange = false;

        $(".dropdown-column").children().on("click", (e) => {
            let changedItem = $(e.target).closest(".dropdown-column").attr("id");

            switch (changedItem) {
                case "difficulty":
                    diffChange = true;
                    break;
                case "calories":
                    calChange = true;
                    break;
                case "people":
                    peopChange = true;
                    break;
                case "time":
                    timeChange = true;
                    break;
                case "diet":
                    dietChange = true;
                    break;
                case "health":
                    healthChange = true;
                    break;
                case "cautions":
                    cautionsChange = true;
                    break;
                case "ingredients":
                    ingredientsChange = true;
                    break;
                case "dishType":
                    dishTypeChange = true;
                    break;
                case "mealType":
                    mealTypeChange = true;
                    break;
                case "cuisineType":
                    cuisineTypeChange = true;
                    break;
            }
        });

    });

    $(".diffSlider").on("input", (e) => {
        let slider1 = $(e.target).parent().find("input")[0].value;
        $($("#diffSliders").find("input")[0]).val(slider1);
        let slider2 = $(e.target).parent().find("input")[1].value;
        $($("#diffSliders").find("input")[1]).val(slider2);

        let [diffText, diffLevel] = calcDiff(slider1, slider2);
        $(".diffRangeValues").text(diffText);
        $(e.target).parent().find("#difficultyValue").text(diffLevel);
    });

    $(".peopleSlider").on("input", (e) => {
        let slider1 = $(e.target).parent().find(".peopSlider1").val();
        let slider2 = $(e.target).parent().find(".peopSlider2").val();

        let peopleText = Math.min(slider1, slider2) + " - " + Math.max(slider1, slider2);
        if (slider1 == slider2) peopleText = slider1;
        $(".peopRangeValues").text(peopleText);
    });

    // Cargar los tiempos de preparación
    let timeSlider1 = $(".timeSlider1");
    let timeSlider2 = $(".timeSlider2");
    let timeRangeValues = $(".timeRangeValues");

    $.ajax({
        type: "GET",
        url: "/duration-range",
        success: (data) => {
            $(timeSlider1).attr("min", data[0]);
            $(timeSlider1).attr("max", data[1]);
            $(timeSlider1).attr("value", data[0]);
            $(timeSlider2).attr("min", data[0]);
            $(timeSlider2).attr("max", data[1]);
            $(timeSlider2).attr("value", data[1]);
            $(timeRangeValues).text(data[0] + " - " + data[1]);

        }
    });

    $(".timeSlider").on("input", (e) => {
        let slider1 = $(e.target).parent().find(".timeSlider1").val();
        let slider2 = $(e.target).parent().find(".timeSlider2").val();

        let timeRange = calcTimeRange(slider1, slider2);
        $(".timeRangeValues").text(timeRange);
    });

    // Load options for multiple select dropdowns
    function loadOptions(url, selectClass) {
        $.ajax({
            type: "GET",
            url: url,
            success: (data) => {
                let select = $(selectClass);
                select.empty();
                data.forEach(item => {
                    select.append(new Option(item, item));
                });
            }
        });
    }

    loadOptions("/diets", ".diet-select");
    loadOptions("/health-labels", ".health-select");
    loadOptions("/cautions", ".cautions-select");
    loadOptions("/ingredients", ".ingredients-select");
    loadOptions("/dish-types", ".dishType-select");
    loadOptions("/meal-types", ".mealType-select");
    loadOptions("/cuisine-types", ".cuisineType-select");

    // Load kcal range
    let kcalSlider1 = $(".kcalSlider1");
    let kcalSlider2 = $(".kcalSlider2");
    let kcalRangeValues = $(".kcalRangeValues");

    $.ajax({
        type: "GET",
        url: "/kcal-range",
        success: (data) => {
            $(kcalSlider1).attr("min", data[0]);
            $(kcalSlider1).attr("max", data[1]);
            $(kcalSlider1).attr("value", data[0]);
            $(kcalSlider2).attr("min", data[0]);
            $(kcalSlider2).attr("max", data[1]);
            $(kcalSlider2).attr("value", data[1]);
            $(kcalRangeValues).text(calcKcalRange(data[0], data[1]));
        }
    });

    $(".kcalSlider").on("input", (e) => {
        let slider1 = $(e.target).parent().find(".kcalSlider1").val();
        let slider2 = $(e.target).parent().find(".kcalSlider2").val();

        let kcalRange = calcKcalRange(slider1, slider2);
        $(".kcalRangeValues").text(kcalRange);
    });


    // Esconde el dropdown de filtrado si se hace click fuera de él
    $(document).on("click", (e) => {
        if (!$(e.target).closest(".dropdown-content, .dropBtn").length) {
            $(".dropdown-content").hide();
        }
    });

    let selects = $("*[id=dropdownContent]").find("select");

    let lastSelectedIndex = -1;

    // Change all select dropdowns behavior to allow multiple selection without CTRL
    $(selects).on("mousedown", (e) => {
        $(e.target).parent().trigger("focus");

        if ($(e.target).attr("class") === "people-select") return;

        let option = e.target;
        let select = $(e.target).closest("select")[0];
        let options = select.options;
        let currentIndex = Array.prototype.indexOf.call(options, option);
        let scroll = select.scrollTop;

        if (e.shiftKey && lastSelectedIndex > -1) {
            // Selección por intervalos con Shift
            let start = Math.min(lastSelectedIndex, currentIndex);
            let end = Math.max(lastSelectedIndex, currentIndex);
            for (let i = start; i <= end; i++) {
                options[i].selected = true;
            }
        } else {
            // Selección múltiple sin Ctrl
            e.preventDefault();
            $(option).prop("selected", !$(option).prop("selected"));
            lastSelectedIndex = currentIndex;
        }

        setTimeout(() => select.scrollTop = scroll, 0);

        return false;
    });

    $(".confirm-button").on("click", (e) => confirmFilters(e.target));

});

// Dropdown initial HTML
let dropdownContent;

// Dropdown filters initially not changed
let diffChange = false;
let calChange = false;
let peopChange = false;
let timeChange = false;
let dietChange = false;
let healthChange = false;
let cautionsChange = false;
let ingredientsChange = false;
let dishTypeChange = false;
let mealTypeChange = false;
let cuisineTypeChange = false;

function toggleDropdown() {
    const dropdownContent = $("#dropdownContent");
    $(dropdownContent).addClass("show");
}

function gatherFilterData(caller) {
    const filters = {};

    // Only include filters that have been touched

    // Difficulty
    if (diffChange) {
        let diffSliders = $(caller).parent().find("#diffSliders");
        let rangeDiffSlider = [parseInt($($(diffSliders).find("input")[0]).val()), parseInt($($(diffSliders).find("input")[1]).val())]
        let selectDiff = Array.from($(caller).parent().find(".difficulty-checkboxes").find("input:checked")).map((checkbox) => checkbox.value);

        let diffValues = $(diffSliders).css("display") != "none" ? rangeDiffSlider : selectDiff;
        let mode = $(diffSliders).css("display") != "none" ? "range" : "select";
        filters.difficulty = { values: diffValues, mode: mode };
    }

    // Calories
    if (calChange) {
        let calSliders = $(caller).parent().find("#calSliders");
        let rangeCalSlider = [parseFloat($($(calSliders).find("input")[0]).val()), parseFloat($($(calSliders).find("input")[1]).val())]
        filters.calories = { values: rangeCalSlider };
    }

    // People
    if (peopChange) {
        let peopSliders = $(caller).parent().find("#peopSliders");
        let rangePeopSlider = [$($(peopSliders).find("input")[0]).val(), $($(peopSliders).find("input")[1]).val()]
        let selectPeop = $(caller).parent().find(".people-select").find("option:selected").val();
        let peopValues = $(peopSliders).css("display") != "none" ? rangePeopSlider : selectPeop;
        let peopMode = $(peopSliders).css("display") != "none" ? "range" : "select";
        filters.people = { values: peopValues, mode: peopMode };
    }

    // Time
    if (timeChange) {
        let timeSliders = $(caller).parent().find("#timeSliders");
        let rangeTimeSlider = [parseInt($($(timeSliders).find("input")[0]).val()), parseInt($($(timeSliders).find("input")[1]).val())]
        filters.time = { values: rangeTimeSlider };
    }

    // Diet type
    if (dietChange) {
        let dietSelect = $(caller).parent().find(".diet-select").find("option:selected");
        let dietValues = Array.from(dietSelect).map((option) => option.value);
        filters.diet = dietValues;
    }

    // Health labels
    if (healthChange) {
        let healthSelect = $(caller).parent().find(".health-select").find("option:selected");
        let healthValues = Array.from(healthSelect).map((option) => option.value);
        filters.health = healthValues;
    }

    // Cautions
    if (cautionsChange) {
        let cautionsSelect = $(caller).parent().find(".cautions-select").find("option:selected");
        let cautionsValues = Array.from(cautionsSelect).map((option) => option.value);
        filters.cautions = cautionsValues;
    }

    // Ingredients
    if (ingredientsChange) {
        let ingredientsSelect = $(caller).parent().find(".ingredients-select").find("option:selected");
        let ingredientsValues = Array.from(ingredientsSelect).map((option) => option.value);
        filters.ingredients = ingredientsValues;
    }

    // Dish type
    if (dishTypeChange) {
        let dishTypeSelect = $(caller).parent().find(".dishType-select").find("option:selected");
        let dishTypeValues = Array.from(dishTypeSelect).map((option) => option.value);
        filters.dishType = dishTypeValues;
    }

    // Meal type
    if (mealTypeChange) {
        let mealTypeSelect = $(caller).parent().find(".mealType-select").find("option:selected");
        let mealTypeValues = Array.from(mealTypeSelect).map((option) => option.value);
        filters.mealType = mealTypeValues;
    }

    // Cuisine type
    if (cuisineTypeChange) {
        let cuisineTypeSelect = $(caller).parent().find(".cuisineType-select").find("option:selected");
        let cuisineTypeValues = Array.from(cuisineTypeSelect).map((option) => option.value);
        filters.cuisineType = cuisineTypeValues;
    }

    return filters;
}

function confirmFilters(caller) {

    const filters = gatherFilterData(caller);

    $(".dropdown-content").scrollTop(0);

    $(caller).parent().hide();
    $(caller).parent().html(dropdownContent);

    $.ajax({
        type: 'POST',
        url: '/filter-recipes',
        data: JSON.stringify(filters),
        contentType: 'application/json',
        success: (response) => {
            $("#recipesContainer").empty();
            $("#recipesContainer").append(response);
            formatRecipe(response);
        }
    });
    toggleDropdown();
}

$(".selectAllBut").on("click", (e) => {
    let select = $(e.target).parent().prev();
    $(select).find("option").prop("selected", true);
});

$(".deselectAllBut").on("click", (e) => {
    let select = $(e.target).parent().prev();
    $(select).find("option").prop("selected", false);
});