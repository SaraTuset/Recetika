document.addEventListener('DOMContentLoaded', function() {
    // Selecciona todos los inputs dentro de la clase rating
    const ratingInputs = document.querySelectorAll('.rating input');

    ratingInputs.forEach(input => {
        input.addEventListener('click', function() {
            // Obtener el id y el valor del input seleccionado
            const id = this.name.split('_')[1]; // Extraer el id del nombre (rating_{{id}})
            const valor = this.value;

            // Llamar a la función secundaria con los valores obtenidos
            media = actualizarMedia(id, valor);
            recargarValor(id, media);
        });
    });
});

async function actualizarMedia(id, valor){
    const media = await fetch('/nuevaValoracion', 
        { method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, rate })}) //En servidor debería hacer y guardar la media

    let text = document.getElementById('rated_'+id);
    text.innerHTML='Thanks for rating: '+valor

    return media
}

function recargarValor(id,valor){
    const ratingText = getElementById('rating_'+id)
    if (valor<3) {
        ratingText.css('color','red'); 
        ratingText.text(valor);
    }else{
        ratingText.css('color','green');
        ratingText.text(valor);
    }
}