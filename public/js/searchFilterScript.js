import { formatRecipe } from "./recipeScript.js";

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

    $("*[id=rangeDiff], *[id=selectDiff]").find("input").on("tap touchstart", (e) => {

        let checkboxes = $(e.target).closest(".dropdown-column").find(".difficulty-checkboxes");
        let rangeSlider = $(e.target).closest(".dropdown-column").find(".range-slider");

        $(checkboxes).toggle();
        $(rangeSlider).toggle();
    });

    $("*[id=rangeDiff]").find("input").trigger("click");
    $("*[id=rangeDiff]").find("input").trigger("touchstart");
    $("*[id=rangePeop]").find("input").trigger("click");
    $("*[id=rangePeop]").find("input").trigger("touchstart");


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
    });

    $(".diffSlider").on("input", (e) => {
        let slider1 = $(e.target).parent().find("input")[0].value;
        let slider2 = $(e.target).parent().find("input")[1].value;

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

    // By default all options are selected...
    setTimeout(() => {
        $(selects).each((index, select) => {
            let id = $(select).attr("class");
            if (id === "people-select") return;
            $(select).find("option").each((index, option) => {
                option.selected = true;
            });
        });
    }, 1000);

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


});

function toggleDropdown() {
    const dropdownContent = document.getElementById("dropdownContent");
    dropdownContent.classList.toggle("show");
}

function confirmFilters() {

    toggleDropdown();
}

function toggleDifficultyFilter(filterType) {
    const rangeSlider = $(".range-slider");
    const difficultyCheckboxes = $(".difficulty-checkboxes");

    if (filterType === 'range') {
        rangeSlider.style.display = 'block';
        difficultyCheckboxes.style.display = 'none';
    } else {
        rangeSlider.style.display = 'none';
        difficultyCheckboxes.style.display = 'flex';
    }
}

$(".selectAllBut").on("click", (e) => {
    let select = $(e.target).parent().prev();
    $(select).find("option").prop("selected", true);
});

$(".deselectAllBut").on("click", (e) => {
    let select = $(e.target).parent().prev();
    $(select).find("option").prop("selected", false);
});