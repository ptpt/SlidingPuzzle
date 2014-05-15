$(function () {
    var MAX_ROW = 20, MAX_COL = 20;

    var game = $('#puzzle').puzzle({image: 'url(img/gavle.jpg)',
                                    spacing: 4,
                                    rows: 4,
                                    cols: 4});

    click = function () {
        this.steps();
    }

    timer = {
        startTime: null,

        endTime: null,

        start: function () {
            this.startTime = new Date();
            return this.startTime;
        },

        end: function () {
            this.endTime = new Date();
            return this.endTime;
        },

        reset: function () {
            this.startTime = null;
            this.endTime = null;
        },

        totalSeconds: function () {
            endTime = this.endTime || new Date();
            if (this.startTime) {
                return Math.floor((endTime - this.startTime)/1000);
            } else {
                return 0;
            }
        }
    };

    complete = function () {
        timer.end();
        alert('Total time: ' + timer.totalSeconds() + ' seconds\n'
              + 'Steps: ' + $('#steps').text());
        game.unbind('click', click);
        game.div.css({'background-color': '#222',
                      'border-color': '#222'});
    }

    game.bind('shuffle', function () {
        timer.start();
        game.unbind('complete', complete).one('complete', complete);
        game.unbind('click', click).bind('click', click);
        game.div.css({'background-color': 'black',
                      'border-color': 'black'});
        $('#steps').text(0);

    }).bind('step', function () {
        $('#steps').text(parseInt($('#steps').text()) + 1);

    }).shuffle();

    $('#shuffle').click(function () {
        game.shuffle();
    });

    $('#background').click(function () {
        if (game.image === 'url(img/gavle.jpg)') {
            $('#puzzle').width(720).height(480);
            game.render({image: 'url(img/lake.jpg)', spacing: 2});
        } else {
            $('#puzzle').width(800).height(600);
            game.render({image: 'url(img/gavle.jpg)', spacing: 4});
        }


    });

    $('#rows-inc').click(function () {
        if (game.rows < MAX_ROW) {
            game.render({rows: game.rows + 1});
            game.shuffle();
        }
    });

    $('#rows-dec').click(function () {
        if (game.rows > 2) {
            game.render({rows: game.rows - 1});
            game.shuffle();
        }
    });

    $('#cols-inc').click(function () {
        if (game.cols < MAX_COL) {
            game.render({cols: game.cols + 1});
            game.shuffle();
        }
    });

    $('#cols-dec').click(function () {
        if (game.cols > 2) {
            game.render({cols: game.cols - 1});
            game.shuffle();
        }
    });
});
