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
                bordering: 0
            });
        }
    });
    grid = getMineCoordinates(w, h, mines).reduce((acc, el, i) => {
        grid[el[0]][el[1]].mine = true;
        return grid;
    }, grid)
    return grid;
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


const minesweeper = (grid, click) => {
    return grid;
}


module.exports = {
    minesweeper, generator, getMineCoordinates, getBorders
}