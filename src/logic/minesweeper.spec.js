const expect = require('chai').expect;
const {minesweeper, generator, getMineCoordinates, getBorders} = require('./minesweeper')

describe('generator', () => {
    it('is a function', () => {
        expect(generator).to.be.a('function');
    });
    it('returns an array', () => {
        expect(generator()).to.eql([]);
    });
    it('returns an array as wide as specified', () => {
        expect(generator(5, 1)[0].length).to.equal(5);
        expect(generator(17, 4)[0].length).to.equal(17);
    });
    it('returns an array as high as specified', () => {
        expect(generator(1, 5).length).to.equal(5);
        expect(generator(1, 17).length).to.equal(17);
    });
    it('contains mines', () => {
        expect(generator(1, 1, 1)[0][0].mine).to.equal(true);
        expect(generator(1, 1, 0)[0][0].mine).to.equal(false);
    });
});

describe('getMineCoordinates', () => {
    it('is a function', () => {
        expect(getMineCoordinates).to.be.a('function');
    });
    it('returns an array', () => {
        expect(getMineCoordinates()).to.eql([]);
    });
    it('returns number of mines specified', () => {
        expect(getMineCoordinates(2, 2, 1).length).to.equal(1);
        expect(getMineCoordinates(5, 5, 3).length).to.equal(3);
        expect(getMineCoordinates(8, 10, 3).length).to.equal(3);
        expect(getMineCoordinates(5, 5, 10).length).to.equal(10);
    });
    it('never duplicates mines', () => {
        const res = getMineCoordinates(2, 2, 4);
        const first = res[0][0].toString() + res[0][1].toString();
        const second = res[1][0].toString() + res[1][1].toString();
        const third = res[2][0].toString() + res[2][1].toString();
        const fourth = res[3][0].toString() + res[3][1].toString();
        expect(first).to.not.equal(second);
        expect(first).to.not.equal(third);
        expect(first).to.not.equal(fourth);
        expect(second).to.not.equal(third);
        expect(second).to.not.equal(fourth);
        expect(third).to.not.equal(fourth);
        const res2 = getMineCoordinates(2, 2, 4);
        const first2 = res[0][0].toString() + res[0][1].toString();
        const second2 = res[1][0].toString() + res[1][1].toString();
        const third2 = res[2][0].toString() + res[2][1].toString();
        const fourth2 = res[3][0].toString() + res[3][1].toString();
        expect(first2).to.not.equal(second2);
        expect(first2).to.not.equal(third2);
        expect(first2).to.not.equal(fourth2);
        expect(second2).to.not.equal(third2);
        expect(second2).to.not.equal(fourth2);
        expect(third2).to.not.equal(fourth2);
    });
});

describe('getBorders', () => {
    it('is a function', () => {
        expect(getBorders).to.be.a('function');
    });
    it('returns an array when given one', () => {
        expect(getBorders([])).to.eql([]);
    });
    it('increments bordering mines horizontally', () => {
        const board = [
            [
                {
                    mine: true,
                    flag: false,
                    bordering: 0
                },
                {
                    mine: false,
                    flag: false,
                    bordering: 0
                }
            ]
        ]
        expect(getBorders(board)[0][1].bordering).to.equal(1);
    });
    it('increments bordering mines vertically', () => {
        const board = [
            [
                {
                    mine: true,
                    flag: false,
                    bordering: 0
                }
            ],
            [
                {
                    mine: false,
                    flag: false,
                    bordering: 0
                }
            ]
        ]
        expect(getBorders(board)[1][0].bordering).to.equal(1);
    });
    it('works on complex grids', () => {
        const board = [
            [
                {
                    mine: false,
                    flag: false,
                    bordering: 0
                },
                {
                    mine: false,
                    flag: false,
                    bordering: 0
                },
                {
                    mine: false,
                    flag: false,
                    bordering: 0
                }
            ],
            [
                {
                    mine: true,
                    flag: false,
                    bordering: 0
                },
                {
                    mine: false,
                    flag: false,
                    bordering: 0
                },
                {
                    mine: false,
                    flag: false,
                    bordering: 0
                }
            ]
        ]
        const res = getBorders(board)
        expect(res[0][0].bordering).to.equal(1);
        expect(res[1][0].bordering).to.equal(0);
        expect(res[0][1].bordering).to.equal(1);
    });
    it('copes with multiple mines', () => {
        const board = [
            [
                {
                    mine: true,
                    flag: false,
                    bordering: 0
                },
                {
                    mine: true,
                    flag: false,
                    bordering: 0
                },
                {
                    mine: false,
                    flag: false,
                    bordering: 0
                }
            ],
            [
                {
                    mine: false,
                    flag: false,
                    bordering: 0
                },
                {
                    mine: false,
                    flag: false,
                    bordering: 0
                },
                {
                    mine: false,
                    flag: false,
                    bordering: 0
                }
            ],
            [
                {
                    mine: true,
                    flag: false,
                    bordering: 0
                },
                {
                    mine: true,
                    flag: false,
                    bordering: 0
                },
                {
                    mine: false,
                    flag: false,
                    bordering: 0
                }
            ]
        ]
        const res = getBorders(board);
        expect(res[0][1].bordering).to.equal(1);
        expect(res[1][0].bordering).to.equal(4);
        expect(res[1][1].bordering).to.equal(4);
        expect(res[2][0].bordering).to.equal(1);
        expect(res[2][2].bordering).to.equal(1);
    });
});

// describe('minesweeper', () => {
//     it('is a function', () => {
//         expect(minesweeper).to.be.a('function');
//     });
//     it('returns an array', () => {
//         expect(minesweeper()).to.equal([]);
//     });
//     it('returns an array when passed an array', () => {
//         expect(minesweeper([])).to.equal([]);
//     });
// });