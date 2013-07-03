$(function(){

    paper = new Raphael(document.getElementById("svg-container"), 800, 450);

    last_action = null;

    // Behaviors for various types of drawing
    var brushes = {
        'circle': function(x, y){
            return paper.circle( x, y, $("#x-radius").val() );
        },

        'ellipse': function(x, y){
            return paper.ellipse( x, y, $("#x-radius").val(), $("#y-radius").val() );
        },

        'rectangle': function(x, y){
            return paper.rect( x, y, $("#width").val(), $("#height").val() );
        },

        'line': function(x, y){
            return { x: x, y: y };
        }
    };

    // Clear button
    $("button#clear").on('click', function(event){
        paper.clear();    
    });

    // 'Click' handler -- actually mousedown to enable drag/drop etc.
    $("svg").on("mousedown", function(event){
        this.focus();
        var brush = $("input[name=brush]:checked").val();
        last_action = brushes[brush](event.offsetX, event.offsetY);
        
        if (brush !== 'line'){
            last_action.attr({
                stroke: $("input#stroke").val(),
                fill:   $("input#fill").val() 
            });
        };
    });

    // On mouseup, draw a line perhaps
    $("svg").on("mouseup", function(event){
        if ($("input[name=brush]:checked").val() === 'line'){
            var line = paper.path("M " + last_action.x + " " + last_action.y +
            "L " + event.offsetX + " " + event.offsetY);
            line.attr({stroke: $("input[type=color]").val() });
        };
    });

    // Add min/max labels to the range elements
    $("input[type=range]").each(function(){
        $(this).prev("span").text( $(this).prop("min") ).
            nextAll("span").text( $(this).prop("max") );
    });

});
