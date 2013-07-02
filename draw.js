$(function(){

    paper = new Raphael(document.getElementById("svg-container"), 600, 500);

    var brushes = {
        'circle': function(x,y){
            return paper.circle( x, y, $("#x-radius").val() );
        },

        'ellipse': function(x,y){
            return paper.ellipse( x, y, $("#x-radius").val(), $("#y-radius").val() );
        },

        'rectangle': function(x,y){
            return paper.rect( x, y, $("#width").val(), $("#height").val() );
        }
    };

    $("#x-radius, #y-radius, #width, #height").prop("min","0").prop("step","20");

    $("button#clear").on('click',function(event){
        paper.clear();    
    });

    $("svg").on("click", function(event){
        var shape = brushes[$("input[name=brush]:checked").val()](event.offsetX, event.offsetY);
    });

});
