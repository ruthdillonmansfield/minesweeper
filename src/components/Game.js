import React, { Component } from 'react';
import Grid from './Grid';
const {check, generator} = require('../logic/minesweeper')

export class Game extends Component {
    constructor (props) {
        super(props);
        this.state = {
            grid: []
        };
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
                />
            </div>
        );
    }
}

export default Game;

