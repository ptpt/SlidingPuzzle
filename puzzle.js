var SlidingPuzzle = function (div, width, height, options) {
    this.CLASS_NAME = 'SlidingPuzzle';
    this.div = $('#'+div);
    if (this.div.length===0) {
        throw new Error('No such div "'+div+'"');
    }
    this.width = width;
    if (this.width<=0) {
        throw new Error('Width must be greater than 0');
    }
    this.height = height;
    if (this.height<=0) {
        throw new Error('Height must be greater than 0');
    }
    if (typeof options === 'object') {
        this.spare = options.spare;
    }
    this.history = [];
    this.steps = 0;
    this.startTime = 0;
    this.totalTime = 0;
    
    this.Square = function (game, n, x, y) {
        this.CLASS_NAME = 'SlidingPuzzle.Square';
        this.game = game;
        this.n = n;
        this.x = x;
        this.y = y;
        this.init = function () {
            var div;
            this.game.div.append('<div class="square">'+ n +'</div>');
            div = this.div = this.game.div.children().filter(':last');
            div.css("position", "absolute");
            div.css("width", game.div.width()/game.width);
            div.css("height", game.div.height()/game.height);
            div.css("top", y*this.div.height());
            div.css("left", x*this.div.width());
            // var hello = this;
            // div.click(function () {
            //     console.log(div.text(),this.n);
            // });
            // console.log(div.css("top"), div.css("left"));
        };
        this.init();
        this.movable = function () {
            var movable;
            var spare = this.game.getSpare();
            if (spare.x===this.x && spare.y===this.y) {
                movable = false;
            } else if (spare.x===this.x || spare.y===this.y) {
                movable = true;
            } else {
                movable = false;
            }
            return movable;
        };
        this.goto = function (x, y) {
        };
        this.goHome = function (x, y) {
        };
        this.isOriginal = function () {
            return true || false;
        };
        this.isNumberShown = false;
        this.toggleNumber = function () {
            if (this.isNumberShown) {
                this.showNumber();
            } else {
                this.hideNumber();
            }
        };
        this.showNumber = function () {
        };
        this.hideHumber = function () {
        };
        this.bind = function (e, f) {
            var that = this;
            var helper = function () {
                f.apply(that);
            };
            this.div.bind(e, helper);
        };
    };
    this.shuffle = function () {
    };
    this.isComplete = function () {
        var i;
        var complete = true;
        for (i=0; i<this.squares.length; i++) {
            if (!this.squares[i].atOriginal()) {
                complete = false;
            }
        }
        return complete;
    };
    this.initSquares = function () {
        var x,y;              // coordinates
        var n;                // number
        var square;
        this.squares = [];
        this.squareAt = [];
        n = 0;
        for (y=0; y<this.height; y++) {
            this.squareAt[y] = [];
            for (x=0; x<this.width; x++) {
                if (this.spare===undefined) {
                }
                square = new this.Square(this, ++n, x, y);
                this.squares.push(square);
                this.squareAt[y][x] = square;
            }
        }
    };
    this.initSquares();
    this.squares.bind = function (e, f) {
        var i;
        for (i=0; i<this.length; i++) {
            this[i].bind(e, f);
        }
    }
    this.resetSquares = function () {
        var i;
        var square;
        for (i=0; i<this.squares.length; i++) {
            square = this.squares[i];
            this.squareAt[square.y][square.x] = null;
            square.gohome();
            this.squareAt[square.y][square.x] = square;
        }
    };
    this.reset = function () {
        this.history = null;
        this.steps = 0;
        this.startTime = 0;
        this.totalTime = 0;
        this.resetSquares();
    };
    this.move = function (square) {
        var x,y;
        var i;
        var spare;
        if (this.movable()) {
            spare = this.game.getSpare();
            if (spare.x===this.x) {
                for (i=0; i<this.y-spare.y; i++) {
                    if (this.y>spare.y) {
                        this.squareAt[spare.y+i][x].goto();
                    } else {
                        this.squareAt[spare.y-i][x].goto();
                    }
                }
            } else if (spare.y===this.y) {
                for (i=0; i<this.y-spare.y; i++) {
                    if (this.y>spare.y) {
                        this.squareAt[this.y][spare.x+i].goto();
                    } else {
                        this.squareAt[this.y][spare.x-i].goto();
                    }
                }
            }
        }
    };
    
    this.showOriginal = function () {
    };
    this.showNumbers = function () {
        var i;
        for (i=0; i<this.squares.length; i++) {
            this.squares[i].showNumber();
        }
    };
    this.hideNumbers = function () {
        var i;
        for (i=0; i<this.squares.length; i++) {
            this.squares[i].hideNumbers();
        }
    };
};

$(document).ready(function () {
    var game = new SlidingPuzzle('GavleSlidingPuzzle', 3, 3);
    game.squares.bind('click', function () {
        console.log(this.div.text());
    });
});