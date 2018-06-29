import React, { Component } from 'react';
import Grid from './Grid';
const {check, generator} = require('../logic/minesweeper')

export class Game extends Component {
    constructor (props) {
        super(props);
        this.state = {
            grid: []
        };
        this.sweep = this.sweep.bind(this)
    }
    componentDidMount () {
        this.setState({
            grid: generator(5, 5, 3)
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

