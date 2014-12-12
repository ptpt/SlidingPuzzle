$(function () {
    'use strict';

    // Constants
    var ROWS = 4, COLS = 5;

    var sliding = new SimpleSliding(ROWS, COLS),
        puzzle = document.getElementById('puzzle');

    sliding.render(puzzle, 4);

    $(sliding.squares).click(function () {
        var id = $(this).data('id');
        sliding.slide(id);
        if (timer.started() && sliding.completed()) {
            alert('Total time: ' + (timer.end() / 1000) + ' seconds');
        }
    });

    $('#new-game').click(function () {
        sliding.shuffle();
        timer.start();
    });

    $(window).keydown(function (event) {
        event.preventDefault();

        var emptyPos = sliding.position[sliding.emptyID],
            emptyRow = emptyPos[0],
            emptyCol = emptyPos[1];

        switch (event.which) {
        case 37:            // left
            if (emptyCol + 1 < sliding.cols) {
                sliding.slide([emptyRow, emptyCol + 1]);
            }
            break;
        case 39:            // right
            if (emptyCol - 1 >= 0) {
                sliding.slide([emptyRow, emptyCol - 1]);
            }
            break;
        case 38:            // up
            if (emptyRow + 1 < sliding.rows) {
                sliding.slide([emptyRow + 1, emptyCol]);
            }
            break;
        case 40:            // down
            if (emptyRow - 1 >= 0) {
                sliding.slide([emptyRow - 1, emptyCol]);
            }
            break;
        default:
            break;
        }
    });

    var timer = {
        start: function () {
            this.startTime = Date.now();
            return this.startTime;
        },

        end: function () {
            var sofar = this.sofar();
            this.startTime = null;
            return sofar;
        },

        sofar: function () {
            if (!this.started()) {
                throw new Error('not started yet');
            }
            return Math.floor(Date.now() - this.startTime);
        },

        started: function () {
            return this.startTime != null;
        }
    };

    var img;

    var loadImage = function (src) {
        img = new Image();
        $(img).on('load', function () {
            if ($(puzzle).hasClass('hidden')) {
                $(puzzle).removeClass('hidden');
            }
            adjustSize();
            $(sliding.squares).css({'background-image': 'url(' + src + ')'});
        });
        img.src = src;
    };

    var responsiveSize = function (width, height, viewportWidth, viewportHeight) {
        var ratio = 1;
        if (viewportHeight != null) {
            ratio = viewportHeight / height;
        }
        if (viewportWidth != null && ratio * width > viewportWidth) {
            ratio = viewportWidth / width;
        }
        var adjustedWidth = Math.min(width * ratio, width),
            adjustedHeight = Math.min(height * ratio, height);

        return [adjustedWidth, adjustedHeight];
    };

    var adjustSize = function () {
        var width, height;

        if (img) {
            width = img.width + puzzle.offsetWidth - puzzle.clientWidth;
            height = img.height + puzzle.offsetHeight - puzzle.clientHeight;
        } else {
            width = $(puzzle).parent().innerWidth();
            height = (width * ROWS) / COLS;
        }

        var adjustedSize = responsiveSize(width, height, $(puzzle).parent().innerWidth());
        $(puzzle).outerHeight(adjustedSize[1]);
        $(sliding.squares).css({
            'background-size': puzzle.clientWidth + 'px ' + puzzle.clientHeight + 'px'
        });
        sliding.render();
    };

    $(window).resize(adjustSize);

    // Choice 1:
    $(sliding.squares).each(function () {
        var id = $(this).data('id');
        $(this).text(id + 1).css({'background-color': 'white',
                                  'text-align': 'center'});
    });

    $(puzzle).removeClass('hidden');
    adjustSize();

    // Choice 2:
    // loadImage('img/gavle.jpg');
});
