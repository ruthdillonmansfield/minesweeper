import React, { Component } from 'react';
import Game from './components/Game'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="center">Minesweeper</h1>
        </header>
        <div className='desktop'>
          <Game />
        </div>
        <div className='mobile'>
          <br /><br /><br /><br />
          <h5>Are you really trying to play Minesweeper on mobile?</h5>
        </div>
      </div>
    );
  }
}

export default App;
