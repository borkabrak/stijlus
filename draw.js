$(function(){

    paper = new Raphael(document.getElementById("svg-container"), 600, 500);

    $("#x, #y, #x-radius, #y-radius, #width, #height").prop("min","0").prop("step","20");
    $("#y").prop("max",$("svg").prop("height"));
    $("#x").prop("max",$("svg").prop("width" ));

    $("button#clear").on('click',function(event){
        paper.clear();    
    });

    $("svg").on("click", function(event){

        // Set the x,y coords to the click
        $("#x").val(event.offsetX);
        $("#y").val(event.offsetY);

        var brush = ($("input[name=brush]:checked").val())

        if (brush === "circle"){
            brush = paper.circle( $("#x").val(), $("#y").val(), $("#x-radius").val() );
        } else if (brush === "ellipse"){
            brush = paper.ellipse( $("#x").val(), $("#y").val(), $("#x-radius").val(), $("#y-radius").val() );
        } else if (brush === "rectangle"){
            brush = paper.rect( $("#x").val(), $("#y").val(), $("#width").val(), $("#height").val() );
        } else {
            console.log("Unrecognized brush type '%s'",brush);
        };
    });

    move_cursor = function(x, y){
        
        paper.path( Paths.cursor(x, y, 10) );
    };

    /* A simple namespace for building various path strings. */
    Paths = {

        cursor:  function(x,y,size){
            // Return a Path string drawing a cross-shaped cursor, centered on
            // the given coordinates.
            return "M" + x + " " + y +
            "m 0" + (-1 * size) +
            "v" + (size * 2) + 
            "m " + (-1 * size) + " " + (-1 * size) +
            "h" + (size * 2); },

    };
});

