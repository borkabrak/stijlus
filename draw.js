function randomColor(){
    var colors = [
        '#ff0000',
        '#00ff00',
        '#0000ff',
        '#ffff00',
        '#ff00ff',
        '#00ffff',
    ];

    return colors[Math.floor( Math.random() * colors.length )];
}

// Behaviors for various types of drawing
var shapes = {
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

$(function(){

    paper = new Raphael(document.getElementById("svg-container"), 800, 450);

    var start_point = null;
    var current_element = null;

    // Clear button
    $("button#clear").on('click', function(event){
        paper.clear();    
        start_point = null;
    });

    // 'Click' handler -- actually mousedown to enable line drawing.
    $("svg").on("mousedown", function(event){
        this.focus();
        var shape = $("input[name=shape]:checked").val();

        if (typeof shapes[shape] !== 'undefined'){
            
            element = shapes[shape](event.offsetX, event.offsetY);

            // Add color
            element.attr({
                stroke: $("input#stroke").val(),
                fill:   $("input#fill").val() 
            });

            // Drag and Drop
            element.drag(

                // move
                function(dx, dy){

                    if (this.type === 'rect'){
                        this.attr({
                            x: this.ox + dx, 
                            y: this.oy + dy});

                    } else {
                        this.attr({
                            cx: (this.ox + dx), 
                            cy: (this.oy + dy)});

                    };
                },

                // start drag (mousedown)
                function(){

                    if (this.type === 'rect') {
                        this.ox = this.attr("x");
                        this.oy = this.attr("y");

                    } else {
                        this.ox = this.attr('cx');
                        this.oy = this.attr('cy');

                    };
                },
                
                // end (drop, mouseup)
                function(){
                }
            );

            element.mousedown(function(event){
                // Intercept mousedown (so the svg's handler doesn't fire)
                event.stopPropagation();
            });

            element.click(function(event){

                if (current_element && current_element.glowers){
                    current_element.glowers.remove();
                };
                current_element = this;
                this.glowers = this.glow();

            });

        } else if (shape === 'line')  {

            start_point = { x: event.offsetX, y: event.offsetY };

        } ;

    });

    // On mouseup, draw a line perhaps
    $("svg").on("mouseup", function(event){
        if ($("input[name=shape]:checked").val() === 'line'){
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

    // Pick a random fill color
    $("button#random-color").on('click', function(){
        $("#fill").val(randomColor());
        return false;

    }).click();

    $("input[name=shape]").on('change',function(){
        $("button#random-color").click();
    });

});
