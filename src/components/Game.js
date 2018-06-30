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
            setup: true
        };
        this.sweep = this.sweep.bind(this)
        this.play = this.play.bind(this)
        this.updateSize = this.updateSize.bind(this)
        this.updateDifficulty = this.updateDifficulty.bind(this)
        this.custom = this.custom.bind(this)
    }
    render() {
        console.log('rendering', this.state.mines);
        let content = (
            <Setup 
                play={this.play}
                updateSize={this.updateSize}
                updateDifficulty={this.updateDifficulty}
                custom={this.custom}
            />
        )
        if (!this.state.setup) {
            content = (
                <Grid 
                    grid={this.state.grid}
                    sweep={this.sweep}
                    status={this.state.status}
                />
            )
        }
        return (
            <div>
                {content}
            </div>
        );
    }
    sweep (grid, click, mine) {
        const updatedGrid = check(grid, click);
        this.setState({
            grid: updatedGrid,
            status: mine ? 'lost' : 'playing'
        })
    }
    play () {
        console.log(this.state);
        this.setState({
            grid: generator(this.state.width, this.state.height, this.state.mines),
            setup: false
        })
    }
    updateSize (w, h, size) {
        if (w && h) {
            this.setState({
                width: w,
                height: h
            })
            this.updateDifficulty(this.state.difficulty)
        }
        w = w < 4 ? 4 : w;
        h = h < 4 ? 4 : h;
    }
    updateDifficulty (difficulty) {
        let newMines = 7
        if (difficulty === 'easy') {
            newMines = Math.ceil(this.state.width * this.state.height / 9)
        }
        if (difficulty === 'normal') {
            newMines = Math.ceil(this.state.width * this.state.height / 7)
        }
        if (difficulty === 'hard') {
            newMines = Math.ceil(this.state.width * this.state.height / 6)
        }
        if (difficulty === 'crazy') {
            newMines = Math.ceil(this.state.width * this.state.height / 4)
        }
        this.setState({
            mines: newMines
        })
    }
    custom () {
        console.log('updating');
        this.setState({
            // setup: false
        })
    }
}

export default Game;

