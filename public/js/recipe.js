$(document).ready(function () {
    $("input[type='radio']").click(function () {
        //<cambiar a media
        var sim = actualizarMedia($("input[type='radio']:checked").val());
        //alert(sim);
        if (sim < 3) {
            $('.myratings').css('color', 'red');
            $(".myratings").text(sim);
        } else {
            $('.myratings').css('color', 'green');
            $(".myratings").text(sim);
        }
    });


});

//Actualizar media = función devuelve media y cambia id="rated"
async function actualizarMedia(valor) {
    const media = await fetch('/nuevaValoracion',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: valor
        }) //En servidor debería hacer y guardar la media

    let text = document.getElementById('rated');
    text.innerHTML = 'Gracias por tu valoración: ' + valor

    return media
}
