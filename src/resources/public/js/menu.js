$(document).ready(function() {
    $("#menu").hide()
    $(document).on('keydown', function(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            $("#menu").show()
        }   
    });

    $(document).on('keyup', function(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            $("#menu").hide()
        }   
    });

    $("#home-icon").click(function(){
        location.href= "index.html";
    });

});