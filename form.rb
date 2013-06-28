<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <script src="/scripts/jquery.js" type="text/javascript"></script>
        <script src="/scripts/jclib.js" type="text/javascript"></script>
        <link href="form.css" rel='stylesheet' type="text/css"></link>
        <title>Super-Eleet Hacker Interface</title>

    </head>
    <body>
        <h1>Super-Eleet Hacker Interface</h1>
        <div id="f">

            <form name="f" action="#">

                Number (1-10, by 0.5)
                <input name="number" type="number" max="10" min="1" step="0.5" />
                <br />

                Same, but a slider
                <input name="slider" type="range" min="1" max="10" step="0.5"/>
                <br />

                <hr />

                Date1
                <input name="date1" type="date" />
                <br />

                Date2
                <input name="date2" type="date" />
                <br />

                <hr />

                Pick a month
                <input name="date" type="month" value="2012-09"/>
                <br />

                Pick a week
                <input name="date" type="week" />
                <br />

                Pick a color (As of now, only Opera &gt;= 11)
                <input name="color" type="color" />
                <br />

                Email address: interesting for the validation.
                <input name="email" type="email" />
                <br />

                URL:
                <input type="url" />
                <br />

                Roll-yer-own validation <br />
                Pattern:<input name="pattern" type="text" value=".*xxx.*"/>
                Match the text<input type="text" pattern="" />
                
                Don't worry -- the form just submits to itself.
                <input type="submit" />
                <br />

            </form>

            <hr />

            <button id="progress">Download Hyper-Trojan Nanovirus</button> <br />
            <progress max="100" value="0" /></progress> <br />
            <p class="output hidden">Download Complete!</p>

            <hr />

            De-rez monoparity IP encryptions: <br />
            <meter low=".3" high=".7" optimum=".5"></meter>
            <p class="display hidden">Database pipelines synchronized!</p>
            <br />

            <button id="meter-down">-</button>
            <button id="meter-up">+</button>
        </div>
    </body>
    <script type="text/javascript">
    $(function(){

        $("form").on('submit', function(event){
            console.log("Submitted: %o", event.currentTarget);
            return false;
        });

        $("#progress").on('click',function(event){
            var p = $("progress");

            var interval = setInterval(function(){

                if (p.val() >= p[0].max) {
                    $(".output").removeClass("hidden");
                    return clearInterval(interval); }

                p.val(p.val() + 1);

            }, 30);

        });

        $("#meter-up").on('click',function(event){
            var p = $("meter");
            var newval = (p.val() + Math.random() * 0.3);
            checkwin(p);
            p.val(newval);
        });

        $("#meter-down").on('click',function(event){
            var p = $("meter");
            var newval = (p.val() - Math.random() * 0.3);
            checkwin(p);
            p.val(newval);
        });

        $("[name=pattern]").on('change',function(event){
            console.log("Pattern changed");
        });

        function checkwin(e){
            e = $(e);
            console.log("val:'%s' opt:'%s'",e.val(), e[0].optimum);
            if ( Math.abs(e.val() - e[0].optimum) < .1) {
                $(".display").removeClass("hidden");
            }
        };

        // Apparently, you have to use javascript to set <input type='date'...
        // to non-specific dates like 'today'.
        document.querySelectorAll("input[type='date']").forEach(function(k,v){ 
            v.valueAsDate = new Date 
        });

    });
    </script>
</html>
