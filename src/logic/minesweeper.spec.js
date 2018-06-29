const expect = require('chai').expect;
const {sweep, generator, getMineCoordinates, getBorders} = require('./minesweeper')

describe('generator', () => {
    it('is a function', () => {
        expect(generator).to.be.a('function');
    });
    it('returns an array', () => {
        expect(generator()).to.eql([]);
    });
    it('the grid is as wide as the user specifies', () => {
        expect(generator(5, 1)[0].length).to.equal(5);
        expect(generator(17, 4)[0].length).to.equal(17);
    });
    it('the grid is as tall as the user specifies', () => {
        expect(generator(1, 5).length).to.equal(5);
        expect(generator(1, 17).length).to.equal(17);
    });
    it('generates mines...', () => {
        expect(generator(1, 1, 1)[0][0].mine).to.equal(true);
    });
    it('...unless we don\'t ask for any!', () => {
        expect(generator(1, 1, 0)[0][0].mine).to.equal(false);
    });
    it('the cells have all the properties they need', () => {
        expect(generator(1, 1, 1)[0][0]).to.haveOwnProperty('mine');
        expect(generator(1, 1, 1)[0][0]).to.haveOwnProperty('flag');
        expect(generator(1, 1, 1)[0][0]).to.haveOwnProperty('bordering');
        expect(generator(1, 1, 1)[0][0]).to.haveOwnProperty('revealed');
    });
});

describe('getMineCoordinates', () => {
    it('is a function', () => {
        expect(getMineCoordinates).to.be.a('function');
    });
    it('returns an array', () => {
        expect(getMineCoordinates()).to.eql([]);
    });
    it('creates the number of mines specified by the user', () => {
        expect(getMineCoordinates(2, 2, 1).length).to.equal(1);
        expect(getMineCoordinates(5, 5, 3).length).to.equal(3);
        expect(getMineCoordinates(8, 10, 3).length).to.equal(3);
        expect(getMineCoordinates(5, 5, 10).length).to.equal(10);
    });
    it('the mines are arrays', () => {
        expect(Array.isArray(getMineCoordinates(1, 1, 1)[0])).to.equal(true);
    });
    it('the mines have 2 coordinates', () => {
        expect(getMineCoordinates(1, 1, 1)[0].length).to.equal(2);
    });
    it('never duplicates mine coordinates', () => {
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
                    bordering: 0
                },
                {
                    mine: false,
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
                    bordering: 0
                }
            ],
            [
                {
                    mine: false,
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
                    bordering: 0
                },
                {
                    mine: false,
                    bordering: 0
                },
                {
                    mine: false,
                    bordering: 0
                }
            ],
            [
                {
                    mine: true,
                    bordering: 0
                },
                {
                    mine: false,
                    bordering: 0
                },
                {
                    mine: false,
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
                    bordering: 0
                },
                {
                    mine: true,
                    bordering: 0
                },
                {
                    mine: false,
                    bordering: 0
                }
            ],
            [
                {
                    mine: false,
                    bordering: 0
                },
                {
                    mine: false,
                    bordering: 0
                },
                {
                    mine: false,
                    bordering: 0
                }
            ],
            [
                {
                    mine: true,
                    bordering: 0
                },
                {
                    mine: true,
                    bordering: 0
                },
                {
                    mine: false,
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

describe('sweep', () => {
    it('is a function', () => {
        expect(sweep).to.be.a('function');
    });
    it('returns an array', () => {
        expect(sweep([])).to.eql([]);
    });
    it('reveals whole grid if it is a mine', () => {
        const board = [
            [
                {
                    mine: true,
                    revealed: false
                },
                {
                    mine: false,
                    revealed: false
                },
                {
                    mine: false,
                    revealed: false
                }
            ]
        ]
        expect(sweep(board, [0, 0])[0][0].revealed).to.equal(true);
    });
    it('reveals the clicked node', () => {
        const board = [
            [
                {
                    mine: true,
                    revealed: false
                },
                {
                    mine: false,
                    revealed: false
                },
                {
                    mine: false,
                    revealed: false
                }
            ]
        ]
        expect(sweep(board, [0, 2])[0][2].revealed).to.equal(true);
    });
    it('reveals the whole grid horizontally if there are no mines', () => {
        const board = [
            [
                {
                    mine: false,
                    bordering: 0,
                    revealed: false
                },
                {
                    mine: false,
                    bordering: 0,
                    revealed: false
                },
                {
                    mine: false,
                    bordering: 0,
                    revealed: false
                }
            ]
        ]
        const res = sweep(board, [0, 0])
        expect(res[0][0].revealed).to.equal(true);
        expect(res[0][1].revealed).to.equal(true);
        expect(res[0][2].revealed).to.equal(true);
    });
    it('reveals the whole grid vertically if there are no mines', () => {
        const board = [
            [
                {
                    mine: false,
                    bordering: 0,
                    revealed: false
                }
            ],
            [
                {
                    mine: false,
                    bordering: 0,
                    revealed: false
                }
            ],
            [
                {
                    mine: false,
                    bordering: 0,
                    revealed: false
                }
            ]
        ]
        const res = sweep(board, [0, 0])
        expect(res[0][0].revealed).to.equal(true);
        expect(res[1][0].revealed).to.equal(true);
        expect(res[2][0].revealed).to.equal(true);
    });
    it('reveals the whole grid in 3 dimensions if there are no mines', () => {
        const board = [
            [
                {
                    mine: false,
                    bordering: 0,
                    revealed: false
                },
                {
                    mine: false,
                    bordering: 0,
                    revealed: false
                }
            ],
            [
                {
                    mine: false,
                    bordering: 0,
                    revealed: false
                },
                {
                    mine: false,
                    bordering: 0,
                    revealed: false
                }
            ],
            [
                {
                    mine: false,
                    bordering: 0,
                    revealed: false
                },
                {
                    mine: false,
                    bordering: 0,
                    revealed: false
                }
            ]
        ]
        const res = sweep(board, [0, 0])
        expect(res[0][0].revealed).to.equal(true);
        expect(res[1][0].revealed).to.equal(true);
        expect(res[2][0].revealed).to.equal(true);
        expect(res[0][1].revealed).to.equal(true);
        expect(res[1][1].revealed).to.equal(true);
        expect(res[2][1].revealed).to.equal(true);
    });
    it('recursively reveals multiple cells where a clump are all empty', () => {
        const board = [
            [
                {
                    mine: true,
                    bordering: 0,
                    revealed: false
                },
                {
                    mine: false,
                    bordering: 1,
                    revealed: false
                }
            ],
            [
                {
                    mine: false,
                    bordering: 1,
                    revealed: false
                },
                {
                    mine: false,
                    bordering: 0,
                    revealed: false
                }
            ],
            [
                {
                    mine: false,
                    bordering: 0,
                    revealed: false
                },
                {
                    mine: false,
                    bordering: 0,
                    revealed: false
                }
            ]
        ]
        const res = sweep(board, [2, 0])
        expect(res[0][0].revealed).to.equal(false);
        expect(res[1][0].revealed).to.equal(true);
        expect(res[2][0].revealed).to.equal(true);
        expect(res[0][1].revealed).to.equal(true);
        expect(res[1][1].revealed).to.equal(true);
        expect(res[2][1].revealed).to.equal(true);
    });
    it('reveals multiple cells over large, complicated areas', () => {
        const board = [
            [
                {
                    mine: false,
                    bordering: 0,
                    revealed: false
                },
                {
                    mine: false,
                    bordering: 1,
                    revealed: false
                },
                {
                    mine: true,
                    bordering: 0,
                    revealed: false
                }
            ],
            [
                {
                    mine: false,
                    bordering: 0,
                    revealed: false
                },
                {
                    mine: false,
                    bordering: 1,
                    revealed: false
                },
                {
                    mine: false,
                    bordering: 1,
                    revealed: false
                }
            ],
            [
                {
                    mine: false,
                    bordering: 0,
                    revealed: false
                },
                {
                    mine: false,
                    bordering: 0,
                    revealed: false
                },
                {
                    mine: false,
                    bordering: 0,
                    revealed: false
                }
            ],
            [
                {
                    mine: false,
                    bordering: 0,
                    revealed: false
                },
                {
                    mine: false,
                    bordering: 0,
                    revealed: false
                },
                {
                    mine: false,
                    bordering: 0,
                    revealed: false
                }
            ]
        ]
        const res = sweep(board, [1, 0])
        expect(res[0][0].revealed).to.equal(true);
        expect(res[1][0].revealed).to.equal(true);
        expect(res[2][0].revealed).to.equal(true);
        expect(res[3][0].revealed).to.equal(true);
        expect(res[0][1].revealed).to.equal(true);
        expect(res[1][1].revealed).to.equal(true);
    });
    it('Reveals the border numbers for adjacent mines', () => {
        const board = [
            [
                {
                    mine: false,
                    bordering: 0,
                    revealed: false
                },
                {
                    mine: false,
                    bordering: 1,
                    revealed: false
                },
                {
                    mine: true,
                    bordering: 0,
                    revealed: false
                }
            ],
            [
                {
                    mine: false,
                    bordering: 0,
                    revealed: false
                },
                {
                    mine: false,
                    bordering: 1,
                    revealed: false
                },
                {
                    mine: false,
                    bordering: 1,
                    revealed: false
                }
            ]
        ]
        const res = sweep(board, [0, 0])
        expect(res[0][1].bordering).to.equal(1);
        expect(res[0][1].revealed).to.equal(true);
        expect(res[1][0].revealed).to.equal(false);
        // expect(res[1][2].revealed).to.equal(true);
        // expect(res[1][2].revealed).to.equal(1);
    });
});

