import React, { Component } from 'react';
import Grid from './Grid';

export class Game extends Component {
    constructor (props) {
        super(props);
        this.state = {
            grid: []
        };
    }
    componentDidMount () {
        
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

