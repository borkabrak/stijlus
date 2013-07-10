var selected_element = null;

var start_point = null;

var keymap = [

    {
        key: ' ',
        name: "Deselect",
        func: function(){
            select_element(null);
        },
    },

    {
        key: 'C',
        name: "Clear",
        func: function(){
            $("button#clear").click();
        }
    },

    {
        key: 'g',
        name: "fall",
        func: function(){
            $("button#fall").click();
        },
    },

    {

        key: 'h',
        name: "rise",
        func: function(){
            $("button#rise").click();
        },
    },

    {

        key: 'd',
        name: "delete selected",
        func: function(){
            $("button#delete").click();
        },
    },

    {
        key: 'r',
        name: "Rectangle mode",
        func: function(){
            $("input[name=shape][value=rect]").prop("checked", true);
        },
    },
    
    {
        key: 'c',
        name: "Circle mode",
        func: function(){
            $("input[name=shape][value=circle]").prop("checked", true);
        },
    },

    {
        key: 'e',
        name: "Ellipse mode",
        func: function(){
            $("input[name=shape][value=ellipse]").prop("checked", true);
        },
    },

    {
        key: 'l',
        name: "Line mode",
        func: function(){
            $("input[name=shape][value=line]").prop("checked", true);
        },
    },

    {
        key: 'R',
        name: "Randomize colors",
        func: function() {
            $("button#random-color").click();
        },
    },
];

function randomColor(random_for_reals){

    var color = "#";

    if (random_for_reals){
        // Build a random 8-bit color string. 
        // (i.e. "#x0y0z0" where x, y, and z are all random)
        for(var i = 0; i < 3; i++){
            color += Math.floor(Math.random() * 16).toString(16) + "0";
        };

    } else {
        // Pick a random value from a precoded list.
        var colors = [
            'ff0000',
            '00ff00',
            '0000ff',
            'ffff00',
            'ff00ff',
            '00ffff',
            '000000',
            'ffffff'
        ];

        color += colors[Math.floor( Math.random() * colors.length )];
    }

    return color;
}

function select_element(element){

    if (selected_element && selected_element.glowers){
        selected_element.glowers.remove();
    };

    if ( element !== null ) {
        element.glowers = element.glow();
        element.toFront();
        recalibrate_to(element);
    };

    return selected_element = element;
};

function recalibrate_to(elem){
    // Set all input values to those of the given element.
    var attr = elem.attrs;
    if (attr.width) { 
        $("#width").val(attr.width)
    };

    if (attr.height) { 
        $("#height").val(attr.height)
    };

    if (attr.r || attr.rx) { 
        $("#x-radius").val( attr.r ? attr.r : attr.rx )
    };

    if (attr.ry) { 
        $("#y-radius").val(attr.ry)
    };

    if (attr.fill) { 
        $("#fill").val(attr.fill)
    };

    if (attr.stroke) { 
        $("#stroke").val(attr.stroke)
    };

    if (elem.type) {
        $("input[name=shape][value=" + elem.type + "]").prop("checked", true);
    };
};

$(function(){

    paper = new Raphael(document.getElementById("svg-container"), 800, 550);

    // Behaviors for various types of drawing
    var shapes = {
        'circle': function(x, y){
            return paper.circle( x, y, $("#x-radius").val() );
        },

        'ellipse': function(x, y){
            return paper.ellipse( x, y, $("#x-radius").val(), $("#y-radius").val() );
        },

        'rect': function(x, y){
            return paper.rect( x, y, $("#width").val(), $("#height").val() );
        },

    };


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

                    select_element(null);

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

                    this.opacity = "0.5";

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

            element.click(function(){
                select_element( this === selected_element ? null : this );
            });

            // Select newly created elements
            select_element(element);

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
        $("#fill").val(randomColor(true)).change();
        $("#stroke").val(randomColor(true)).change();
        return false;

    }).click();

    // when you pick a new shape..
    $("input[name=shape]").on('change',function(){
    });

    // Apply new color to selected element.
    $("#fill").on('change', function(){
        if ( selected_element ) { 
            selected_element.animate({fill: $(this).val()}, 300, "bounce");
        };
    });

    // Apply various dimension changes to selected elements
    $("#width").on('change', function(){
        if (selected_element) {
            var elem = selected_element;
            select_element(null);
            elem.attr("width", $(this).val());
            select_element(elem);
        }

    });

    $("#height").on('change', function(){
        if (selected_element) {
            var elem = selected_element;
            select_element(null);
            elem.attr("height", $(this).val());
            select_element(elem);
        }

    });

    $("#x-radius").on('change', function(){
        if (selected_element) {
            var elem = selected_element;
            select_element(null);
            elem.attr( 
                ( elem.type === 'ellipse' ? "rx" : "r" ), 
                $(this).val());
            select_element(elem);
        }

    });

    $("#y-radius").on('change', function(){
        if (selected_element) {
            var elem = selected_element;
            select_element(null);
            elem.attr("ry", $(this).val());
            select_element(elem);
        }

    });

    // Delete current element
    $("button#delete").on('click', function(event){
        if (selected_element) {
            var elem = selected_element;
            var param = {opacity: 0};

            if (elem.glowers){
                elem.glowers.remove();
            };

            if (elem.type === 'circle') {
                param.r = 0;

            } else if (elem.type === 'ellipse') {
                param.rx = 0;
                param.ry = 0;

            } else if (elem.type === 'rect') {
                param.width = 0;
                param.height = 0;
            };

            elem.animate(param, 500, 'ease-in-out', function(){
                elem.remove();
            });

        };
        select_element(null);
    });

    $("button#fall").on('click', function(event){
        if (selected_element){
            var elem = selected_element;
            var param = {};
            select_element(null);
            if ( elem.type === 'rect' ) {
                param = {
                    y: Math.floor(paper.height - elem.attr("height") )
                };

            } else if ( elem.type === 'circle' ){
                param = {
                    cy: Math.floor(paper.height - elem.attr("r") )
                };

            } else if ( elem.type === 'ellipse' ){
                param = {
                    cy: Math.floor(paper.height - elem.attr("ry") )
                };
            };

            elem.animate(param, 1500, "bounce", function(){ select_element(elem) });
        };
    });

    $("button#rise").on('click', function(event){
        if (selected_element){
            var elem = selected_element;
            var param = { };
            select_element(null);
            if ( elem.type === 'rect' ) {
                param = { y: elem.attr("height") };
            } else if ( elem.type === 'circle' ){
                param = { 
                    cy: elem.attr("r"),
                };
            } else if ( elem.type === 'ellipse' ){
                param = { cy: elem.attr("ry") };
            };
            elem.animate(param, 4000, "elastic", function(){ select_element(elem)});
        };
    });

    // Handle keyed input
    $(document).on('keypress', function(event){

        var key = String.fromCharCode( event.which );

        keymap.forEach(function(mapping) {
            if (mapping.key === key){
                mapping.func.call(); } 
        });

    });

    // Display keymap
    ul = $("<ul class='keys'></ul>");
    keymap.forEach(function(mapping) {
        ul.append($("<li>'" + mapping.key + "': " + mapping.name + "</li>"));
    });
    $("#instructions").append(ul);
});
