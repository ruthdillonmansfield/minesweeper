import React, { Component } from 'react';
import Grid from './Grid';
import Setup from './Setup';
const { check, generator, moveMine, recalcNumbers } = require('../logic/minesweeper');
const computeKnowable = require('../logic/KnowableSolver');

export class Game extends Component {
  constructor(props) {
    super(props);
    const isSmallScreen = window.innerWidth < 800;
    const maxWidth = Math.round((window.innerWidth - 60) / 44 > 10 ? (window.innerWidth - 60) / 44 : 0);
    const maxHeight = Math.round((window.innerHeight - 80) / 44 > 10 ? (window.innerHeight - 80) / 44 : 0);
    this.state = {
      grid: [],
      width: isSmallScreen ? 6 : 10,
      height: isSmallScreen ? 8 : 10,
      mines: isSmallScreen ? 8 : 15,
      status: 'playing',
      setup: true,
      custom: false,
      usingFirstClickInsurance: true,
      usingGuessInsurance: false,
      activeSize: isSmallScreen ? 'large' : 'medium',
      activeDifficulty: 'normal',
      instructions: false,
      insuranceInstructions: false,
      remaining: isSmallScreen ? 8 : 12,
      firstClick: true,
      maxWidth: maxWidth,
      maxHeight: maxHeight,
      maxMines: isSmallScreen ? Math.floor((6 * 8) * 0.5) : 70,
      defaultGuessInsurance: 0,
      gameGuessInsurance: 0,
      firstClickInsuranceActive: false,
      guessInsuranceActive: false,
      failedInsuranceActive: false,
      insuredCell: null,
      timerOn: false,
      time: 90,
      showStatsPopup: false,
      quality: {
        clicks: 0,
        goodClicks: 0,
        luckyClicks: 0,
        failureProbability: 0,
        revealed: 0,
        totalCells: 0,
        correctFlags: 0,
        flags: 0,
        bailouts: 0
      },
      timerMenuOpen: false,
      timerDifficulty: "Recommended",
      timerOptions: [
        { time: 110, label: "Easier" },
        { time: 90, label: "Recommended" },
        { time: 70, label: "Harder" }
      ]
    };

    this.sweep = this.sweep.bind(this);
    this.play = this.play.bind(this);
    this.updateSize = this.updateSize.bind(this);
    this.updateDifficulty = this.updateDifficulty.bind(this);
    this.customise = this.customise.bind(this);
    this.setInsurance = this.setInsurance.bind(this);
    this.updateWidth = this.updateWidth.bind(this);
    this.updateHeight = this.updateHeight.bind(this);
    this.updateMines = this.updateMines.bind(this);
    this.updateFlag = this.updateFlag.bind(this);
    this.reset = this.reset.bind(this);
    this.handleImDone = this.handleImDone.bind(this);
    this.toggleInstructions = this.toggleInstructions.bind(this);
    this.toggleInsuranceInstructions = this.toggleInsuranceInstructions.bind(this);
    this.toggleStatsPopup = this.toggleStatsPopup.bind(this);
    this.moveMine = this.moveMine.bind(this);
    this.updateGuessInsurance = this.updateGuessInsurance.bind(this);
    this.revealCell = this.revealCell.bind(this);
    this.trackGuess = this.trackGuess.bind(this);

    this.selectTimerOption = this.selectTimerOption.bind(this);
    
    this.timerInterval = null;
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    this.stopTimer();
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize(); 
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (prevState.status === "playing" && this.state.status !== "playing") {
      this.stopTimer();
    }
  }
  
  handleResize = () => {
    const maxWidth = Math.round(
      ((window.innerWidth - 60) / 44) > 10 ? ((window.innerWidth - 60) / 44) : 0
    );
    const maxHeight = Math.round(
      ((window.innerHeight - 80) / 44) > 10 ? ((window.innerHeight - 80) / 44) : 0
    );
    const currentMax = Math.floor(this.state.width * this.state.height) * 0.5;
    const max = Math.floor((maxWidth * maxHeight) * 0.5)
    const maxMines = currentMax < max ? currentMax : max;
    this.setState({ maxWidth, maxHeight, maxMines });
  };
  
  revealCell(grid, click) {
    const [r, c] = click;
    grid[r][c].revealed = true;
    let count = 0;
    for (let i = r - 1; i <= r + 1; i++) {
      for (let j = c - 1; j <= c + 1; j++) {
        if (i === r && j === c) continue;
        if (i >= 0 && i < grid.length && j >= 0 && j < grid[0].length) {
          if (grid[i][j].mine) count++;
        }
      }
    }
    grid[r][c].bordering = count;
    return grid;
  }

  sweep(grid, click, mine, flag) {
    if (flag || this.state.status !== "playing") {
      return;
    }

    if (this.state.firstClick) {
      this.startTimer();
    }
    let updatedGrid = [...grid];
    const [row, col] = click;
    this.trackGuess(grid, row, col, this.state.quality)
    let result;

    // First-Click Insurance
    if (this.state.firstClick && mine) {
      updatedGrid = moveMine(updatedGrid, click);
      if (updatedGrid.fail) {
        this.setState({
          grid: updatedGrid.grid,
          status: mine ? 'lost' : 'playing',
          firstClick: false
        });
        updatedGrid = updatedGrid.grid;
        return;
      }
      updatedGrid[row][col].mine = false;
      updatedGrid = recalcNumbers(updatedGrid);
      updatedGrid = check(updatedGrid, click);
      result = updatedGrid.result;
      updatedGrid = computeKnowable(updatedGrid);
      if (updatedGrid.grid) {
        updatedGrid = updatedGrid.grid;
      }
      this.setState({
        grid: updatedGrid,
        firstClick: false,
        firstClickInsuranceActive: true,
        insuredCell: click
      });
      setTimeout(() => {
        this.setState({ firstClickInsuranceActive: false });
      }, 3000);
      return;
    }

    const clickedCellForCheck = updatedGrid[row] && updatedGrid[row][col];
    const isKnowable = clickedCellForCheck.knowable;
    if (
      !this.state.firstClick &&
      mine &&
      clickedCellForCheck &&
      !clickedCellForCheck.knowable &&
      this.state.gameGuessInsurance > 0
    ) {
      updatedGrid = moveMine(updatedGrid, click);
      if (updatedGrid.fail) {
        this.setState({
          grid: updatedGrid.grid,
          status: mine ? 'lost' : 'playing',
          firstClick: false
        });
        updatedGrid = updatedGrid.grid;
        return;
      }
      updatedGrid[row][col].mine = false;
      updatedGrid = recalcNumbers(updatedGrid);
      updatedGrid = check(updatedGrid, click);
      result = updatedGrid.result;
      updatedGrid = computeKnowable(updatedGrid);
      if (updatedGrid.grid) {
        updatedGrid = updatedGrid.grid;
      }
      const newInsurance = this.state.gameGuessInsurance - 1;
      this.setState({
        grid: updatedGrid,
        gameGuessInsurance: newInsurance,
        guessInsuranceActive: true,
        firstClick: false,
        insuredCell: click
      });
      setTimeout(() => {
        this.setState({ guessInsuranceActive: false });
      }, 3000);
      return;
    }

    // Normal move
    updatedGrid = check(updatedGrid, click);
    result = updatedGrid.result;
    updatedGrid = computeKnowable(updatedGrid);
    if (updatedGrid.grid) {
      updatedGrid = updatedGrid.grid;
    }
    const finalClickedCell = updatedGrid[row] && updatedGrid[row][col];
    if (!finalClickedCell) {
      console.error("Clicked cell not found", click, updatedGrid);
      return;
    }
    let countRemaining = 0;
    for (let i = 0; i < updatedGrid.length; i++) {
      for (let j = 0; j < updatedGrid[i].length; j++) {
        if (updatedGrid[i][j].revealed && !updatedGrid[i][j].mine) {
          countRemaining++;
        }
      }
    }
    const minesDetected = this.state.width * this.state.height - countRemaining;
    if (updatedGrid.result === 'continue') {
      result = 'continue';
    }
    if (minesDetected === Number(this.state.mines) && result === 'continue') {
      // Verify every flagged cell is a mine.
      const allFlagsCorrect = updatedGrid.every(row =>
        row.every(cell => !cell.flag || cell.mine)
      );
      if (allFlagsCorrect) {
        for (let i = 0; i < updatedGrid.length; i++) {
          for (let j = 0; j < updatedGrid[i].length; j++) {
            if (!updatedGrid[i][j].mine) {
              updatedGrid[i][j].revealed = true;
            }
          }
        }
        return this.setState({
          grid: updatedGrid,
          status: 'won'
        });
      } else {
        // At least one flag is wrong
        return this.setState({
          grid: updatedGrid,
          remaining: 0,
          status: 'playing'
        });
      }
    }
    if (
      !this.state.firstClick &&
      mine &&
      isKnowable &&
      this.state.gameGuessInsurance > 0
    ) {
      setTimeout(() => {
        this.setState({ failedInsuranceActive: true });
      }, 2000);
      setTimeout(() => {
        this.setState({ failedInsuranceActive: false });
      }, 6000);
    }
    this.setState({
      grid: updatedGrid,
      status: mine ? 'lost' : 'playing',
      firstClick: false
    });
  }

  moveMine(grid, click) {
    return moveMine(grid, click);
  }

  trackGuess(grid, r, c, quality) {
    const newQuality = {
      clicks: quality.clicks,
      goodClicks: quality.goodClicks,
      luckyClicks: quality.luckyClicks,
      failureProbability: quality.failureProbability,
      revealed: quality.revealed,
      totalCells: quality.totalCells,
      correctFlags: quality.correctFlags,
      flags: quality.flags,
      bailouts: quality.bailouts
    }
    newQuality.clicks++;
    const goodClickAvailable = grid.some(row => row.some(cell => cell.knowable));
    
    if ((!grid[r][c].mine && grid[r][c].knowable) || !goodClickAvailable) {
      newQuality.goodClicks++;
    } 
    if (!grid[r][c].mine && !grid[r][c].knowable) {
      newQuality.luckyClicks++;
    }
    let knownMines = grid.reduce((acc, row) => {
      let rowCount = row.reduce((rowAcc, cell) => {
        return rowAcc + ((cell.knowable && cell.mine) ? 1 : 0);
      }, 0);
      return acc + rowCount;
    }, 0);
    let correctFlags = grid.reduce((acc, row) => {
      let rowCount = row.reduce((rowAcc, cell) => {
        return rowAcc + ((cell.flag && cell.mine) ? 1 : 0);
      }, 0);
      return acc + rowCount;
    }, 0);
    let flags = grid.reduce((acc, row) => {
      let rowCount = row.reduce((rowAcc, cell) => {
        return rowAcc + (cell.flag ? 1 : 0);
      }, 0);
      return acc + rowCount;
    }, 0);
    let revealed = grid.reduce((acc, row) => {
      let rowCount = row.reduce((rowAcc, cell) => {
        return rowAcc + (cell.revealed ? 1 : 0);
      }, 0);
      return acc + rowCount;
    }, 0);
    const totalCells = this.state.width * this.state.height;

    newQuality.correctFlags = correctFlags;
    newQuality.flags = flags;
    newQuality.totalCells = totalCells;
    newQuality.revealed = Math.round((revealed / totalCells)*100);
    newQuality.bailouts = this.state.defaultGuessInsurance - this.state.gameGuessInsurance;

    let currentFailureProbability = ((this.state.mines - knownMines) / (totalCells - revealed));
    if (grid[r][c].knowable) {
      currentFailureProbability = 0;
    }
      if (newQuality.failureProbability) {
        newQuality.failureProbability =
          ((newQuality.failureProbability * (newQuality.clicks - 1)) + currentFailureProbability) /
          newQuality.clicks;
      } else {
        newQuality.failureProbability = currentFailureProbability;
      }
    
      return this.setState({
      quality: newQuality
    })
  }

  computeInitialTime(timerDifficulty, width, height, mines, difficulty) {
    const w = width || this.state.width;
    const h = height || this.state.height;
    const m = mines || this.state.mines;
    const d = difficulty || this.state.activeDifficulty;
    const newTimerDifficulty = timerDifficulty || this.state.timerDifficulty;
    let baseTime = w * h * 0.7;
    
    // Compute mine density and apply a linear mapping
    const density = m / (w * h);
    const A = 2.62;
    const B = 0.3;
    const densityFactor = A * density + B;
    
    let activeDiffFactor;
    switch (d) {
      case 'easy':
        activeDiffFactor = 1.4;
        break;
      case 'normal':
        activeDiffFactor = 1.8;
        break;
      case 'hard':
        activeDiffFactor = 2;
        break;
      case 'crazy':
        activeDiffFactor = 2.5;
        break;
      default:
        activeDiffFactor = 1.5;
    }
    
    let timerOptionFactor;
    if (newTimerDifficulty === 'Easier') {
      timerOptionFactor = 1.3;
    } else if (newTimerDifficulty === 'Harder') {
      timerOptionFactor = 0.8;
    } else {
      timerOptionFactor = 1;
    }
    
    const finalTime = baseTime * densityFactor * activeDiffFactor * timerOptionFactor;
    return Math.ceil(finalTime / 10) * 10;
  }
  
  

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    let initialTime = 0;
    if (this.state.timerOn) {
      initialTime = this.computeInitialTime();
    }
    this.setState({ time: initialTime });
    this.timerInterval = setInterval(() => {
      this.setState(prevState => {
        if (!prevState.timerOn) {
          return { time: prevState.time + 1 };
        } else {
          if (prevState.time <= 1) {
            clearInterval(this.timerInterval);
            return { time: 0, status: 'lost' };
          }
          return { time: prevState.time - 1 };
        }
      });
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  updateTimer(value) {
    this.setState({ 
      timerOn: value,
      time: value ? this.computeInitialTime() : 0,
      timerMenuOpen: value
    });
  }

  selectTimerOption(option) {
    let newTime;
    if (option.time) {
      newTime = option.time
    } else {
      // No custom option provided—use the default computed time
      newTime = this.computeInitialTime();
    }
    this.setState({ 
      time: newTime,
      timerDifficulty: option.difficulty
    });
  }
  
  updateTimerOptions (width, height, mines, difficulty) {
    const w = width || this.state.width;
    const h = height || this.state.height;
    const m = mines || this.state.mines;
    let easier = this.computeInitialTime("Easier", w, h, m, difficulty)
    let recommended = this.computeInitialTime("Recommended", w, h, m, difficulty)
    let harder = this.computeInitialTime("Harder", w, h, m, difficulty)
    harder = harder > 10 ? harder : 10;
    recommended = recommended > 20 ? recommended : 20;
    easier = easier > 30 ? easier : 30;
    if (harder === recommended) {
      recommended += 10;
    }
    if (easier === recommended) {
      easier += 10;
    }

    const timerOptions = [
      { time: easier, 
        label: "Easier" },
      { time: recommended, 
        label: "Recommended" },
      { time: harder, 
        label: "Harder" }
    ];
    this.setState(
      {
        timerOptions: timerOptions
      }
    )
    return timerOptions;
  }

  toggleStatsPopup() {
    this.setState(prevState => ({
      showStatsPopup: !prevState.showStatsPopup
    }));
  }

  play() {
    this.stopTimer();
    this.setState({
      grid: generator(this.state.width, this.state.height, this.state.mines),
      setup: false,
      remaining: this.state.mines,
      status: 'playing',
      firstClick: true,
      gameGuessInsurance: this.state.defaultGuessInsurance,
      insuredCell: null,
      time: this.state.timerOn ? this.computeInitialTime() : 0,
      quality: {
        clicks: 0,
        goodClicks: 0,
        luckyClicks: 0,
        failureProbability: 0,
        revealed: 0,
        totalCells: 0,
        correctFlags: 0,
        flags: 0
      }
    });
  }

  updateSize(w, h, size) {
    const difficulty = this.state.activeDifficulty === 'custom' ? 'normal' : this.state.activeDifficulty;
    let newMines = 7;
    if (difficulty === 'easy') {
      newMines = Math.ceil((w * h) / 10);
    }
    if (difficulty === 'normal') {
      newMines = Math.ceil((w * h) / 7);
    }
    if (difficulty === 'hard') {
      newMines = Math.ceil((w * h) / 4);
    }
    if (difficulty === 'crazy') {
      newMines = Math.ceil((w * h) / 3);
    }
    this.setState({
      mines: newMines,
      width: w,
      height: h,
      maxMines: newMines,
      remaining: newMines,
      activeSize: size,
      custom: false,
      activeDifficulty: this.state.custom ? "normal" : this.state.activeDifficulty,
      timerOptions: this.updateTimerOptions(w, h, newMines, difficulty)
    });
  }

  updateGuessInsurance(value) {
    this.setState({ 
      defaultGuessInsurance: value,
      gameGuessInsurance: value
    });
  }

  updateDifficulty(difficulty) {
    let newMines = 7;
    const width = this.state.activeDifficulty === 'custom' ? 10 : this.state.width;
    const height = this.state.activeDifficulty === 'custom' ? 10 : this.state.height;

    if (difficulty === 'easy') {
      newMines = Math.ceil((width * height) / 10);
    }
    if (difficulty === 'normal') {
      newMines = Math.ceil((width * height) / 7);
    }
    if (difficulty === 'hard') {
      newMines = Math.ceil((width * height) / 4);
    }
    if (difficulty === 'crazy') {
      newMines = Math.ceil((width * height) / 3);
    }
    this.setState({
      mines: newMines,
      activeDifficulty: difficulty,
      height: height,
      width: width,
      maxMines: newMines,
      custom: false,
      activeSize : this.state.custom ? "medium" : this.state.activeSize,
      time: this.computeInitialTime(null, width, height, newMines, difficulty),
      timerOptions: this.updateTimerOptions(width, height, newMines, difficulty)    
    });
  }

  customise(sizeOrDifficulty) {
    this.setState({
      custom: !this.state.custom,
      activeSize: 'custom',
      activeDifficulty: 'custom'
    });
  }

  setInsurance(type) {
    if (type === "fc") {
      this.setState({
        usingFirstClickInsurance: !this.state.usingFirstClickInsurance
      });
    } else if (!this.state.usingGuessInsurance) {
      this.setState({
        usingGuessInsurance: !this.state.usingGuessInsurance,
        defaultGuessInsurance: 1,
        gameGuessInsurance: 1,
      });
    } else {
      this.setState({
        usingGuessInsurance: !this.state.usingGuessInsurance,
        defaultGuessInsurance: 0,
        gameGuessInsurance: 0,
      });
    }
  }

  updateWidth(e) {
    let newWidth = e.target.value;
    const newMaxMines = Math.round((newWidth * this.state.height) * 0.5);

    if (!/([\D])/.test(newWidth) && newWidth < 41 && newWidth <= this.state.maxWidth) {
      this.setState({
        width: newWidth,
        mines: this.state.mines > newMaxMines ? newMaxMines : this.state.mines,
        maxMines: newMaxMines,
        timerOptions: this.updateTimerOptions(newWidth, this.state.height, this.state.mines)
      });
    }
  }

  updateHeight(e) {
    let newHeight = e.target.value;
    const newMaxMines = Math.round((this.state.width * newHeight) * 0.5);
    if (!/([\D])/.test(newHeight) && newHeight < 41  && newHeight <= this.state.maxHeight) {
      this.setState({
        height: newHeight,
        mines: this.state.mines > newMaxMines ? newMaxMines : this.state.mines,
        maxMines: newMaxMines,
        timerOptions: this.updateTimerOptions(this.state.width, newHeight, this.state.mines)
      });
    }
  }

  updateMines(e) {
    let newMines = e.target.value;
    let max = Math.round(this.state.height * this.state.width * 0.5);
    if (!/([\D])/.test(newMines) && e.target.value <= max) {
      this.setState({
        mines: newMines,
        remaining: newMines,
        timerOptions: this.updateTimerOptions(this.state.width, this.state.height, newMines)
      });
    }
  }

  updateFlag(w, h, e) {
    e.preventDefault();
    if (this.state.status !== "playing") return;
    let updatedGrid = [...this.state.grid];
    
    const currentFlagCount = updatedGrid.reduce((acc, row) => {
      return acc + row.reduce((b, cell) => (cell.flag ? b + 1 : b), 0);
    }, 0);
    
    updatedGrid[w][h].flag = !updatedGrid[w][h].flag;
    
    const newFlagCount = updatedGrid[w][h].flag ? currentFlagCount + 1 : currentFlagCount - 1;
    
    if (newFlagCount === Number(this.state.mines)) {
      const allFlagsCorrect = updatedGrid.every(row =>
        row.every(cell => !cell.flag || cell.mine)
      );
      if (allFlagsCorrect) {
        for (let i = 0; i < updatedGrid.length; i++) {
          for (let j = 0; j < updatedGrid[i].length; j++) {
            if (!updatedGrid[i][j].mine) {
              updatedGrid[i][j].revealed = true;
            }
          }
        }
        return this.setState({
          grid: updatedGrid,
          status: 'won',
          firstClick: false,
          remaining: 0
        });
      } else {
        return this.setState({
          grid: updatedGrid,
          remaining: 0
        });
      }
    }
    
    const remainingCount = Number(this.state.mines) - newFlagCount;
    this.setState({
      grid: updatedGrid,
      remaining: remainingCount
    });
  }

  reset() {
    this.stopTimer();
    this.setState({
      setup: true,
      remaining: this.state.mines,
      status: 'playing',
      firstClick: true,
      time: this.state.timerOn ? this.computeInitialTime() : 0,
      quality: {
        clicks: 0,
        goodClicks: 0,
        luckyClicks: 0,
        failureProbability: 0,
        revealed: 0,
        totalCells: 0,
        correctFlags: 0,
        flags: 0
      }
    });
  }

  handleImDone() {
    this.setState({ status: 'lost' });
  }

  toggleInstructions() {
    this.setState({
      instructions: !this.state.instructions
    });
  }

  toggleInsuranceInstructions() {
    this.setState({
      insuranceInstructions: !this.state.insuranceInstructions
    });
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
        setInsurance={this.setInsurance}
        usingFirstClickInsurance={this.state.usingFirstClickInsurance}
        usingGuessInsurance={this.state.usingGuessInsurance}
        activeDifficulty={this.state.activeDifficulty}
        updateHeight={this.updateHeight}
        updateWidth={this.updateWidth}
        updateMines={this.updateMines}
        toggleInstructions={this.toggleInstructions}
        toggleInsuranceInstructions={this.toggleInsuranceInstructions}
        updateGuessInsurance={this.updateGuessInsurance}
        defaultGuessInsurance={this.state.defaultGuessInsurance}
        maxWidth={this.state.maxWidth}
        maxHeight={this.state.maxHeight}
        maxMines={this.state.maxMines}
        timerOn={this.state.timerOn}
        updateTimer={this.updateTimer.bind(this)}
        timerOptions={this.state.timerOptions}
        timerMenuOpen={this.state.timerMenuOpen}
        timerDifficulty={this.state.timerDifficulty}
        selectTimerOption={this.selectTimerOption}
      />
    );
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
          activeDifficulty={this.state.activeDifficulty}
          remaining={this.state.remaining}
          firstClickInsuranceActive={this.state.firstClickInsuranceActive}
          guessInsuranceActive={this.state.guessInsuranceActive}
          failedInsuranceActive={this.state.failedInsuranceActive}
          insuredCell={this.state.insuredCell}
          defaultInsurance={this.state.defaultGuessInsurance}
          onImDone={this.handleImDone}
          gameGuessInsurance={this.state.gameGuessInsurance}
          toggleStatsPopup={this.toggleStatsPopup}
          showStatsPopup={this.state.showStatsPopup}
          time={this.state.time}
          timerOn={this.state.timerOn}
          quality={this.state.quality}
        />
      );
    }
    if (this.state.instructions) {
      content = (
        <div className='instructions'>
          <h2>HOW TO PLAY</h2>
          <p>
            <strong>Your goal</strong> is to reveal all safe cells without hitting a mine.
          </p>
          <p>
            <strong>Numbers</strong> tell you how many mines are <em>next to a cell</em> (even diagonally).
          </p>
          <p>
            <strong>Hit a mine?</strong> Game over! 💥
          </p>
          <p>
            <strong>Right-click (press and hold on mobile) to flag suspected mines</strong> and plan your moves.
          </p>
          <p>
            <strong>Starter Shield:</strong> Your very first click is always safe—any mine hit on day one is automatically moved.
          </p>
          <p>
            <strong>Bomb Bailout:</strong> Later on, if you click an unexpected mine (one not obvious from the clues), Bomb Bailout gives you a second chance.
          </p>
          <p>
            <strong>Clear all non-mine cells to win!</strong>
          </p>
          <div className='buttons'>
            <div className='button-wide mt-50' onClick={this.toggleInstructions}>
              <p>Got it!</p>
            </div>
          </div>
        </div>
      );
    }
    if (this.state.insuranceInstructions) {
      content = (
        <div className='instructions'>
          <h2>Starter Shields</h2>
          <p>
            <strong>You're protected for your very first guess.</strong> You can continue your search unscathed.
          </p>
          <h2>Bomb Bailouts</h2>
          <p>
            Bomb Bailouts give you a lifeline on unlucky search guesses.
          </p>
          <p>
            But remember: if the numbers clearly pointed to a mine, even Bomb Bailout won’t save you!
          </p>
          <p>
            Once you're out of Bomb Bailouts, the very next mine you click will blow everything up and end your run.
          </p>
          <div className='buttons'>
            <div className='button-wide mt-50' onClick={this.toggleInsuranceInstructions}>
              <p>Got it!</p>
            </div>
          </div>
        </div>
      );
    }
    return <div>{content}</div>;
  }
}

export default Game;
