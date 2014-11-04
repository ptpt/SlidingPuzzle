expect = require('chai').expect
Sliding = require('./puzzle').Sliding

describe 'Sliding', ->
    it 'should initialize new instance', ->
        s = new Sliding(3, 4)
        expect(s.rows).to.equal(3)
        expect(s.cols).to.equal(4)
        expect(s.position).has.length(12)
        expect(s.grid).has.length(3)
        expect(s.grid[0]).has.length(4)

    it 'should throw error if input is invalid', ->
        expect(-> new Sliding(0, 0)).throw(RangeError)
        expect(-> new Sliding(1, 0)).throw(RangeError)
        expect(-> new Sliding(0, 1)).throw(RangeError)
        expect(-> new Sliding(null, 0)).throw(RangeError)
        expect(-> new Sliding()).throw(RangeError)
        expect(-> new Sliding(2, 2, [2, 2])).throw(RangeError)
        expect(-> new Sliding(2, 2, [2, null])).throw(RangeError)
        expect(-> new Sliding(1, 1, [0, 0])).to.not.throw(RangeError)

    it 'should set default empty square position correctly', ->
        s = new Sliding(3, 4)
        expect(s.emptyPos).to.be.deep.equal([2, 3])
        s = new Sliding(3, 4, [1, 2])
        expect(s.emptyPos).to.be.deep.equal([1, 2])

    it 'should set grid correctly', ->
        s = new Sliding(2, 2)
        expect(s.grid[0][0]).to.equal(1)
        expect(s.grid[0][1]).to.equal(2)
        expect(s.grid[1][0]).to.equal(3)
        expect(s.grid[1][1]).to.equal(0)

        s = new Sliding(2, 2, [0, 1])
        expect(s.grid[0][0]).to.equal(1)
        expect(s.grid[0][1]).to.equal(0)
        expect(s.grid[1][0]).to.equal(2)
        expect(s.grid[1][1]).to.equal(3)

    it 'should set position correctly', ->
        s = new Sliding(2, 2)
        expect(s.position[0]).to.deep.equal([1, 1])
        expect(s.position[1]).to.deep.equal([0, 0])
        expect(s.position[2]).to.deep.equal([0, 1])
        expect(s.position[3]).to.deep.equal([1, 0])
        expect(s.position).has.length(4)

        s = new Sliding(2, 2, [0, 1])
        expect(s.position[0]).to.deep.equal([0, 1])
        expect(s.position[1]).to.deep.equal([0, 0])
        expect(s.position[2]).to.deep.equal([1, 0])
        expect(s.position[3]).to.deep.equal([1, 1])
        expect(s.position).has.length(4)

        s = new Sliding(1, 1)
        expect(s.position[0]).to.deep.equal([0, 0])
        expect(s.position).has.length(1)

    it 'should be slidable', ->
        bs = new Sliding(2, 2)
        expect(bs.slidable([0, 0])).to.be.false
        expect(bs.slidable([0, 1])).to.be.true
        expect(bs.slidable([1, 0])).to.be.true
        expect(bs.slidable([1, 1])).to.be.false

        bs = new Sliding(2, 2, [0, 1])
        expect(bs.slidable([0, 0])).to.be.true
        expect(bs.slidable([0, 1])).to.be.false
        expect(bs.slidable([1, 0])).to.be.false
        expect(bs.slidable([1, 1])).to.be.true

    it 'should change something when you slide', ->
        s = new Sliding(2, 2)
        s.slide([1, 0])
        expect(s.emptyPos).to.be.deep.equal([1, 0])
        expect(s.slidable([0, 0])).to.be.true
        expect(s.slidable([0, 1])).to.be.false
        expect(s.slidable([1, 0])).to.be.false
        expect(s.slidable([1, 1])).to.be.true

        s = new Sliding(3, 3)
        s.slide([0, 2])
        s.slide([2, 2])
        s.slide([2, 0])
        expect(s.emptyPos).to.be.deep.equal([2, 0])
        expect(s.slidable([0, 0])).to.be.true
        expect(s.slidable([0, 1])).to.be.false
        expect(s.slidable([0, 2])).to.be.false
        expect(s.slidable([1, 0])).to.be.true
        expect(s.slidable([1, 1])).to.be.false
        expect(s.slidable([1, 2])).to.be.false
        expect(s.slidable([2, 0])).to.be.false
        expect(s.slidable([2, 1])).to.be.true
        expect(s.slidable([2, 2])).to.be.true
