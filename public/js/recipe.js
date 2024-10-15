$(document).ready(function(){
    //Actualizar media = función devuelve media y cambia id="rated"
$("input[type='radio']").click(function(){
    //<cambiar a media
        var sim =  $("input[type='radio']:checked").val(); 
    //alert(sim);
    if (sim<3) {
        $('.myratings').css('color','red'); 
        $(".myratings").text(sim);
    }else{
        $('.myratings').css('color','green');
        $(".myratings").text(sim);
    }
 });


});

//Habría que hacer función Actualizar media