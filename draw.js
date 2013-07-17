var width = 700;
var height = 500;

// The currently selected Raphael element (or null if none)
var selected_element = null;

// Where mousedown happened when line drawing.
var start_point = null;

// List of hotkeys, what they're called, and what they do.
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
            $("input[name=shape][value=rect]").prop("checked", true).change();
        },
    },
    
    {
        key: 'c',
        name: "Circle mode",
        func: function(){
            $("input[name=shape][value=circle]").prop("checked", true).change();
        },
    },

    {
        key: 'e',
        name: "Ellipse mode",
        func: function(){
            $("input[name=shape][value=ellipse]").prop("checked", true).change();
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
        key: 'u',
        name: 'Up Arrow Mode',
        func: function(){
            $("input[name=shape][value=up-arrow]").prop("checked", true);
        }
    },

    {
        key: 'R',
        name: "Randomize colors",
        func: function() {
            $("button#random-color").click();
        },
    },
];


// Set inputs to default sizes such as radius, width, etc. for the various
// shapes.
function reset_sizes(shape){
    var default_sizes = {
        'rect': {
            'height':   50,
            'width':    100,
            'x-radius': 0,
            'y-radius': 0
        },

        'circle': {
            'height':   0,
            'width':    0,
            'x-radius': 50,
            'y-radius': 0
        },

        'ellipse': {
            'height':   0,
            'width':    0,
            'x-radius': 100,
            'y-radius': 50
        }
    };

    for(var k in default_sizes[shape]){
        $("#" + k ).val(default_sizes[shape][k]);
    };
};

function delete_element(elem, duration){
    duration  = duration || 300;
    var param = {opacity: 0};

    if (elem.glowers){
        elem.glowers.remove();
    };

    elem.animate(
        {
            transform: "s1.5 r-180"
        },
        duration / 2,
        'ease-in-out',
        function(){ 
            this.animate(
                {
                    transform: "s0.1 r270",
                    opacity: 0
                }, 
                duration / 2, 
                'ease-in-out',
                function() { 
                    this.remove() 
                    select_element(paper.top);
                }
            ); 
        }
    );

};

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

    if ( element === null ) {
        $(".with-selected").attr("disabled","disabled");

    } else {
        $(".with-selected").attr("disabled", null);
        element.glowers = element.glow();
        element.toFront();
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

    paper = new Raphael(document.getElementById("svg-container"), width, height);

    // Behaviors for various types of drawing
    var shapes = {
        'circle': function(x, y){
            return paper.circle( x, y, $("#x-radius").val() )
                .attr({stroke: $("#stroke").val(), fill: $("#fill").val()});
        },

        'ellipse': function(x, y){
            return paper.ellipse( x, y, $("#x-radius").val(), $("#y-radius").val() )
                .attr({stroke: $("#stroke").val(), fill: $("#fill").val()});
        },

        'rect': function(x, y){
            return paper.rect( x, y, $("#width").val(), $("#height").val() )
                .attr({stroke: $("#stroke").val(), fill: $("#fill").val()});
        },

        'up-arrow': function(x, y, s) {
            s = s || 1;
            return paper.path("M" + x + "," + y + 
            " l0," + (-100 * s) + 
            " l" + (-50 * s) + ",0" +
            " l" + (100 * s) + "," + (-100 * s) + 
            " l " + (100 * s) + "," + (100 * s) + 
            " l " + (-50 * s) + ",0" +
            " l0," + (100 * s) +
            " z").attr({stroke: $("#stroke").val(), fill: $("#fill").val()});
        }

    };

    // Clear button
    $("button#clear").on('click', function(event){

        var duration = 300;
        paper.forEach(function(elem){
            delete_element(elem);
        });

        setTimeout(function(){paper.clear()}, duration);    
        start_point = null;
    });

    // 'Click' handler -- actually mousedown to enable line drawing.
    $("#svg-container").on("mousedown", function(event){
        this.focus();
        var shape = $("input[name=shape]:checked").val();

        if (shape !== 'line'){
            
            var element = shapes[shape](event.offsetX, event.offsetY);

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
                recalibrate_to(this);
            });

            // Select newly created elements
            select_element(element);

        } else {

            start_point = { x: event.offsetX, y: event.offsetY };

        } ;

    });

    // On mouseup, draw a line perhaps
    $("#svg-container").on("mouseup", function(event){
        if ($("input[name=shape]:checked").val() === 'line'){

            // Draw the line
            var line = paper.path("M " + start_point.x + " " + start_point.y +
                "L " + event.offsetX + " " + event.offsetY )
                .attr({stroke: $("input[type=color]").val() });

            // Make the line selectable
            line.click(function(){
                select_element( this === selected_element ? null : this );
            });
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
        reset_sizes($(this).val());
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
            elem.attr("width", $(this).val());
            select_element(elem);
        }

    });

    $("#height").on('change', function(){
        if (selected_element) {
            var elem = selected_element;
            elem.attr("height", $(this).val());
            select_element(elem);
        }

    });

    $("#x-radius").on('change', function(){
        if (selected_element) {
            var elem = selected_element;
            elem.attr( 
                ( elem.type === 'ellipse' ? "rx" : "r" ), 
                $(this).val());
            select_element(elem);
        }

    });

    $("#y-radius").on('change', function(){
        if (selected_element) {
            var elem = selected_element;
            elem.attr("ry", $(this).val());
            select_element(elem);
        }

    });

    // Delete current element
    $("button#delete").on('click', function(event){
        if (selected_element) {
            delete_element(selected_element);
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

            // This is sort of a hack: for rectangles, we want 0.  For circles or
            // ellipses, we want half the (vertical) radius.  Circle have an
            // 'r' attribute, ellipses have 'ry' instead, and rectangles have
            // neither.
            var rise_to = parseInt(elem.attr("r")) + parseInt(elem.attr("ry")); 

            select_element(null);

            elem.animate(
                { y: rise_to, cy: rise_to },  // Rectangles need 'y', circles and ellipses want 'cy'. (God!)
                2500, 
                "elastic", 
                function(){ select_element(elem)}
            );
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

    select_element(null);
    
});
