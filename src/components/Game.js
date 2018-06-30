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
                height: h,
                activeSize: size,
                custom: false
            })
            this.updateDifficulty(this.state.activeDifficulty)
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
            newMines = Math.ceil(this.state.width * this.state.height / 4.5)
        }
        if (difficulty === 'crazy') {
            newMines = Math.ceil(this.state.width * this.state.height / 2.5)
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
}

export default Game;

