var commonModule = (function(){

    return {
        TIME_BETWEEN_ITERATIONS: 20
    }

})();

var UIModule = (function(){

    var PIXEL_COUNT_INCREMENT = 6;


    var _windowHeight;
    var _windowWidth;

    function _addLineWithGap(height, gapStart, gapEnd){

        var firstLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        var secondLine = document.createElementNS("http://www.w3.org/2000/svg", "line");

        firstLine.setAttribute("x1", 0);
        firstLine.setAttribute("y1", height);
        firstLine.setAttribute("x2", gapStart);
        firstLine.setAttribute("y2", height);
        firstLine.setAttribute("style", "stroke:rgb(0,0,0);stroke-width:6");

        secondLine.setAttribute("x1", gapEnd);
        secondLine.setAttribute("y1", height);
        secondLine.setAttribute("x2", _windowWidth);
        secondLine.setAttribute("y2", height);
        secondLine.setAttribute("style", "stroke:rgb(0,0,0);stroke-width:6");

        var svg = document.getElementById('screen');

        svg.appendChild(firstLine);
        svg.appendChild(secondLine);
    }

    function _loadEvents(){
        $("body").mousemove(function(e){
            $("circle").velocity({translateX: e.pageX}, {queue: false, duration: 1});
        });

//        $(window).on("resize", function(e){
//            _resizeSVG();
//        });
    }

    function _runTest(){
        _addLineWithGap(300, 400, 600);
        _addLineWithGap(500, 300, 1000);
        _addLineWithGap(800, 1500, 1700);
    }

    //adjusts height of the canvas to math viewport height
    function _resizeSVG(){
        _windowHeight =  $(window).height();
        _windowWidth = $(window).width();

        var bounds = $("svg")[0].getBBox();

        $("svg").css("height", _windowHeight - 10 + "px");
    }

    function _iterateLines(){
        $('line').velocity({translateY: '-=' + PIXEL_COUNT_INCREMENT}, {duration: commonModule.TIME_BETWEEN_ITERATIONS, queue: false});
    }

    //removes line when it's no longer visible
    function _cleanupLinesThatPassed(){
        $('line').each(function(){
            var value = $(this).css('transform');
            var matrix = value.match(/[0-9., -]+/)[0].split(", ");
            var animatedOnYAxis = matrix[5];
            if(this.getBoundingClientRect().top + parseFloat(animatedOnYAxis) < -5){
                $(this).remove();
            }
        });
    }

    return {
        runTest: function(){
            _runTest();
        },

        initialize: function(){
            _resizeSVG();
            _loadEvents();
        },

        iterateLines: function(){
            _iterateLines();
        },

        cleanupLinesThatPassed: function(){
            _cleanupLinesThatPassed();
        }
    };
})();



var gameModule =  (function(){

    function _startGame() {
        setInterval(function(){
            UIModule.iterateLines();
            UIModule.cleanupLinesThatPassed();
        }, commonModule.TIME_BETWEEN_ITERATIONS);
    }


    return {
        startGame: function() {
            _startGame();
        }
    }

})();


$(document).ready(function(){
    UIModule.initialize();
    UIModule.runTest();
    gameModule.startGame();
});
