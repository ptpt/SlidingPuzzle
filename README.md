## Sliding Puzzle

A [sliding puzzle](http://en.wikipedia.org/wiki/Sliding_puzzle) game
written in CoffeeScript. View [Demo](http://ptpt.github.com/SlidingPuzzle/).

## How to use

1. Copy [puzzle.js](http://ptpt.github.com/SlidingPuzzle/js/puzzle.js) to your site folder.

2. HTML setup.

    Add a container element to your HTML file. For example:
    ````html
    <div id="puzzle" style="width: 100px; height: 100px">puzzle shows here</div>
    ````

    Include `puzzle.js` in your HTML file:
    ````html
    <script type="text/javascript" src="puzzle.js"></script>
    ````

3. Initialize the game.

    ````javascript
    var sliding = new SimpleSliding(3, 3),
        container = document.getElementbyid('puzzle');

    sliding.render(container, 2);
    sliding.shuffle();
    ````

4. Show the number on each square.
    ```javascript
    $(sliding.squares).each(function () {
        var id = $(this).data('id');
        $(this).text(id + 1);
    });
    ```

    Or specify the background image, which looks better than numbers:
    ```javascript
    $(sliding.squares).css({'background-image': 'url(PATH/TO/GAME-BACKGROUND.jpg)'});
    ```

5. Let the game know how to move, and how to react when you win.
    ````javascript
    $(sliding.squares).click(function () {
        var id = $(this).data('id');
        sliding.slide(id);
        if (sliding.completed()) {
            alert('Well done!');
            sliding.shuffle(); // Restart again
        }
    });
    ````

## API

```coffeescript
class SimpleSliding
    # initialize a game with the number of rows and cols
    constructor(rows, cols)

    # render the game on the element with specified spacing between squares
    render(element, spacing)

    # rerender the game on current element
    render()

    # test if current game state is solvable
    solvable()

    # test if current game state is completed
    completed()

    # test if the square is slidable (movable)
    slidable(squareID) or slidable([row, col])

    # shuffle all squares (solvability is guaranteed after shuffling)
    shuffle(callback)

    # slide a square
    slide(squareID) or slide([row, col])

    # swap arbitrary two squares (after swap you have to check solvability yourself)
    swap(squareID1, squareID2) or swap([row1, col1], [row2, col2])
```

## History

This was originally part of our
[final project](http://gavleslidingpuzzle.appspot.com/) of the
Software Development course in 2011.

In March 2013, it was rewritten in CoffeeScript.

In December 2014, it was rewritten with following improvements:

1. simplification: shorter code, easier usage
2. split game logic and UI logic
3. remove jQuery dependency

## License

puzzle.js is under the MIT License. See LICENSE file for full license
text.
