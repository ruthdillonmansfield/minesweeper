import React, { Component } from 'react';
import Grid from './Grid';
import Setup from './Setup';
const {check, generator} = require('../logic/minesweeper')

export class Game extends Component {
    constructor (props) {
        super(props);
        this.state = {
            grid: [],
            width: 10,
            height: 10,
            mines: 12,
            status: 'playing',
            setup: true,
            custom: false,
            activeSize: 'medium',
            activeDifficulty: 'normal'
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
                />
            )
        }
        return (
            <div>
                {content}
            </div>
        );
    }
    sweep (grid, click, mine, flag) {
        if (flag) {
            return;
        }
        const updatedGrid = check(grid, click);
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
        // const countRemaining = updatedGrid.grid.reduce((acc, el) => {
        //     return acc += el.reduce((count, v) => {
        //         if (v.revealed) {
        //             count++
        //         }
        //         return count;
        //     }, 0)
        // }, 0)
        const minesDetected = (this.state.width * this.state.height) - countRemaining;
        // console.log('there are mines detected: ', minesDetected);
        // console.log('and mines: ', this.state.mines);
        if (minesDetected === Number(this.state.mines) && updatedGrid.result === 'continue') {
            console.log('WON');
            return this.setState({
                grid: updatedGrid.grid,
                status: 'won'
            })
        }
        this.setState({
            grid: updatedGrid.grid,
            status: mine ? 'lost' : 'playing'
        })
    }
    play () {
        this.setState({
            grid: generator(this.state.width, this.state.height, this.state.mines),
            setup: false
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
        let newWidth = e.target.value
        if (!/([\D])/.test(newWidth)) {
            this.setState({
                width: newWidth
            });
        }
    }
    updateHeight (e) {
        let newHeight = e.target.value
        if (!/([\D])/.test(newHeight)) {
            this.setState({
                height: newHeight
            });
        }
    }
    updateMines (e) {
        let newMines = e.target.value
        if (!/([\D])/.test(newMines)) {
            this.setState({
                mines: newMines
            });
        }
    }
    updateFlag (w, h, e) {
        e.preventDefault();
        let newGrid = [...this.state.grid];
        newGrid[w][h].flag = !newGrid[w][h].flag;
        this.setState({
            grid: newGrid
        })
    }
    reset () {
        this.setState({
            setup: true,
            status: 'playing'
        })
    }
}

export default Game;

