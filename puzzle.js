var SlidingPuzzle = (function () {
    var countInversions = function (array) {
        var orderArray = [];
        function _countInversions (first, last) {
            var middle, count, i, j, k, c;
            if (first >= last-1) {
                return 0;
            }
            middle = Math.floor(first + (last-first)/2);
            count = _countInversions(first, middle) + _countInversions(middle, last);
            i = first;
            j = middle;
            k = first;
            c = 0;
            while (i<middle && j<last) {
                if (array[i]>array[j]) {
                    orderArray[k] = array[j];
                    j += 1;
                    c += 1;
                } else {
                    orderArray[k] = array[i];
                    count += c;
                    i += 1;
                }
                k += 1;
            }
            for (;i<middle; i++) {
                orderArray[k] = array[i];
                k += 1;
                count += c;
            }
            for (;j<last; j++) {
                orderArray[k] = array[j];
                k += 1;
            }
            // copy back
            for (i=first; i<last; i++) {
                array[i] = orderArray[i];
            }
            return count;
        }
        return _countInversions(0, array.length);
    },
    SlidingPuzzle = function (div, options) {
        // private members
        var _spare = {},
        _gameTop, _gameLeft,
        _squares = [],
        _squareAt = [],
        _game = this,
        _$gameDiv = $('#'+div),
        _incompletes = 0,
        _cols, _rows,
        _image, _backgroundImage,
        _isOriginalShown = false,
        _isNumbersShown = true,
        _colSpacing, _rowSpacing,
        _sqWidth, _sqHeight,
        _getTop = function (y) {
            return _topOffset + y*(_sqHeight +_rowSpacing)
                - _sqHeight + (y<=_yResidual?y-1:_yResidual);
        },
        _getLeft = function (x) {
            return _leftOffset + x*(_sqWidth+_colSpacing)
                - _sqWidth + (x<=_xResidual?x-1:_xResidual);
        },
        _getWidth = function (x) {
            return _sqWidth + (x<=_xResidual?1:0);
        },
        _getHeight = function (y) {
            return _sqHeight + (y<=_yResidual?1:0);
        },
        init = function () {
            var x, y, id, sq, k, topBorderWidth, topBorderLeft;
            if (_$gameDiv.length===0) {
                throw {message:'No such div "'+div+'"'};
            }
            options = options || {};
            _cols = options.cols || 4;
            if (_cols<2) {
                throw {message:'At least 2 columns are required'};
            }
            _rows = options.rows || 4;
            if (_rows<2) {
                throw {message:'At least 2 rows are required'};
            }
            _spare = {x:_cols, y:_rows};
            _image = options.image || '';
            _colSpacing = typeof options.colSpacing === 'number' &&
                isFinite(options.colSpacing)? options.colSpacing: 0;
            _rowSpacing = typeof options.rowSpacing === 'number' &&
                isFinite(options.rowSpacing)? options.rowSpacing: 0;
            _xResidual = (_$gameDiv.width() - (_cols+1)*_colSpacing) % _cols;
            _yResidual = (_$gameDiv.height() - (_rows+1)*_rowSpacing) % _rows;
            _sqWidth = parseInt((_$gameDiv.width() - (_cols+1)*_colSpacing)/_cols);
            _sqHeight = parseInt((_$gameDiv.height() - (_rows+1)*_rowSpacing)/_rows);
            _backgroundImage = _$gameDiv.css('background-image');
            _gameTop = _$gameDiv.offset().top;
            _gameLeft = _$gameDiv.offset().left;
            topBorderWidth = parseInt(_$gameDiv.css('border-top-width'));
            topBorderWidth = isNaN(topBorderWidth)? 0: topBorderWidth;
            _topOffset = (_$gameDiv.css('position')==='static'? _gameTop: 0) + topBorderWidth;
            topBorderLeft = parseInt(_$gameDiv.css('border-left-width'));
            topBorderLeft = isNaN(topBorderLeft)? 0: topBorderLeft;
            _leftOffset = (_$gameDiv.css('position')==='static'? _gameLeft: 0) + topBorderLeft;

            id = 0;
            for (y=1; y<=_rows; y++) {
                _squareAt[y] = [];
                for (x=1; x<=_cols; x++) {
                    id += 1;
                    _squareAt[y][x] = [];
                    if (!(_spare.y===y && _spare.x===x)) {
                        sq = new _game.Square(x, y, id);
                        _squares.push(sq);
                        _squareAt[y][x].push(sq);
                    }
                }
            }
            $(window).scroll(function () {_game.resize('scroll');});
            $(window).resize(function () {_game.resize('resize');});
        };
        // public members
        this.CLASS_NAME = 'SlidingPuzzle';
        this.bindings = {};
        this.resize = function (name) {
            var offset = _$gameDiv.offset(),
            topChanged = (offset.top!==_gameTop),
            leftChanged = (offset.left!==_gameLeft),
            getProperty;
            if (topChanged || leftChanged || true) {
                _gameTop = offset.top;
                _gameLeft = offset.left;
                getProperty = function (sq) {
                    var property= {};
                    if (leftChanged) {
                        property.left = _getLeft(sq.x());
                    }
                    if (topChanged) {
                        property.top = _getTop(sq.y());
                    }
                    return property;
                };
                _squares.map(function (sq) {
                    sq.div().css(getProperty(sq));
                });
            }
        };
        this.div = function () {
            return _$gameDiv;
        };
        this.cols = function () {
            return _cols;
        };
        this.rows = function () {
            return _rows;
        };
        this.squares = function (id) {
            var squares;
            if (id) {
                return _squares[id];
            } else {
                for (var i in _squares) {
                    squares[i] = _squares[i];
                }
                return squares;
            }
        };
        this.squareAt = function (x,y) {
            return _squareAt[y][x];
        };
        this.getSpare = function () {
            return {x:_spare.x,
                    y:_spare.y};
        };
        this.Square = function (x, y, id) {
            var _square = this,
            _$squareDiv, _$numberDiv,
            _originalX = x, _originalY = y,
            _squareX = x, _squareY = y,
            _isNumberShown = true;

            var init = function () {
                _$gameDiv.append('<div><span>'+ id +'</span></div>');
                _$squareDiv = _$gameDiv.children().filter(':last');
                _$squareDiv.css({'position': 'absolute',
                                 'width': _getWidth(x),
                                 'height': _getHeight(y),
                                 'left': _getLeft(x),
                                 'top': _getTop(y),
                                 'background-image': _image,
                                 'background-position-x': -1*_getLeft(x)+_leftOffset,
                                 'background-position-y': -1*_getTop(y)+_topOffset});
                _$numberDiv = _$squareDiv.children().filter(':first');
                _$numberDiv.css({'font-size': '1px',
                                 'margin': '10px'});
            };

            this.CLASS_NAME = 'SlidingPuzzle.Square';
            this.div = function () {
                return _$squareDiv;
            };
            this.id = function () {
                return id;
            };
            this.x = function () {
                return _squareX;
            };
            this.y = function () {
                return _squareY;
            };
            this.movable = function () {
                var movable = false;
                if (_spare.x===_squareX) {
                    if (_spare.y===_squareY-1 || _squareY===_spare.y-1) {
                        movable = true;
                    }
                } else if (_spare.y===_squareY) {
                    if (_spare.x===_squareX-1 || _squareX===_spare.x-1) {
                        movable = true;
                    }
                }
                return movable;
            };
            this.move = function (x, y, overlap, duration, complete) {
                var index, square, property={};
                overlap = overlap===undefined? false:overlap;
                if (x===_squareX && y===_squareY) {
                    if (complete) {
                        complete.apply(_square);
                    }
                    return this;
                } else {
                    if (x!==_squareX) {
                        property.left = _getLeft(x);
                    }
                    if (y!==_squareY) {
                        property.top = _getTop(y);
                    }
                    if (y<=_yResidual !== _squareY<=_yResidual) {
                        property.height = _getHeight(y);
                    }
                    if (x<=_xResidual !== _squareX<=_xResidual) {
                        property.width = _getWidth(x);
                    }
                }
                index = _squareAt[_squareY][_squareX].indexOf(this);
                square = _squareAt[_squareY][_squareX].splice(index,1)[0];
                if (!overlap) {
                    if (_game.isSpare(x, y)) {
                        _spare.x = _squareX;
                        _spare.y = _squareY;
                    } else if (_squareAt[y][x].length>0) {
                        _squareAt[y][x][0].move(_squareX, _squareY, true);
                    }
                }
                _squareAt[y][x].push(square);

                if (x === _originalX && y===_originalY) {
                    _incompletes--;
                } else if (this.atOrigin()) {
                    _incompletes++;
                }
                _squareX = x;
                _squareY = y;
                _$squareDiv.animate(property, duration, function () {
                    if (complete) {
                        complete.apply(_square);
                    }
                });
                return this;
            };
            this.step = function (duration, complete) {
                if (this.movable()) {
                    this.move(_spare.x, _spare.y, false, duration, complete);
                }
            };
            this.steps = function (duration, complete) {
                var x, y, span, done=0,
                move = function () {
                    _squareAt[y][x][0].move(_spare.x, _spare.y, false, duration,
                                            complete?
                                            function () {
                                                if (++done===span) {
                                                    complete.apply(_square);
                                                }
                                            }:undefined);
                };
                if (_spare.x===_squareX) {
                    x = _squareX;
                    if (_spare.y>_squareY) {
                        span = _spare.y-_squareY;
                        for (y=_spare.y-1; y>=_squareY; y--) {
                            move();
                        }
                    } else {
                        span = _squareY-_spare.y;
                        for (y=_spare.y+1; y<=_squareY; y++) {
                            move();
                        }
                    }
                } else if (_spare.y===_squareY) {
                    y = _squareY;
                    if (_spare.x>_squareX) {
                        span = _spare.x-_squareX;
                        for (x=_spare.x-1; x>=_squareX; x--) {
                            move();
                        }
                    } else {
                        span = _squareX-_spare.x;
                        for (x=_spare.x+1; x<=_squareX; x++) {
                            move();
                        }
                    }
                }
            };
            this.reset = function (){
                this.move(_originalX, _originalY);
            };
            this.atOrigin = function () {
                return _squareX===_originalX && _squareY===_originalY;
            };
            this.isNumberShown = function () {
                return _isNumberShown;
            };
            this.toggleNumber = function (duration) {
                if (_isNumberShown) {
                    this.hideNumber(duration);
                } else {
                    this.showNumber(duration);
                }
            };
            this.showNumber = function (duration) {
                if (!_isNumberShown) {
                    _$numberDiv.fadeIn(duration);
                    _isNumberShown = true;
                }
                return this;
            };
            this.hideNumber = function (duration) {
                if (_isNumberShown) {
                    _$numberDiv.fadeOut(duration);
                    _isNumberShown = false;
                }
                return this;
            };
            this.bind = function (e, f) {
                var that = this;
                var helper = function () {
                    f.apply(that);
                };
                _$squareDiv.bind(e, helper);
            };
            init();
        };
        this.shuffle = function (duration, complete) {
            var random = [], index,
            done = 0,
            movements = _squares.length,
            move = function (square) {
                square.move(x, y, true, duration, function () {
                    if (++done===movements) {
                        if (!_game.solvable()) {
                            _squares[0].move(_squares[1].x(),
                                             _squares[1].y(),
                                             false,
                                             duration,
                                             complete);
                        } else {
                            complete.apply(_game);
                        }
                    }
                });
            };
            _spare.x = _cols;
            _spare.y = _rows;
            _squares.map (function (sq) {random.push(sq);});
            for (y=1; y<=_rows; y++) {
                for (x=1; x<=_cols; x++) {
                    if (!_game.isSpare(x, y)) {
                        index = Math.floor(Math.random()*random.length);
                        move(random.splice(index,1)[0]);
                    }
                }
            }
        };
        this.isComplete = function () {
            return _incompletes===0;
        };
        this.resetSquares = function () {
            _squares.map(function (sq) {
                sq.reset();
            });
        };
        this.isOriginalShown = function () {
            return _isOriginalShown;
        };
        this.showSquares = function (duration) {
            if (_isOriginalShown) {
                _squares.map(function (sq) {
                    sq.div().fadeIn(duration);
                });
                _$gameDiv.css('background-image', _backgroundImage);
                _isOriginalShown = false;
            }
            return this;
        };
        this.showOriginal = function (duration) {
            if (!_isOriginalShown) {
                _squares.map(function (sq) {
                    sq.div().hide(duration);
                });
                _$gameDiv.css('background-image', _image);
                _isOriginalShown = true;
            }
            return this;
        };
        this.toggleOriginalShown = function (duration) {
            if (_isOriginalShown) {
                this.showSquares(duration);
            } else {
                this.showOriginal(duration);
            }
        };
        this.showNumbers = function (duration) {
            if (!_isNumbersShown) {
                _isNumbersShown = true;
                _squares.map(function (sq) {
                    sq.showNumber(duration);
                });
            }
        };
        this.hideNumbers = function (duration) {
            if (_isNumbersShown) {
                _isNumbersShown = false;
                _squares.map(function (sq) {
                    sq.hideNumber(duration);
                });
            }
        };
        this.toggleNumbers = function () {
            if (_isNumbersShown) {
                this.hideNumbers();
            } else {
                this.showNumbers();
            }
        };
        this.reset = function () {
            this.resetSquares();
        };
        this.isSpare = function (x, y) {
            return x===_spare.x && y===_spare.y;
        };
        this.bindSquares = function (e, f) {
            _squares.map(function (sq) {sq.bind(e, f);});
        };
        this.solvable = function () {
            var x,y;
            var row, array = [];
            var inversions;
            for (y=1; y<=_rows; y++) {
                for (x=1; x<=_cols; x++) {
                    if (_game.isSpare(x, y)) {
                        row = _rows - y + 1;
                    } else {
                        if (_squareAt[y][x].length===1) {
                            array.push(_squareAt[y][x][0].id());
                        } else {
                            return false;
                        }
                    }
                }
            }
            inversions = countInversions(array);
            // ( (grid width odd) && (#inversions even) )  ||
            // ( (grid width even) && ((blank on odd row from bottom) == (#inversions even)) )
            if (((_cols%2 !== 0) && (inversions%2 === 0)) ||
                ((_cols%2===0) && (row%2!==inversions%2))) {
                return true;
            } else {
                return false;
            }
        };
        init();
    };
    return SlidingPuzzle;
})();