var Puzzle = (function () {
    var countInversions = function (array) {
        var sortedArray = [];
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
                    sortedArray[k] = array[j];
                    j += 1;
                    c += 1;
                } else {
                    sortedArray[k] = array[i];
                    count += c;
                    i += 1;
                }
                k += 1;
            }
            for (;i<middle; i++) {
                sortedArray[k] = array[i];
                k += 1;
                count += c;
            }
            for (;j<last; j++) {
                sortedArray[k] = array[j];
                k += 1;
            }
            // copy back
            for (i=first; i<last; i++) {
                array[i] = sortedArray[i];
            }
            return count;
        }
        return _countInversions(0, array.length);
    },
    Puzzle = function ($container, options) {
        // private members
        var _thisPuzzle = this,
        _spare,
        _squares,_squareAt,
        _$container, _$carpet,
        _incompletes,
        _image,
        _sqWidth, _sqHeight,
        _xResidual, _yResidual,
        // default values
        _cols=4, _rows=4,
        _spacing=0,
        _bindings = {},
        // private methods
        _getTop = function (y) {
            return y*(_sqHeight +_spacing) - _spacing - _sqHeight + (y<=_yResidual?y-1:_yResidual);
        },
        _getLeft = function (x) {
            return x*(_sqWidth+_spacing) - _spacing - _sqWidth + (x<=_xResidual?x-1:_xResidual);
        },
        _getWidth = function (x) {
            return x<=_xResidual? _sqWidth+1 : _sqWidth;
        },
        _getHeight = function (y) {
            return y<=_yResidual? _sqHeight+1 : _sqHeight;
        };
        // public members
        _thisPuzzle.CLASS_NAME = 'Puzzle';
        _thisPuzzle.$ = function (selector) {
            if (arguments.length>0 && selector!==undefined) {
                _$container = $(selector);
                _thisPuzzle.redraw();
            }
            return _$container;
        };
        _thisPuzzle.cols = function (cols) {
            if (arguments.length>0 && cols!==undefined) {
                _thisPuzzle.setPuzzle({cols: cols});
            }
            return _cols;
        };
        _thisPuzzle.rows = function (rows) {
            if (arguments.length>0 && rows!==undefined) {
                _thisPuzzle.setPuzzle({rows: rows});
            }
            return _rows;
        };
        _thisPuzzle.image = function (image) {
            if (arguments.length>0 && image!==undefined) {
                _thisPuzzle.setPuzzle({image: image});
            }
            return _image;
        };
        _thisPuzzle.redraw = function () {
            _$carpet.height(_$container.height());
            _$carpet.width(_$container.width());
            _thisPuzzle.setPuzzle();
        };
        _thisPuzzle.setPuzzle = function () {
            var $container, spacing, image, cols, rows,
            render=false, buildSquares=false,
            xResidual, yResidual,
            sqWidth, sqHeight,
            x,y,e,sq,id=0;

            if (arguments.length===1) {
                options = arguments[0];
                $container = options.container || _$container;
            } else if (arguments.length>1) {
                $container = arguments[0];
                options = arguments[1];
            } else {
                $container = _$container;
            }
            if (!$container) {
                throw {message: 'container is missing'};
            }
            options = options || {};
            spacing = options.spacing===undefined? _spacing : options.spacing;
            if (!(spacing>=0)) {
                throw {message:'spacing must be non-negative integer'};
            }
            image = options.image===undefined? _image : options.image;
            if (!(image===undefined || typeof image === 'string')) {
                throw {message: 'image must be a string'};
            }
            cols = options.cols===undefined? _cols : options.cols;
            if (!(cols>1)) {
                throw {message:'at least 2 columns are required'};
            }
            rows = options.rows===undefined? _rows : options.rows;
            if (!(rows>1)) {
                throw {message:'at least 2 rows are required'};
            }
            if (spacing!==_spacing) {
                _spacing = spacing;
                render = true;
            }
            if (image!==_image) {
                _image = image;
                render = true;
            }
            if ($container!==_$container) {
                if (_$container) {
                    _$container.empty();
                }
                _$container = $container;
                _$container.append('<div style="position:relative; margin:0"></div>');
                _$carpet = _$container.children().filter(':last');
                _$carpet.height(_$container.height());
                _$carpet.width(_$container.width());
                buildSquares = true;
            }
            if (rows!==_rows || cols!==_cols) {
                _rows = rows;
                _cols = cols;
                buildSquares = true;
            }
            xResidual = (_$carpet.width() - (_cols-1)*_spacing) % _cols;
            yResidual = (_$carpet.height() - (_rows-1)*_spacing) % _rows;
            sqWidth = parseInt((_$carpet.width() - (_cols-1)*_spacing)/_cols, 10);
            sqHeight = parseInt((_$carpet.height() - (_rows-1)*_spacing)/_rows, 10);
            if (xResidual!==_xResidual || yResidual!==_yResidual ||
                sqWidth!==_sqWidth || sqHeight!==_sqHeight) {
                _xResidual = xResidual;
                _yResidual = yResidual;
                _sqWidth = sqWidth;
                _sqHeight = sqHeight;
                render = true;
            }
            if (buildSquares) {
                _spare = {x:_cols, y:_rows};
                _squares = [];
                _squareAt = [];
                _incompletes = 0;
                _$carpet.empty();

                for (y=1; y<=_rows; y++) {
                    _squareAt[y] = [];
                    for (x=1; x<=_cols; x++) {
                        id += 1;
                        _squareAt[y][x] = [];
                        if (!(_spare.y===y && _spare.x===x)) {
                            sq = new _thisPuzzle.Square(x, y, id);
                            _squares.push(sq);
                            _squareAt[y][x].push(sq);
                        }
                    }
                }
                if (_bindings) {
                    for (e in _bindings) {
                        _thisPuzzle.bindSquares(e, _bindings[e]);
                    }
                }
            }
            else if (render) {
                _squares.map(function (sq) {sq.render();});
            }
        };
        _thisPuzzle.squares = function (id) {
            if (id) {
                return _squares[id];
            } else {
                return _squares;
            }
        };
        _thisPuzzle.squareAt = function (x,y) {
            return _squareAt[y][x];
        };
        _thisPuzzle.getSpare = function () {
            return {x:_spare.x, y:_spare.y};
        };
        _thisPuzzle.Square = function (x, y, id) {
            var _thisSquare = this,
            _id = id,
            _$square,
            _ox = x, _oy = y,   // original coordinates
            _x = x, _y = y,     // current coordinates
            init = function () {
                _$carpet.append('<div></div>');
                _$square = _$carpet.children().filter(':last');
                _thisSquare.render();
            };
            _thisSquare.CLASS_NAME = 'Puzzle.Square';
            _thisSquare.render = function () {
                _$square.css({'position': 'absolute',
                              'width': _getWidth(_x),
                              'height': _getHeight(_y),
                              'left': _getLeft(_x),
                              'top': _getTop(_y),
                              'background-image': _image,
                              'background-position-x': -1*_getLeft(_ox),
                              'background-position-y': -1*_getTop(_oy)});
            };
            _thisSquare.$ = function () {
                return _$square;
            };
            _thisSquare.id = function () {
                return _id;
            };
            _thisSquare.x = function () {
                return _x;
            };
            _thisSquare.y = function () {
                return _y;
            };
            _thisSquare.ox = function () {
                return _ox;
            };
            _thisSquare.oy = function () {
                return _oy;
            };
            _thisSquare.movable = function () {
                var movable = false;
                if (_spare.x===_x) {
                    if (_spare.y===_y-1 || _y===_spare.y-1) {
                        movable = true;
                    }
                } else if (_spare.y===_y) {
                    if (_spare.x===_x-1 || _x===_spare.x-1) {
                        movable = true;
                    }
                }
                return movable;
            };
            _thisSquare.move = function (x, y, overlap, duration, complete) {
                var index, square, property={};
                overlap = overlap===undefined? false:overlap;
                if (x===_x && y===_y) {
                    if (complete) {
                        complete.apply(_thisSquare);
                    }
                    return _thisSquare;
                } else {
                    if (x!==_x) {
                        property.left = _getLeft(x);
                    }
                    if (y!==_y) {
                        property.top = _getTop(y);
                    }
                    if ((y<=_yResidual) !== (_y<=_yResidual)) {
                        property.height = _getHeight(y);
                    }
                    if ((x<=_xResidual) !== (_x<=_xResidual)) {
                        property.width = _getWidth(x);
                    }
                }
                index = _squareAt[_y][_x].indexOf(_thisSquare);
                square = _squareAt[_y][_x].splice(index,1)[0];
                if (!overlap) {
                    if (_thisPuzzle.isSpare(x, y)) {
                        _spare.x = _x;
                        _spare.y = _y;
                    } else if (_squareAt[y][x].length>0) {
                        _squareAt[y][x][0].move(_x, _y, true);
                    }
                }
                _squareAt[y][x].push(square);

                if (x === _ox && y===_oy) {
                    _incompletes--;
                } else if (_x===_ox && _y===_oy) {
                    _incompletes++;
                }
                _x = x;
                _y = y;
                _$square.animate(property, duration, function () {
                    if (complete) {
                        complete.apply(_thisSquare);
                    }
                });
                return _thisSquare;
            };
            _thisSquare.step = function (duration, complete) {
                if (_thisSquare.movable()) {
                    _thisSquare.move(_spare.x, _spare.y, false, duration, complete);
                }
            };
            _thisSquare.steps = function (duration, complete) {
                var x, y, span, done=0,
                move = function () {
                    _squareAt[y][x][0].move(_spare.x, _spare.y, false, duration,
                                            complete?
                                            function () {
                                                if (++done===span) {
                                                    complete.apply(_thisSquare);
                                                }
                                            }:undefined);
                };
                if (_spare.x===_x) {
                    x = _x;
                    if (_spare.y>_y) {
                        span = _spare.y-_y;
                        for (y=_spare.y-1; y>=_y; y--) {
                            move();
                        }
                    } else {
                        span = _y-_spare.y;
                        for (y=_spare.y+1; y<=_y; y++) {
                            move();
                        }
                    }
                } else if (_spare.y===_y) {
                    y = _y;
                    if (_spare.x>_x) {
                        span = _spare.x-_x;
                        for (x=_spare.x-1; x>=_x; x--) {
                            move();
                        }
                    } else {
                        span = _x-_spare.x;
                        for (x=_spare.x+1; x<=_x; x++) {
                            move();
                        }
                    }
                }
            };
            _thisSquare.bind = function (e, f) {
                _$square.bind(e, function () {
                    f.apply(_thisSquare);
                });
            };
            init();
        };
        _thisPuzzle.shuffle = function (duration, complete) {
            var x,y,random = [], index,
            done = 0,
            movements = _squares.length,
            callback = function () {
                if (++done===movements) {
                    if (!_thisPuzzle.solvable()) {
                        _squares[0].move(_squares[1].x(),
                                         _squares[1].y(),
                                         false,
                                         duration,
                                         complete);
                    } else {
                        complete.apply(_thisPuzzle);
                    }
                }
            };
            _spare.x = _cols;
            _spare.y = _rows;
            _squares.map (function (sq) {random.push(sq);});
            for (y=1; y<=_rows; y++) {
                for (x=1; x<=_cols; x++) {
                    if (!_thisPuzzle.isSpare(x, y)) {
                        index = Math.floor(Math.random()*random.length);
                        random.splice(index,1)[0].move(x, y, true, duration, callback);
                    }
                }
            }
        };
        _thisPuzzle.isComplete = function () {
            return _incompletes===0;
        };
        _thisPuzzle.isSpare = function (x, y) {
            return x===_spare.x && y===_spare.y;
        };
        _thisPuzzle.bindSquares = function (e, f) {
            if (_squares) {
                _squares.map(function (sq) {sq.bind(e, f);});
                _bindings[e] = f;
            }
        };
        _thisPuzzle.unbindSquares = function (e, f) {
            _squares.map(function (sq) {sq.unbind(e, f);});
            delete _bindings[e];
        };
        _thisPuzzle.solvable = function () {
            var x,y, row, array = [], inversions;
            for (y=1; y<=_rows; y++) {
                for (x=1; x<=_cols; x++) {
                    if (_thisPuzzle.isSpare(x, y)) {
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
        _thisPuzzle.reset = function () {
            _squares.map(function (sq) {
                sq.move(sq.ox(), sq.oy());
            });
        };
        _thisPuzzle.setPuzzle($container, options);
    };
    return Puzzle;
})();