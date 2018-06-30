import React, { Component } from 'react';
import Grid from './Grid';
const {check, generator} = require('../logic/minesweeper')

export class Game extends Component {
    constructor (props) {
        super(props);
        this.state = {
            grid: [],
            width: 10,
            height: 10,
            mines: 5
        };
        this.sweep = this.sweep.bind(this)
    }
    componentDidMount () {
        this.setState({
            grid: generator(this.state.width, this.state.height, this.state.mines)
        })
    }
    render() {
        return (
            <div className="Game">
                <Grid 
                    grid={this.state.grid}
                    sweep={this.sweep}
                />
            </div>
        );
    }
    sweep (grid, click) {
        console.log(grid, click);
        const updatedGrid = check(grid, click);
        this.setState({
            grid: updatedGrid
        })
    }
}

export default Game;

