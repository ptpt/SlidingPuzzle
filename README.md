## Sliding Puzzle

A [sliding puzzle](http://en.wikipedia.org/wiki/Sliding_puzzle) game
written in CoffeeScript. It uses jQuery and provides its functionality
as a jQuery plugin.

View [Demo](http://ptpt.github.com/SlidingPuzzle/).

## How to use

**1**. Copy `puzzle.js` to your site folder.

**2**. Add a `div` element to your HTML file. For example:

````html
    <div id="puzzle">puzzle shows here</div>
````

**3**. Include jQuery and `puzzle.js` in your HTML file.

````html
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <script type="text/javascript" src="puzzle.js"></script>
````

**4**. Choose a nice picture as the background image, then initialize the
   game.

````javascript
    var game = $('#puzzle').puzzle({image: 'url(PATH/TO/YOUR/IMG)'});
````

**5**. Let the game know how to move, and how to react when you win.

````javascript
    game.bind('click', function () {
        this.steps();
    }).bind('complete', function () {
        alert('Well done!');
    }).shuffle();
````

## API

````coffeescript
    class Square(id, puzzle, row, col)
        redraw()
        movable()
        swap(row, col, callback)
        step(callback)
        steps(callback)
        bind(event, handler, one=false)
        unbind(event, handler)
        trigger(event)
        one(event, handler)
        reset(callback)

    class Puzzle(div, options={})
        rebuild()
        render(options={})
        solvable()
        shuffle(callback)
        eachSquare(callback)
        mapSquare(callback)
        complete()
        empty(row, col)
        bind(event, handler, one=false)
        unbind(event, handler)
        one(event, handler)
        trigger(event)
        reset(callback)
````

## History

This was originally part of our
[final project](http://gavleslidingpuzzle.appspot.com/) of the
Software Development course in 2011.

In March 2013, it was rewritten in CoffeeScript.

## License

puzzle.js is under the MIT License. See LICENSE file for full license
text.
