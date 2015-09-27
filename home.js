/* IDEAS
    score to be written on ball
*/

var commonModule = (function(){

    return {
        initialize: function(){
            this.WINDOW_HEIGHT = $(window).height();
            this.WINDOW_WIDTH = $(window).width();
        },
        TIME_BETWEEN_ITERATIONS: 30,
        ROW_SPEED: 3000,
        DISTANCE_BETWEEN_ROWS: 300,
        PIXEL_COUNT_INCREMENT: 10,
        IS_PAUSED: false
    }
})();

var UIModule = (function(){

    var GAP_WIDTH = 200;

    var _svg;

    var _readLineOnLeft = true;

    var _ballText;
    var _ballRadius;
    var _ballPosition = {};

    function _addRow(){
        var gap = _getRandomGap();
        _addRowWithGap(commonModule.WINDOW_HEIGHT, gap.gapBegin, gap.gapEnd);
    }

    function _addRowWithGap(height, gapBegin, gapEnd){
        var firstLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        var secondLine = document.createElementNS("http://www.w3.org/2000/svg", "line");

        firstLine.setAttribute("x1", 0);
        firstLine.setAttribute("y1", height);
        firstLine.setAttribute("x2", gapBegin);
        firstLine.setAttribute("y2", height);
        firstLine.setAttribute("style", "stroke:rgb(0,0,0);stroke-width:6");

        secondLine.setAttribute("x1", gapEnd);
        secondLine.setAttribute("y1", height);
        secondLine.setAttribute("x2", commonModule.WINDOW_WIDTH);
        secondLine.setAttribute("y2", height);
        secondLine.setAttribute("style", "stroke:rgb(0,0,0);stroke-width:6");

        _svg.appendChild(firstLine);
        _svg.appendChild(secondLine);

        return {
            firstLine: firstLine,
            secondLine: secondLine
        }
    }

    function _addMovingRow(){
        var gap = _getRandomGap();
        var rows =  _addRowWithGap(commonModule.WINDOW_HEIGHT, gap.gapBegin, gap.gapEnd);
        $(rows.firstLine).velocity({translateY: -commonModule.WINDOW_HEIGHT}, commonModule.ROW_SPEED, [0.5,0.5,0.5,0.5]);
        $(rows.secondLine).velocity({translateY: -commonModule.WINDOW_HEIGHT}, commonModule.ROW_SPEED, [0.5,0.5,0.5,0.5]);
    }

    function _loadEvents(){
        $("body").mousemove(function(e){
            $("circle").velocity({translateX: e.pageX}, {queue: false, duration: 1});
            _ballPosition.x = e.pageX;
            $('text').velocity({translateX: e.pageX - 5}, {queue: false, duration: 1});
        });

        $(window).keypress(function(e){
            if(commonModule.IS_PAUSED){
                commonModule.IS_PAUSED = false;
            } else {
                commonModule.IS_PAUSED = true;
            }

        });
    }

    function _runTest(){
        _addRowWithGap(300, 400, 600);
        _addRowWithGap(500, 300, 1000);
        _addRowWithGap(800, 1500, 1700);
    }

    //adjusts height of the canvas to math viewport height
    function _resizeSVG(){
        var bounds = $("svg")[0].getBBox();
        $("svg").css("height", commonModule.WINDOW_HEIGHT - 10 + "px");
        var circle = $('circle');
        _ballPosition.y =  parseInt(circle.attr('cy'));
        _ballRadius = parseInt(circle.attr('r'));
        _svg = document.getElementById('screen');
    }

    function _iterateLines(){
        $('line').velocity({translateY: '-=' + commonModule.PIXEL_COUNT_INCREMENT}, {duration: commonModule.TIME_BETWEEN_ITERATIONS, queue: false});
        _isThereCollision();
    }

    function _isThereCollision(){
        var firstLine = $('line')[0];
        var secondLine = $('line')[1];

        //first and second line have same values of Y position and translation
        var firstLineYTranslation = parseInt(_getYTranslationForLine(firstLine));
        var firstLineInitialYPosition = parseInt($(firstLine).attr('y1'));

        var gap = {};
        gap.gapBegin = parseInt($(firstLine).attr('x2'));
        gap.gapEnd = parseInt($(secondLine).attr('x1'));

        if(firstLineInitialYPosition + firstLineYTranslation < _ballPosition.y + _ballRadius + commonModule.PIXEL_COUNT_INCREMENT){
            if((_ballPosition.x - _ballRadius) < gap.gapBegin || (_ballPosition.x + _ballRadius) > gap.gapEnd){
                if(firstLineInitialYPosition + firstLineYTranslation > _ballPosition.y - _ballRadius + commonModule.PIXEL_COUNT_INCREMENT){
                    commonModule.IS_PAUSED = true;
                    ballText.innerHTML = '0';
                }
            }
        }

    }

    function _getRandomGap(){
        var gapBegin = Math.random() * (commonModule.WINDOW_WIDTH - GAP_WIDTH);
        var gapEnd = gapBegin + GAP_WIDTH;
        return {
            gapBegin: gapBegin,
            gapEnd: gapEnd
        }
    }

    function _getYTranslationForLine(line){
        var value = $(line).css('transform');
        var matrix = value.match(/[0-9., -]+/)[0].split(", ");
        return animatedOnYAxis = matrix[5];
    }

    //removes line when it's no longer visible
    function _refreshLinesThatPassed(){
        $('line').each(function(){
            var animatedOnYAxis = _getYTranslationForLine(this);
            alert(animatedonYAxis);
            if(this.getBoundingClientRect().top + parseFloat(animatedOnYAxis) < -5){
                $(this).remove();

                if(_readLineOnLeft){
                    _readLineOnLeft = false;
                } else {
                    //_addRow();
                    _addMovingRow();
                    _incrementBallText();
                    _readLineOnLeft = true;
                }
            }
        });
    }

    function _loadBallText(){
        ballText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        ballText.setAttribute('x', 0);
        ballText.setAttribute('y', _ballPosition.y + 5);
        ballText.setAttribute('fill', 'white');
        ballText.setAttribute('font-size', '20px');
        ballText.innerHTML = '0';

        _svg.appendChild(ballText);
    }

    function _incrementBallText(){
        ballText.innerHTML = parseInt(ballText.innerHTML) + 1;
    }

    return {
        runTest: function(){
            _runTest();
        },

        initialize: function(){
            _resizeSVG();
            _loadEvents();
            _loadBallText();
        },

        iterateLines: function(){
            _iterateLines();
        },

        refreshLinesThatPassed: function(){
            _refreshLinesThatPassed();
        },

        addRow: function(){
//            _addRow();
            _addMovingRow();
        }

    };
})();



var gameModule =  (function(){

    var _interval;
    var _numberOfRows
    var _offset;

    function _addRows() {
        var intervalDuration = (commonModule.DISTANCE_BETWEEN_ROWS / commonModule.PIXEL_COUNT_INCREMENT) * commonModule.TIME_BETWEEN_ITERATIONS;
        var _numberOfRows = commonModule.WINDOW_HEIGHT / commonModule.DISTANCE_BETWEEN_ROWS;
        _offset = commonModule.WINDOW_HEIGHT - parseInt(_numberOfRows) * commonModule.DISTANCE_BETWEEN_ROWS;
        //alert(_offset);
        _interval = setInterval(function(){
            UIModule.addRow();
            _numberOfRows--;
            if(_numberOfRows < 0){
                clearInterval(_interval);
            }
        }, intervalDuration);
    }

    function _startGame() {
        _addRows();
        setInterval(function(){
            if(commonModule.IS_PAUSED == false){
                //UIModule.iterateLines();
                //UIModule.refreshLinesThatPassed();
            }
        }, commonModule.TIME_BETWEEN_ITERATIONS);
    }

    return {
        startGame: function() {
            _startGame();
        }
    }

})();


$(document).ready(function() {
    commonModule.initialize();
    UIModule.initialize();
//    UIModule.runTest();
    gameModule.startGame();
});
