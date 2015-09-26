var UIModule = (function(){

    var _windowHeight;
    var _windowWidth;

    function _addLineWithGap(gapStart, gapEnd){

        var firstLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        var secondLine = document.createElementNS("http://www.w3.org/2000/svg", "line");

        firstLine.setAttribute("x1", 0);
        firstLine.setAttribute("y1", 500);
        firstLine.setAttribute("x2", gapStart);
        firstLine.setAttribute("y2", 500);
        firstLine.setAttribute("style", "stroke:rgb(0,0,0);stroke-width:6");

        secondLine.setAttribute("x1", gapEnd);
        secondLine.setAttribute("y1", 500);
        secondLine.setAttribute("x2", _windowWidth);
        secondLine.setAttribute("y2", 500);
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
        _addLineWithGap(400,600);
    }

    //adjusts height of the canvas to math viewport height
    function _resizeSVG(){
        _windowHeight =  $(window).height();
        _windowWidth = $(window).width();

        var bounds = $("svg")[0].getBBox();

        $("svg").css("height", _windowHeight - 10 + "px");
    }

    return {
        startGame: function() {

        },

        runTest: function(){
            _runTest();
        },

        initialize: function(){
            _resizeSVG();
            _loadEvents();
        }
    };
})();



var gameModule =  (function(){


    return {

    }

})();


$(document).ready(function(){
    UIModule.initialize();
    UIModule.runTest();
});
