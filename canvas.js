$(function(){

    canvas_init = function() {
        $("#fill-style").change();
        $("#stroke-style").change();
    };

    cursor = {
        x: 0,
        y: 0,
    };

    /*
     * MODE
     */
    $("input[type=radio][name=mode]").on('click',function(event){
        var mode = event.currentTarget.value;
        $(".control-panel").hide();

        prepare(mode);

    });

    prepare = function(mode){

        $("canvas").remove();
        $("svg").remove();

        $(".control-panel#" + mode).fadeIn();

        if (mode === "core") {

            canvas = document.createElement("canvas");
            document.querySelector("#canvas-container").appendChild(canvas);
            context = canvas.getContext("2d");
                        
        } else if (mode === "raphael") {

            paper = new Raphael(document.getElementById("canvas-container"), 400, 500);

            $("#x, #y, #x-radius, #y-radius, #width, #height").prop("min","0").prop("step","20");
            $("#y").prop("max",$("svg").prop("height"));
            $("#x").prop("max",$("svg").prop("width" ));

        };
    };

    $("#stroke-style").on('change', function(event){
        context.strokeStyle = event.currentTarget.value || "#000";
    });

    $("#fill-style").on('change', function(event){
        context.fillStyle = event.currentTarget.value || "#000";
    });


    // Actions

    $("#put-text").on('click', function(event){
        canvas_init();
        context.font = 'bold 20px sans-serif';
        context.fillText($("#say").val(), 50, 50);
    });

    $("#draw").on( 'click', function(event){
        canvas_init();
        context.fillRect(100, 100, 150, 150);
    });

    $("#clear").on( 'click', function(event){
        canvas.width = canvas.width;
        canvas_init;
    });

    $("#grid").on( 'click', function(event){

        var spacing = parseInt($("#spacing").val()) || 10;

        for (var i = 0.5; i < canvas.width; i += spacing) {
            context.moveTo(i, 0);
            context.lineTo(i, canvas.height);
        }

        for (var i = 0.5; i < canvas.height; i += spacing) {
            context.moveTo(0, i);
            context.lineTo(canvas.width, i);
        }

        context.stroke();

    });

    var interval = 0;
    $("#throb").on( 'click', function(event){
        canvas_init();
        $("canvas").toggleClass("throb");

        interval = setInterval(function(){
            $("canvas").toggleClass("throb");
        }, 1000);

    });

    $("#nothrob").on( 'click', function(event){
        clearInterval(interval);
    });

    $("#make-gradient").on( 'click', function(event){
        // define two points between which to draw the gradient.
        var gradient = context.createLinearGradient(0, 300, 500, 0);

        // Set the color stops
        gradient.addColorStop(0, "#00f");
        gradient.addColorStop(1, "#ff0");
        context.fillStyle = gradient;
        context.fillRect(0, 0, 500, 300);

    });

    /*
     *
     *  Raphaël
     *
     */


    // Start in raphael mode    
    $("input[name=mode][value=raphael]").click().focus();

    $r = $("#raphael");

    $r.find("button#clear").on('click',function(event){
        paper.clear();    
    });

    $r.find("button#circle").on('click',function(event){
        circle = paper.circle( $("#x").val(), $("#y").val(), $("#x-radius").val() );
    });

    $r.find("button#ellipse").on('click',function(event){
        circle = paper.ellipse( $("#x").val(), $("#y").val(), $("#x-radius").val(), $("#y-radius").val() );
    });

    $r.find("button#rectangle").on('click',function(event){
        circle = paper.rect( $("#x").val(), $("#y").val(), $("#width").val(), $("#height").val() );
    });

    // Record last click
    $("svg").on("click", function(event){
        //clear_cursor();
        move_cursor(event.offsetX, event.offsetY);
    });

    move_cursor = function(x, y){
        
        // Paths.clear( Path.cursor(cursor.x,cursor.y,10) )
        cursor.x = x;
        cursor.y = y;

        paper.path( Paths.cursor(x, y, 10) );
    };

    /* A simple namespace for building various path strings. */
    Paths = {

        cursor:  function(x,y,size){
            return "M" + x + " " + y +
            "m 0" + (-1 * size) +
            "l0 " + (size * 2) + 
            "m " + (-1 * size) + " " + (-1 * size) +
            "l" + (size * 2) + " 0"; },

        clear: function(path_string) {
            }
    };

});

