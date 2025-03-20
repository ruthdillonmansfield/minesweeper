import React from 'react';
import propTypes from 'prop-types';
import Row from './Row';

// Helper function to format time (in seconds) as mm:ss.
const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const Grid = props => {
  const rows = props.grid.map((el, i) => (
    <Row 
      key={'row' + i} 
      grid={props.grid}
      row={i}
      cells={el}
      sweep={props.sweep}
      status={props.status}
      updateFlag={props.updateFlag}
      insuredCell={props.insuredCell}
      insurance={props.firstClickInsuranceActive || props.guessInsuranceActive}
    />  
  ));

  let minesBox = props.remaining && props.status === "playing" ? 
    <div className="status-box mines-box">
      <p className="status-number">{props.remaining}</p>
      <p className="status-label">Mines Remaining</p>
    </div>
   : 
   <div className="status-box mines-box main-button" onClick={props.onImDone}>
      <p className="status-number">Sweep</p>
      <p className="status-label">I'm all done.</p>
    </div>;

  // Timer box - shows time as mm:ss.
  const formattedTime = formatTime(props.time);
  const timerBox = (
    <div className={`status-box timer-box ${props.timerOn && props.time < 31 && props.time > 10 ? "timer-low" : props.timerOn && props.time < 11 ? "timer-lower" : ""}`}>
      <p className="status-number">{formattedTime}</p>
      <p className="status-label">{props.timerOn ? "Remaining" : "Time"}</p>
    </div>
  );

  let statusText;
  if (props.firstClickInsuranceActive) {
    statusText = "Starter Shield";
  } else if (props.guessInsuranceActive) {
    statusText = "Bomb Bailout";
  } else if (props.status === 'playing') {
    statusText = `${props.remaining} Remaining`;
  } else if (props.status === 'won') {
    statusText = "WIN! You cleared the field";
  } else {
    statusText = "💥 KABOOM! YOU LOSE 💥";
  }

  const isPlayingWithInsurance = (props.defaultInsurance > 0 && props.status === 'playing');

  let belowGrid;
  if (props.status === 'playing' && !props.firstClickInsuranceActive) {
    belowGrid = (
      <div className={isPlayingWithInsurance ? "status-three-boxes" : "status-two-boxes"}>
        {minesBox}
        {timerBox}
        {isPlayingWithInsurance && !props.firstClickInsuranceActive && (
          <div className={`status-box insurance-box ${props.firstClickInsuranceActive || props.guessInsuranceActive ? "insurance" : ""}`}>
            <p className="status-number">
              {props.gameGuessInsurance > 0
                ? Array(props.gameGuessInsurance).fill('🤍').join(' ')
                : ''}
            </p>
            <p className="status-label">
              {props.gameGuessInsurance > 0 ? "Bomb Bailouts" : "No Bailouts Left"}
            </p>
          </div>
        )}
      </div>
    );
  } else {
    belowGrid = props.remaining || props.status !== "playing" ? 
      <div className={`status-message ${props.firstClickInsuranceActive || props.guessInsuranceActive ? "insurance" : ""} ${props.status}`}>
        {statusText}
      </div> :
      <div className={`status-message main-button`} onClick={props.onImDone}>
        Sweep
      </div>;
  }

  return (
    <div className={`grid-container ${props.status === 'won' ? 'win' : ''} ${props.status === 'lost' ? 'lose' : ''}`}>
      <div className='grid'>
        {rows}
      </div>
      
      {belowGrid}

      <div className='action-buttons'>
        <div className='button-wide mt-50 main-button' onClick={props.play}>
          <p>{props.status !== 'playing' ? "Play Again" : "Reset"}</p>
        </div>
        <div className="button-wide mt-50 pale-button" onClick={props.reset}>
          <p>Back</p>
        </div>
      </div>
    </div>
  );
};

export default Grid;
