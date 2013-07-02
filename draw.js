$(function(){

    paper = new Raphael(document.getElementById("svg-container"), 600, 500);

    var last_action;

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

    $("#x-radius, #y-radius, #width, #height").prop("min", "0").prop("step", "20");

    $("button#clear").on('click', function(event){
        paper.clear();    
    });

    $("svg").on("mousedown", function(event){
        last_action = brushes[$("input[name=brush]:checked").val()](event.offsetX, event.offsetY);
    });

    $("svg").on("mouseup", function(event){
        if ($("input[name=brush]:checked").val() === 'line'){
            paper.path("M " + last_action.x + " " + last_action.y +
            "L " + event.offsetX + " " + event.offsetY);
        };
    });

});
