import React, { Component } from 'react';
import Grid from './Grid';
import Setup from './Setup';
const {check, generator} = require('../logic/minesweeper')

export class Game extends Component {
    constructor (props) {
        super(props);
        const isSmallScreen = window.innerWidth < 800;
        this.state = {
            grid: [],
            width: isSmallScreen ? 6 : 10,
            height: isSmallScreen ? 8 : 10,
            mines: isSmallScreen ? 8 : 12,
            status: 'playing',
            setup: true,
            custom: false,
            activeSize: isSmallScreen ? 'large' : 'medium',
            activeDifficulty: 'normal',
            instructions: false,
            remaining: isSmallScreen ? 8 : 12,
            firstClick: true
        };
        this.sweep = this.sweep.bind(this)
        this.play = this.play.bind(this)
        this.updateSize = this.updateSize.bind(this)
        this.updateDifficulty = this.updateDifficulty.bind(this)
        this.customise = this.customise.bind(this)
        this.updateWidth = this.updateWidth.bind(this)
        this.updateHeight = this.updateHeight.bind(this)
        this.updateMines = this.updateMines.bind(this)
        this.updateFlag = this.updateFlag.bind(this)
        this.reset = this.reset.bind(this)
        this.toggleInstructions = this.toggleInstructions.bind(this)
        this.moveMine = this.moveMine.bind(this)
        
    }
    render() {
        let content = (
            <Setup 
                play={this.play}
                width={this.state.width}
                height={this.state.height}
                mines={this.state.mines}
                updateSize={this.updateSize}
                updateDifficulty={this.updateDifficulty}
                customise={this.customise}
                custom={this.state.custom}
                activeSize={this.state.activeSize}
                activeDifficulty={this.state.activeDifficulty}
                updateHeight={this.updateHeight}
                updateWidth={this.updateWidth}
                updateMines={this.updateMines}
                toggleInstructions={this.toggleInstructions}
            />
        )
        if (!this.state.setup) {
            content = (
                <Grid 
                    grid={this.state.grid}
                    sweep={this.sweep}
                    status={this.state.status}
                    updateFlag={this.updateFlag}
                    reset={this.reset}
                    mines={this.state.mines}
                    play={this.play}
                    remaining={this.state.remaining}
                />
            )
        }
        if (this.state.instructions) {
            content = (
                <div className='instructions'>
                    <h2>HOW TO PLAY</h2>
                    <p><strong>Your goal</strong> is to reveal all safe cells without hitting a mine.</p>
                    <p><strong>Numbers</strong> tell you how many mines are <em>next to a cell</em> (even diagonally).</p>
                    <p><strong>Hit a mine?</strong> Game over! 💥</p>
                    <p><strong>Right-click (press and hold on mobile) to flag suspected mines</strong> and plan your moves.</p>
                    <p><strong>Clear all non-mine cells to win!</strong></p>

                    <div className='buttons'>
                        <div className='button-wide mt-50' onClick={this.toggleInstructions}>
                            <p>Got it!</p>
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div>
                {content}
            </div>
        );
    }
    sweep (grid, click, mine, flag) {
        if (flag || this.state.status !== "playing") {
            return;
        }
        let updatedGrid = [...grid];

        if (this.state.firstClick && mine) {
            updatedGrid = this.moveMine(updatedGrid, click); 
            mine = false; 
        }
    
        updatedGrid = check(updatedGrid, click);
        let countRemaining = 0;
        for (let i = 0; i < updatedGrid.grid.length; i++) {
            for (let j = 0; j < updatedGrid.grid[i].length; j++) {
                if (updatedGrid.grid[i][j].revealed && !updatedGrid.grid[i][j].mine) {
                    // console.log(i, j, 'true');
                    countRemaining++;
                } else {
                    // console.log(i, j);
                    // console.log(updatedGrid.grid[i][j]);
                }
            }
        }
        // console.log(countRemaining);
        const minesDetected = (this.state.width * this.state.height) - countRemaining;
        if (minesDetected === Number(this.state.mines) && updatedGrid.result === 'continue') {
            return this.setState({
                grid: updatedGrid.grid,
                status: 'won'
            })
        }
        this.setState({
            grid: updatedGrid.grid,
            status: mine ? 'lost' : 'playing',
            firstClick: false
        })
    }
    moveMine(grid, click) {
        let [row, col] = click;
        
        let emptyCells = [];
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                if (!grid[i][j].mine && (i !== row || j !== col)) {
                    emptyCells.push([i, j]);
                }
            }
        }

        if (emptyCells.length > 0) {
            let [newRow, newCol] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            grid[newRow][newCol].mine = true;
            grid[row][col].mine = false;
        }
    
        return grid;
    }
    
    play () {
        this.setState({
            grid: generator(this.state.width, this.state.height, this.state.mines),
            setup: false,
            remaining: this.state.mines,
            status: 'playing',
            firstClick: true
        })
    }
    updateSize (w, h, size) {
        let newMines = 7
        if (this.state.activeDifficulty === 'easy') {
            newMines = Math.ceil((w * h) / 10)
        }
        if (this.state.activeDifficulty === 'normal') {
            newMines = Math.ceil((w * h) / 6)
        }
        if (this.state.activeDifficulty === 'hard') {
            newMines = Math.ceil((w * h) / 4)
        }
        if (this.state.activeDifficulty === 'crazy') {
            newMines = Math.ceil((w * h) / 3)
        }
        this.setState({
            mines: newMines,
            width: w,
            height: h,
            remaining: newMines,
            activeSize: size,
            custom: false
        });
    }
    updateDifficulty (difficulty) {
        let newMines = 7
        if (difficulty === 'easy') {
            newMines = Math.ceil((this.state.width * this.state.height) / 10)
        }
        if (difficulty === 'normal') {
            newMines = Math.ceil((this.state.width * this.state.height) / 6)
        }
        if (difficulty === 'hard') {
            newMines = Math.ceil((this.state.width * this.state.height) / 4)
        }
        if (difficulty === 'crazy') {
            newMines = Math.ceil((this.state.width * this.state.height) / 3)
        }
        this.setState({
            mines: newMines,
            activeDifficulty: difficulty,
            custom: false
        })
    }
    customise (sizeOrDifficulty) {
        this.setState({
            custom: !this.state.custom,
            activeSize: 'custom',
            activeDifficulty: 'custom'
        });
    }
    updateWidth (e) {
        let newWidth = e.target.value;
        if (!/([\D])/.test(newWidth) && e.target.value < 41) {
            this.setState({
                width: newWidth
            });
        }
    }
    updateHeight (e) {
        let newHeight = e.target.value
        if (!/([\D])/.test(newHeight) && e.target.value < 41) {
            this.setState({
                height: newHeight
            });
        }
    }
    updateMines (e) {
        let newMines = e.target.value
        let max = Math.round((this.state.height * this.state.width) * 0.8) 
        if (!/([\D])/.test(newMines) && e.target.value < max) {
            this.setState({
                mines: newMines,
                remaining: newMines
            });
        }
    }
    updateFlag (w, h, e) {
        e.preventDefault();
        let newGrid = [...this.state.grid];
        const countFlags = newGrid.reduce((acc, el) => {
            return acc += el.reduce((count, v) => {
                if (v.flag) {
                    count++
                }
                return count;
            }, 0)
        }, 0)
        newGrid[w][h].flag = !newGrid[w][h].flag;
        this.setState({
            grid: newGrid,
            remaining: newGrid[w][h].flag ? this.state.mines - countFlags - 1 : this.state.mines - countFlags + 1
        })
    }
    reset () {
        this.setState({
            setup: true,
            remaining: this.state.mines,
            status: 'playing',
            firstClick: true
        })
    }
    toggleInstructions () {
        this.setState({
            instructions: !this.state.instructions
        })
    }
}

export default Game;

