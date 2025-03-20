const generator = (width, height, mines) => {
    const w = Number(width) ? Number(width) : 10;
    const h = Number(height) ? Number(height) : 10;
    const m = Number(mines) ? Number(mines) : (w * h) * 0.1;
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
                revealed: false,
                deducedValue: null,
                knowable: false
            });
        }
    });
    return getBorders(getMineCoordinates(w, h, m).reduce((acc, el) => {
        grid[el[1]][el[0]].mine = true;
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


const check = (grid, click) => {
    if (!grid.length) return grid;
    let currentCell = grid[click[0]][click[1]];
    if (currentCell.mine) {
        return {
            grid: grid.map((row, i) => {
                return row.map((el, v) => {
                    el.revealed = true;
                    return el;
                })
            }),
            result: 'lose'
        }
    }
    if (grid[click[0]][click[1]].bordering) {
        grid[click[0]][[click[1]]].revealed = true;
    }
    return {
        grid: sweep(grid, click),
        result: 'continue'
    };
}


const sweep = (grid, click) => {
    if (grid[click[0]][click[1]].mine || grid[click[0]][click[1]].bordering) {
        return grid;
    }
    if (!grid[click[0]][[click[1]]].mine) {
        grid[click[0]][[click[1]]].revealed = true;
    }

    // Row above

    if (click[0] > 0) {

        // Top Centre is bordering but not revealed
        if (grid[click[0]-1][[click[1]]].bordering && !grid[click[0]-1][[click[1]]].revealed) {
            // Reveal it
            grid[click[0]-1][[click[1]]].revealed = true;
        } else if (!grid[click[0]-1][[click[1]]].bordering && !grid[click[0]-1][[click[1]]].revealed) {
            // If it's nor bordering and not revealed, recurse it
            grid = sweep(grid, [click[0]-1, click[1]])
        }
        // Top Left is bordering but not revealed
        if (click[1] > 0 && !grid[click[0]-1][[click[1]]].mine && !grid[click[0]][[click[1] - 1]].mine) {
            if (grid[click[0]-1][[click[1]-1]].bordering && !grid[click[0]-1][[click[1] - 1]].revealed) {
                // Reveal it
                grid[click[0]-1][[click[1]-1]].revealed = true;
            } else if (!grid[click[0]-1][[click[1]-1]].bordering && !grid[click[0]-1][[click[1]]].revealed) {
                // If it's nor bordering and not revealed, recurse it
                grid = sweep(grid, [click[0]-1, click[1]-1])
            }
        }

        // Top Right is bordering but not revealed
        if (click[1] < grid[click[0]].length - 1 && !grid[click[0]-1][[click[1]]].mine && !grid[click[0]][[click[1] + 1]].mine) {
            if (grid[click[0]-1][[click[1]+1]].bordering && !grid[click[0]-1][[click[1]+1]].revealed) {
                // Reveal it
                grid[click[0]-1][[click[1]+1]].revealed = true;
            } else if (!grid[click[0]-1][[click[1]+1]].bordering && !grid[click[0]-1][[click[1]+1]].revealed) {
                // If it's nor bordering and not revealed, recurse it
                grid = sweep(grid, [click[0]-1, click[1]+1])
            }
        }
    }

    // Left
    
    if (click[1] > 0) {
        if (grid[click[0]][[click[1]-1]].bordering && !grid[click[0]][[click[1]-1]].revealed) {
            // Reveal it
            grid[click[0]][[click[1]-1]].revealed = true;
        } else if (!grid[click[0]][[click[1]-1]].bordering && !grid[click[0]][[click[1]-1]].revealed) {
            // If it's nor bordering and not revealed, recurse it
            grid = sweep(grid, [click[0], click[1]-1])
        }
    }

    // Right
    
    if (click[1] < grid[click[0]].length - 1) {
        if (grid[click[0]][[click[1]+1]].bordering && !grid[click[0]][[click[1]+1]].revealed) {
            // Reveal it
            grid[click[0]][[click[1]+1]].revealed = true;
        } else if (!grid[click[0]][[click[1]+1]].bordering && !grid[click[0]][[click[1]+1]].revealed) {
            // If it's nor bordering and not revealed, recurse it
            grid = sweep(grid, [click[0], click[1]+1])
        }
    }

    // Row below
    if (click[0] < grid.length - 1) {
        // Bottom Centre is bordering but not revealed
        if (grid[click[0]+1][[click[1]]].bordering && !grid[click[0]+1][[click[1]]].revealed) {
            // Reveal it
            grid[click[0]+1][[click[1]]].revealed = true;
        } else if (!grid[click[0]+1][[click[1]]].bordering && !grid[click[0]+1][[click[1]]].revealed) {
            // If it's nor bordering and not revealed, recurse it
            grid = sweep(grid, [click[0]+1, click[1]])
        }

        // Bottom Left is bordering but not revealed
        if (click[1] > 0 && !grid[click[0]+1][[click[1]]].mine && !grid[click[0]][[click[1] - 1]].mine) {
            if (grid[click[0]+1][[click[1]-1]].bordering && !grid[click[0]+1][[click[1] - 1]].revealed) {
                // Reveal it
                grid[click[0]+1][[click[1]-1]].revealed = true;
            } else if (!grid[click[0]+1][[click[1]-1]].bordering && !grid[click[0]+1][[click[1]]].revealed) {
                // If it's nor bordering and not revealed, recurse it
                grid = sweep(grid, [click[0]+1, click[1]-1])
            }
        }

        // Bottom Right is bordering but not revealed
        if (click[1] < grid[click[0]].length - 1 && !grid[click[0]+1][[click[1]]].mine && !grid[click[0]][[click[1] + 1]].mine) {
            if (grid[click[0]+1][[click[1]+1]].bordering && !grid[click[0]+1][[click[1]+1]].revealed) {
                // Reveal it
                grid[click[0]+1][[click[1]+1]].revealed = true;
            } else if (!grid[click[0]+1][[click[1]+1]].bordering && !grid[click[0]+1][[click[1]+1]].revealed) {
                // If it's nor bordering and not revealed, recurse it
                grid = sweep(grid, [click[0]+1, click[1]+1])
            }
        }

    }

    return grid
}

// for when mine is moved
function recalcNumbers(grid) {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        if (!grid[i][j].mine) {
          let count = 0;
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              if (di === 0 && dj === 0) continue;
              let ni = i + di, nj = j + dj;
              if (ni >= 0 && ni < grid.length && nj >= 0 && nj < grid[0].length) {
                if (grid[ni][nj].mine) count++;
              }
            }
          }
          grid[i][j].bordering = count;
        }
      }
    }
    return grid;
  }
  

  function moveMine(grid, click) {
    let [row, col] = click;    
    let emptyCells = [];
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (
          !grid[i][j].mine &&
          !grid[i][j].revealed &&
          grid[i][j].deducedValue === null &&
          (i !== row || j !== col)
        ) {
          emptyCells.push([i, j]);
        }
      }
    }
    
    if (emptyCells.length > 0) {
      let [newRow, newCol] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

      grid[newRow][newCol].mine = true;
      grid[row][col].mine = false;
      grid[row][col].removedMine = true;
      recalcNumbers(grid);
      return grid;
    } else {
        return {
            grid: grid,
            fail: true
        }
    }
    
  }


module.exports = {
    moveMine,
    recalcNumbers,
    check, 
    generator, 
    getMineCoordinates, 
    getBorders
}