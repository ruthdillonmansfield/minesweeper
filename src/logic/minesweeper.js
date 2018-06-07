const generator = (w, h, mines) => {
    let grid = [];
    for (let i = 0; i < h; i++) {
        grid.push([])
    }
    grid.forEach(row => {
        for (let i = 0; i < w; i++) {
            row.push({
                mine: false,
                flag: false,
                bordering: 0,
                revealed: false
            });
        }
    });
    return getBorders(getMineCoordinates(w, h, mines).reduce((acc, el, i) => {
        grid[el[0]][el[1]].mine = true;
        return grid;
    }, grid));
}

const getMineCoordinates = (w, h, mines) => {
    let result = [];
    while (result.length < mines) {
        let x = Math.floor(Math.random() * w);
        let y = Math.floor(Math.random() * h);
        let preexists = false;
        if (result.length) {
            for (let i = 0; i < result.length; i++) {
                if (result[i][0] === x && result[i][1] === y) {
                    preexists = true;
                }
            }
        } 
        if (!preexists) {
            result.push([x, y]);
        }
    } 
    return result;
}

const getBorders = (grid) => {
    return grid.map((row, i) => {
        return row.map((el, v) => {
            if (i > 0) {
                if (grid[i - 1][v].mine) el.bordering++
                if (v > 0) {
                    if (grid[i - 1][v - 1].mine) el.bordering++
                }
                if (v < row.length - 1) {
                    if (grid[i - 1][v + 1].mine) el.bordering++
                }
            }
            if (v > 0) {
                if (grid[i][v - 1].mine) el.bordering++
            }
            if (v < row.length - 1) {
                if (grid[i][v + 1].mine) el.bordering++
            }
            if (i < grid.length -1) {
                if (grid[i + 1][v].mine) el.bordering++
                if (v > 0) {
                    if (grid[i + 1][v - 1].mine) el.bordering++
                }
                if (v < row.length - 1) {
                    if (grid[i + 1][v + 1].mine) el.bordering++
                }
            }
            return el;           
        });
    });
}


const sweep = (grid, click) => {
    if (!grid.length) return grid;
    let currentCell = grid[click[0]][click[1]];
    if (currentCell.mine) {
        return grid.map((row, i) => {
            return row.map((el, v) => {
                el.revealed = true;
                return el;
            })
        })
    }
    grid[click[0]][[click[1]]].revealed = true;
    if (grid[click[0]][[click[1]]].bordering === 0) {
        if (click[0] > 0 && !grid[click[0] - 1][click[1]].revealed && !grid[click[0] - 1][click[1]].bordering) {
            grid = sweep(grid, [click[0] - 1, click[1]]);
            if (click[1] > 0) {
                if (!grid[click[0] - 1][click[1] - 1].revealed && !grid[click[0] - 1][click[1] - 1].bordering) {
                    grid = sweep(grid, [click[0] - 1, click[1] - 1]);
                }
            } 
            if (click[1] + 1 < grid[1].length) {
                if (!grid[click[0] - 1][click[1] + 1].revealed && !grid[click[0] - 1][click[1] + 1 ].bordering) {
                    grid = sweep(grid, [click[0] - 1, click[1] + 1])
                }
            } 
        } 
        if (click[1] > 0 && !grid[click[0]][click[1] - 1].revealed && !grid[click[0]][click[1] - 1].bordering) {
            if (grid[click[0]][click[1] - 1])  grid = sweep(grid, [click[0], click[1] - 1]);
        }
        if (click[1] < grid[click[0]].length - 1 && !grid[click[0]][click[1] + 1].revealed && !grid[click[0]][click[1] + 1].bordering) {
            grid = sweep(grid, [click[0], click[1] + 1]);
        }
        if (click[0] < grid.length - 1 && !grid[click[0] + 1][click[1]].revealed && !grid[click[0] + 1][click[1]].bordering) {
            grid = sweep(grid, [click[0] + 1, click[1]]);
            if (click[1] > 0) {
                if (!grid[click[0] + 1][click[1] - 1].revealed && !grid[click[0] + 1][click[1] - 1].bordering) {
                    grid = sweep(grid, [click[0] + 1, click[1] - 1]);
                }
            } 
            if (click[1] + 1 < grid[1].length) {
                if (!grid[click[0] + 1][click[1] + 1].revealed && !grid[click[0] + 1][click[1] + 1].bordering) {
                    grid = sweep(grid, [click[0] + 1, click[1] + 1])
                }
            } 
        }
    }
    return grid
}


module.exports = {
    sweep, 
    generator, 
    getMineCoordinates, 
    getBorders
}