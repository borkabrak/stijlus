$(function(){

    paper = new Raphael(document.getElementById("svg-container"), 800, 450);

    var start_point = null;

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

    };

    // Clear button
    $("button#clear").on('click', function(event){
        paper.clear();    
        start_point = null;
    });

    // 'Click' handler -- actually mousedown to enable drag/drop etc.
    $("svg").on("mousedown", function(event){
        this.focus();
        var brush = $("input[name=brush]:checked").val();

        if (typeof brushes[brush] !== 'undefined'){
            
            element = brushes[brush](event.offsetX, event.offsetY);

            // Add color
            element.attr({
                stroke: $("input#stroke").val(),
                fill:   $("input#fill").val() 
            });

            // Element glows on hover
            element.hover(
                function(){
                    this.glowers = this.glow();
                },

                function(){
                    this.glowers.remove();
                },

                element, element );
            
            // Enable drag-n-drop
            element.drag(
                function(dx, dy){
                    this.attr({cx: this.ox + dx, cy: this.oy + dy});
                },

                function(){
                    this.glowers.remove();
                    this.ox = this.attr("cx");
                    this.oy = this.attr("cy");
                }
            );

            element.mousedown(function(event){
                // Intercept mousedown (so the svg's handler doesn't fire)
                event.stopPropagation();
            });

        } else if (brush === 'line')  {

            start_point = { x: event.offsetX, y: event.offsetY };

        } ;

    });

    // On mouseup, draw a line perhaps
    $("svg").on("mouseup", function(event){
        if ($("input[name=brush]:checked").val() === 'line'){
            var line = paper.path("M " + start_point.x + " " + start_point.y +
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
