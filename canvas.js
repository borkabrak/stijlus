$(function(){

    canvas_init = function() {
        $("#fill-style").change();
        $("#stroke-style").change();
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


});
