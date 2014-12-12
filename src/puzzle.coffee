'use strict'

isArray = (obj) ->
    toString.call(obj) == '[object Array]'


toPos = (posid) ->
    if isArray(posid) then posid else @position[posid]


origin = (id, cols) ->
    [Math.floor(id / cols), id % cols]


class Sliding
    # Count inversions of a matrix.
    # It will be used to check if a situation is solvable.
    _countInversions: (matrix, start, end) ->
        start = if start? then start else 0
        end = if end? then end else matrix.length - 1
        if start > end
            return [0, []]
        else if start == end
            if isArray(matrix[start])
                # Go into the lower dimension
                return @_countInversions(matrix[start])
            else
                # Skip emptyID
                return if matrix[start] == @emptyID then [0, []] else [0, [matrix[start]]]

        # Split
        middle = Math.floor(start + (end - start) / 2)
        [leftCount, leftSortedArray] = @_countInversions(matrix, start, middle)
        [rightCount, rightSortedArray] = @_countInversions(matrix, middle+1, end)

        l = 0
        r = 0
        count = 0
        sortedArray = []

        # Start merging and counting
        while l < leftSortedArray.length and r < rightSortedArray.length
            if leftSortedArray[l] <= rightSortedArray[r]
                sortedArray.push(leftSortedArray[l])
                l += 1
            else
                sortedArray.push(rightSortedArray[r])
                count += leftSortedArray.length - l
                r += 1

        while l < leftSortedArray.length
            sortedArray.push(leftSortedArray[l])
            l += 1

        while r < rightSortedArray.length
            sortedArray.push(rightSortedArray[r])
            r += 1

        return [leftCount + count + rightCount, sortedArray]

    solvable = (inversions, rows, cols, emptyRow) ->
        # http://www.cs.bham.ac.uk/~mdr/teaching/modules04/java2/TilesSolvability.html
        # ( (grid width odd) && (#inversions even) )  ||
        # ( (grid width even) && ((blank on odd row from bottom) == (#inversions even)) )
        return ((cols % 2 != 0) and (inversions % 2 == 0)) or
            ((cols % 2 == 0) and ((rows - emptyRow + 1) % 2 != inversions % 2))

    constructor: (rows, cols, emptyPos) ->
        if not rows >= 1
            throw RangeError('require at least 1 row')
        if not cols >= 1
            throw RangeError('require at least 1 col')

        emptyPos = [
            if emptyPos and emptyPos[0]? then emptyPos[0] else rows - 1
            if emptyPos and emptyPos[1]? then emptyPos[1] else cols - 1
        ]

        if not (0 <= emptyPos[0] < rows)
            throw RangeError('invalid empty row')
        if not (0 <= emptyPos[1] < cols)
            throw RangeError('invalid empty col')

        @rows = rows
        @cols = cols
        @grid = []
        @position = []

        id = 0
        for row in [0 .. rows-1]
            @grid[row] = []
            for col in [0 .. cols-1]
                @grid[row][col] = id
                @position[id] = [row, col]
                @emptyID = id if row == emptyPos[0] and col == emptyPos[1]
                id += 1

        @incompletions = 0

        return @

    solvable: ->
        [emptyRow, _] = @position[@emptyID]
        [inversions, _] = @_countInversions(@grid)
        return solvable(inversions, @rows, @cols, emptyRow + 1)

    completed: ->
        return @incompletions == 0

    shuffle: (handler) ->
        # Fisher-Yates shuffle
        # http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
        for lastID in [@rows * @cols - 1 .. 0]
            if lastID == @emptyID
                continue
            randID = Math.floor(Math.random() * (lastID + 1))
            if randID == @emptyID
                randID += 1
            handler?.call(@, lastID, randID)
            @swap(lastID, randID)

        # Swapping arbitrary 2 squares always changes the odd-even
        # status of the number of inversions.
        if not @solvable()
            console.assert(@rows * @cols > 2, "impossible to be unsolvable for #{@rows}x#{@cols} grid")
            if @emptyID == 0
                handler?.call(@, 1, 2)
                @swap(1, 2)
            else if @emptyID == 1
                handler?.call(@, 0, 2)
                @swap(0, 2)
            else
                handler?.call(@, 0, 1)
                @swap(0, 1)

        return @

    swap: (p1, p2) ->
        if p1 == p2
            return @
        [y1, x1] = toPos.call(@, p1)
        [y2, x2] = toPos.call(@, p2)
        if x1 == x2 and y1 == y2
            return @

        id1 = @grid[y1][x1]
        id2 = @grid[y2][x2]
        @grid[y1][x1] = id2
        @grid[y2][x2] = id1
        @position[id1] = [y2, x2]
        @position[id2] = [y1, x1]

        [oy, ox] = origin(id1, @cols)
        @incompletions += 1 if oy == y1 and ox == x1
        @incompletions -= 1 if oy == y2 and ox == x2

        [oy, ox] = origin(id2, @cols)
        @incompletions += 1 if oy == y2 and ox == x2
        @incompletions -= 1 if oy == y1 and ox == x1

        return @

    slide: (posid, handler) ->
        if not @slidable(posid)
            return @
        [row, col] = toPos.call(@, posid)
        [emptyRow, emptyCol] = @position[@emptyID]
        if row == emptyRow
            startCol = emptyCol + (if emptyCol > col then -1 else 1)
            for c in [startCol .. col]
                handler?.call(@, @grid[row][c], @emptyID)
                @swap([row, c], @emptyID)
        else if col == emptyCol
            startRow = emptyRow + (if emptyRow > row then -1 else 1)
            for r in [startRow .. row]
                handler?.call(@, @grid[r][col], @emptyID)
                @swap([r, col], @emptyID)
        return @

    slidable: (posid) ->
        [row, col] = toPos.call(@, posid)
        [emptyRow, emptyCol] = @position[@emptyID]
        return (0 <= row < @rows and 0 <= col < @cols) and
            not (row == emptyRow and col == emptyCol) and
            (row == emptyRow or col == emptyCol)

    mapPos: (f) ->
        results = []
        for row in [0 .. @rows - 1]
            for col in [0 .. @cols - 1]
                if @grid[row][col] != @emptyID
                    results.push f.call(@, [row, col])
        return results

    mapID: (f) ->
        results = []
        for id in [0 .. @rows * @cols - 1]
            if id != @emptyID
                results.push f.call(@, id)
        return results


class SimpleSliding
    base = Sliding

    createSquare = (id) ->
        square = document.createElement('div')
        square.setAttribute('data-id', id)
        square.style.position = 'absolute';
        return square

    constructor:  ->
        base.apply(@, arguments)

    SimpleSliding.prototype = Object.create(base.prototype)
    SimpleSliding.prototype.constructor = SimpleSliding

    _getWidth: (col) ->
        return if col < @colResidual then @sqWidth + 1 else @sqWidth

    _getHeight: (row) ->
        return if row < @rowResidual then @sqHeight + 1 else @sqHeight

    _getLeft: (col) ->
        baseLeft = col * (@sqWidth + @spacing)
        residual = if col < @colResidual then col else @colResidual
        return baseLeft + residual

    _getTop: (row) ->
        baseTop = row * (@sqHeight + @spacing)
        residual = if row < @rowResidual then row else @rowResidual
        return baseTop + residual

    _getBackgroundX: (origCol, col) ->
        x = -1 * @_getLeft(origCol)
        x += 1 if origCol == @cols - 1 and col < @colResidual
        return x

    _getBackgroundY: (origRow, row) ->
        y = -1 * @_getTop(origRow)
        y += 1 if origRow == @rows - 1 and row < @rowResidual
        return y

    _putSquare: (id, posid) ->
        posid = if posid? then posid else id
        [row, col] = toPos.call(@, posid)
        style = @squares[id].style
        style.left = @_getLeft(col) + 'px'
        style.top = @_getTop(row) + 'px'
        style.width = @_getWidth(col) + 'px'
        style.height = @_getHeight(row) + 'px'
        [originRow, originCol] = origin(id, @cols)
        style.backgroundPosition = "#{ @_getBackgroundX(originCol, col) }px #{ @_getBackgroundY(originRow, row) }px"

        return @

    render: (element, spacing) ->
        if element?
            board = document.createElement('div')
            board.style.position = 'relative';
            board.style.width = '100%';
            board.style.height = '100%';
            element.appendChild(board)
            @board = board
            @element = element

        @spacing = spacing if spacing?
        @spacing = 0 if not @spacing?

        boardHeight = @board.clientHeight - @spacing * (@rows - 1)
        boardWidth = @board.clientWidth - @spacing * (@cols - 1)
        @sqWidth = Math.floor(boardWidth / @cols)
        @sqHeight = Math.floor(boardHeight / @rows)
        @colResidual = boardWidth % @cols
        @rowResidual = boardHeight % @rows

        @squares = @mapID(createSquare) if element?

        for id, square of @squares
            @board.appendChild(square) if element?
            @_putSquare(id)

        return @

    shuffle: ->
        return base.prototype.shuffle.call(@, (src, tar) =>
            @_putSquare(src, tar)
            @_putSquare(tar, src))

    slide: (posid) ->
        return base.prototype.slide.call(@, posid, (src, tar) =>
            console.assert(tar == @emptyID, 'expect target to be empty square')
            @_putSquare(src, tar))


if module? and module.exports?
    module.exports = {
        Sliding: Sliding
        SimpleSliding: SimpleSliding
    }


if window?
    window.Sliding = Sliding
    window.SimpleSliding = SimpleSliding
