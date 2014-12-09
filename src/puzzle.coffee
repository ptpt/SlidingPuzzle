
isArray = (obj) ->
    toString.call(obj) == '[object Array]'


toPos = (posid) ->
    if isArray(posid) then posid else @position[posid]


origin = (id, cols) ->
    [Math.floor(id / cols), id % cols]


class Sliding
    # Count inversions of an array.
    # This will be used to check if a situation is solvable.
    countInversions = (array, emptyID, start, end) ->
        start = if start? then start else 0
        end = if end? then end else array.length - 1
        if start > end
            return [0, []]
        else if start == end
            if isArray(array[start])
                return countInversions(array[start], emptyID)
            else
                # skip emptyID
                return if array[start] == emptyID then [0, []] else [0, [array[start]]]

        # split
        middle = Math.floor(start + (end - start) / 2)
        [leftCount, leftSortedArray] = countInversions(array, emptyID, start, middle)
        [rightCount, rightSortedArray] = countInversions(array, emptyID, middle+1, end)

        l = 0
        r = 0
        count = 0
        sortedArray = []

        # start merging and counting
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
            throw RangeError('At least 1 row is required')
        if not cols >= 1
            throw RangeError('At least 1 col is required')

        emptyPos = [
            if emptyPos and emptyPos[0]? then emptyPos[0] else rows - 1
            if emptyPos and emptyPos[1]? then emptyPos[1] else cols - 1
        ]

        if not (0 <= emptyPos[0] < rows)
            throw RangeError('Invalid empty row')
        if not (0 <= emptyPos[1] < cols)
            throw RangeError('Invalid empty col')

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
        console.assert @emptyID?

        @incompletions = 0

        return @

    solvable: ->
        [erow, _] = @position[@emptyID]
        [inversions, _] = countInversions(@grid, @emptyID)
        return solvable(inversions, @rows, @cols, erow + 1)

    completed: ->
        return @incompletions == 0

    shuffle: (handler) ->
        for lastID in [@rows*@cols-1 .. 0]
            if lastID == @emptyID
                continue
            randID = Math.floor(Math.random() * (lastID + 1))
            if randID == @emptyID
                randID += 1
            console.assert randID <= lastID
            handler?.call(@, lastID, randID)
            @swap(lastID, randID)

        if not @solvable()
            console.assert @rows * @cols > 2, 'It is impossible to be unsolvable'
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
        [erow, ecol] = @position[@emptyID]
        if row == erow
            handler?.call(@, @grid[row][c], @emptyID)
            @swap([row, c], @emptyID) for c in [ecol..col]
        else if col == ecol
            handler?.call(@, @grid[r][col], @emptyID)
            @swap([r, col], @emptyID) for r in [erow..row]
        return @

    slidable: (posid) ->
        [row, col] = toPos.call(@, posid)
        [erow, ecol] = @position[@emptyID]
        return (0 <= row < @rows and 0 <= col < @cols) and
            not (row == erow and col == ecol) and
            (row == erow or col == ecol)


if typeof jQuery != 'undefined'
    # jQuery plugin
    do ($=jQuery) ->
        $.fn.puzzle = (options) ->
            puzzle = new Puzzle(this, options)


if module
    module.exports = {Sliding: Sliding}
