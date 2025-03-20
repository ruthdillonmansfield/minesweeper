/**
 * Minesweeper hybrid solver using local logic and frontier enumeration
 * 1. Keep applying local logic:
 *    - If number of unknown neighbors equals mines needed, mark them as mines
 *    - If no mines are needed, mark them as safe
 * 2. Do a frontier enumeration pass to deduce more cells
 * 3. Repeat until no new deductions are made
 *
 * For each cell, set:
 * - cell.knowable: true if we can deduce its state, false otherwise
 * - cell.deducedValue: 1 if it's a mine, 0 if it's safe, null if ambiguous
 */
const computeKnowable = (grid) => {
  grid = grid.grid || grid

  // Reset
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      grid[r][c].knowable = false
      grid[r][c].deducedValue = null
    }
  }

  // Outer loop: keep applying deduction passes until no more changes or we hit the max iterations
  let changed = true
  let iterationCount = 0
  const MAX_ITERATIONS = 5 
  while (changed && iterationCount < MAX_ITERATIONS) {
    iterationCount++
    changed = false

    // Local deduction pass: apply local logic repeatedly until no more change or local cap reached
    let localChanged = true
    let localIterations = 0
    const MAX_LOCAL_ITERATIONS = 3 
    while (localChanged && localIterations < MAX_LOCAL_ITERATIONS) {
      localIterations++
      localChanged = localDeductionPass(grid)
      if (localChanged) {
        changed = true
      }
    }

    // Global (frontier) enumeration pass
    const globalChanged = globalEnumerationPass(grid)
    if (globalChanged) {
      changed = true
    }
  }

  // After deduction passes, ensure cells that weren't deduced remain ambiguous
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (typeof grid[r][c].deducedValue !== 'number') {
        grid[r][c].knowable = false
        grid[r][c].deducedValue = null
      }
    }
  }

  return grid
}

// Check each revealed clue cell and apply basic Minesweeper logic:
//- If number of unknown neighbors equals mines needed, mark them as mines
//- If no mines are needed, mark all unknown neighbors as safe
const localDeductionPass = (grid) => {
  let madeChanges = false

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      const cell = grid[r][c]
      if (cell.revealed && typeof cell.bordering === 'number') {
        const unknownCells = []
        let flaggedCount = 0
        let deducedMineCount = 0

        // Check all adjacent cells
        for (let i = r - 1; i <= r + 1; i++) {
          for (let j = c - 1; j <= c + 1; j++) {
            // Skip the center cell
            if (i === r && j === c) continue
            if (i >= 0 && i < grid.length && j >= 0 && j < grid[0].length) {
              const adj = grid[i][j]
              if (adj.flag) {
                flaggedCount++
              } else if (typeof adj.deducedValue === 'number') {
                if (adj.deducedValue === 1) {
                  deducedMineCount++
                }
              } else if (!adj.revealed) {
                unknownCells.push(adj)
              }
            }
          }
        }
        const remaining = cell.bordering - flaggedCount - deducedMineCount

        // If all unknown neighbors must be mines, mark them as mines
        if (remaining === unknownCells.length && remaining > 0) {
          unknownCells.forEach((uCell) => {
            if (typeof uCell.deducedValue !== 'number') {
              uCell.deducedValue = 1
              uCell.knowable = true
              madeChanges = true
            }
          })
        }
        // If no mines are needed, mark all unknown neighbors as safe
        else if (remaining === 0 && unknownCells.length > 0) {
          unknownCells.forEach((uCell) => {
            if (typeof uCell.deducedValue !== 'number') {
              uCell.deducedValue = 0
              uCell.knowable = true
              madeChanges = true
            }
          })
        }
      }
    }
  }

  return madeChanges
}

//over the "frontier" cells
//Collect constraints from revealed cells and try all assignments (within a limit) to see if any cells can be conclusively deduced

const globalEnumerationPass = (grid) => {
  const frontierMapping = {}
  const frontierCells = []
  const constraints = []

  // Helper function to get adjacent cell coordinates
  const getAdjacent = (r, c) => {
    const adj = []
    for (let i = r - 1; i <= r + 1; i++) {
      for (let j = c - 1; j <= c + 1; j++) {
        if (i === r && j === c) continue
        if (i >= 0 && i < grid.length && j >= 0 && j < grid[0].length) {
          adj.push([i, j])
        }
      }
    }
    return adj
  }

  // Build constraints from each revealed clue cell
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      const cell = grid[r][c]
      if (cell.revealed && typeof cell.bordering === 'number') {
        let flaggedCount = 0
        let deducedMineCount = 0
        const unknownIndices = []
        const adjCells = getAdjacent(r, c)

        // Analyse all adjacent cells
        for (let k = 0; k < adjCells.length; k++) {
          const [ar, ac] = adjCells[k]
          const adjCell = grid[ar][ac]
          if (adjCell.flag) {
            flaggedCount++
          } else if (typeof adjCell.deducedValue === 'number') {
            if (adjCell.deducedValue === 1) deducedMineCount++
          } else if (!adjCell.revealed) {
            const key = `${ar},${ac}`
            // Map the frontier cell if not already mapped
            if (!(key in frontierMapping)) {
              frontierMapping[key] = frontierCells.length
              frontierCells.push({ row: ar, col: ac })
            }
            unknownIndices.push(frontierMapping[key])
          }
        }
        const remaining = cell.bordering - flaggedCount - deducedMineCount
        if (unknownIndices.length > 0) {
          constraints.push({ cells: unknownIndices, total: remaining })
        }
      }
    }
  }

  // Skip enumeration if there's no frontier or it's too large
  const FRONTIER_THRESHOLD = 15
  if (frontierCells.length === 0 || frontierCells.length > FRONTIER_THRESHOLD) {
    return false
  }

  const n = frontierCells.length
  const validAssignments = []

  // Recursive function to try every possible assignment (0 = safe, 1 = mine) for frontier cells
  const backtrack = (assignment, index) => {
    if (index === n) {
      // Check if the assignment satisfies all constraints
      for (const constraint of constraints) {
        let sum = 0
        for (const cellIdx of constraint.cells) {
          sum += assignment[cellIdx]
        }
        if (sum !== constraint.total) {
          return
        }
      }
      validAssignments.push([...assignment])
      return
    }
    // Try marking the current frontier cell as safe
    assignment[index] = 0
    backtrack(assignment, index + 1)
    // Try marking the current frontier cell as a mine
    assignment[index] = 1
    backtrack(assignment, index + 1)
  }

  backtrack([], 0)

  if (validAssignments.length === 0) {
    return false
  }

  let changed = false
  // For each frontier cell, check if all valid assignments agree on its status
  for (const key in frontierMapping) {
    const idx = frontierMapping[key]
    const firstVal = validAssignments[0][idx]
    let allSame = true
    for (let i = 1; i < validAssignments.length; i++) {
      if (validAssignments[i][idx] !== firstVal) {
        allSame = false
        break
      }
    }
    // If all assignments agree, update the cell accordingly
    if (allSame) {
      const [row, col] = key.split(',').map((n) => parseInt(n, 10))
      const cellObj = grid[row][col]
      if (typeof cellObj.deducedValue !== 'number') {
        cellObj.deducedValue = firstVal
        cellObj.knowable = true
        changed = true
      }
    }
  }

  return changed
}

module.exports = computeKnowable
