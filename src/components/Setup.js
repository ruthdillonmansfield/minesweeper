import React from 'react'
import Form from './Form'

const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  

const Setup = props => {
  return (
    <div className="Game">
      <h2 className='mb-0'>FIELD SIZE</h2>
      <div className="buttons setup-buttons">
        <div
          className={`button sm ${props.activeSize === 'small' ? 'active' : ''}`}
          onClick={props.updateSize.bind(null, 5, 6, 'small')}
        >
          <p>SMALL</p>
        </div>
        <div
          className={`button sm ${props.activeSize === 'large' ? 'active' : ''}`}
          onClick={props.updateSize.bind(null, 6, 8, 'large')}
        >
          <p>LARGE</p>
        </div>
        <div
          className={`button lg ${props.activeSize === 'small' ? 'active' : ''}`}
          onClick={props.updateSize.bind(null, 7, 7, 'small')}
        >
          <p>SMALL</p>
        </div>
        <div
          className={`button lg ${props.activeSize === 'medium' ? 'active' : ''}`}
          onClick={props.updateSize.bind(null, 10, 10, 'medium')}
        >
          <p>MEDIUM</p>
        </div>
        <div
          className={`button lg ${props.activeSize === 'large' ? 'active' : ''}`}
          onClick={props.updateSize.bind(null, 15, 10, 'large')}
        >
          <p>LARGE</p>
        </div>
        <div
          className={`button lg ${props.activeSize === 'huge' ? 'active' : ''}`}
          onClick={props.updateSize.bind(null, 24, 14, 'huge')}
        >
          <p>HUGE</p>
        </div>
        <div
          className={`button lg ${props.activeSize === 'custom' ? 'active' : ''}`}
          onClick={props.customise.bind(null, 'size')}
        >
          <p>CUSTOM</p>
        </div>
      </div>

      <h2 className='mb-0'>DIFFICULTY</h2>
      <div className="buttons setup-buttons">
        <div
          className={`button ${props.activeDifficulty === 'easy' ? 'active' : ''}`}
          onClick={props.updateDifficulty.bind(null, 'easy')}
        >
          <p>EASY</p>
        </div>
        <div
          className={`button ${props.activeDifficulty === 'normal' ? 'active' : ''}`}
          onClick={props.updateDifficulty.bind(null, 'normal')}
        >
          <p>NORMAL</p>
        </div>
        <div
          className={`button ${props.activeDifficulty === 'hard' ? 'active' : ''}`}
          onClick={props.updateDifficulty.bind(null, 'hard')}
        >
          <p>HARD</p>
        </div>
        <div
          className={`button lg ${props.activeDifficulty === 'crazy' ? 'active' : ''}`}
          onClick={props.updateDifficulty.bind(null, 'crazy')}
        >
          <p>CRAZY</p>
        </div>
        <div
          className={`button lg ${props.activeDifficulty === 'custom' ? 'active' : ''}`}
          onClick={props.customise.bind(null, 'difficulty')}
        >
          <p>CUSTOM</p>
        </div>
      </div>

        <Form
          height={props.height}
          width={props.width}
          mines={props.mines}
          updateHeight={props.updateHeight}
          updateWidth={props.updateWidth}
          updateMines={props.updateMines}
          maxWidth={props.maxWidth}
          maxHeight={props.maxHeight}
          maxMines={props.maxMines}
          custom={props.custom}
        />

      <div className="toggle-inline-group">
        <div className="toggle-container lg">
          <div className="toggle-header">
            <span className="toggle-text">
              STARTER<br/>SHIELD
            </span>
            <span className="info-button" onClick={props.toggleInsuranceInstructions}>
              i
            </span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={props.usingFirstClickInsurance}
              onChange={() => props.setInsurance('fc')}
            />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="toggle-container">
          <div className="toggle-header">
            <span className="toggle-text">
              BOMB<br/>BAILOUTS
            </span>
            <span className="info-button" onClick={props.toggleInsuranceInstructions}>
              i
            </span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={props.usingGuessInsurance}
              onChange={() => props.setInsurance('guess')}
            />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="toggle-container">
          <div className="toggle-header">
            <span className="toggle-text">
              TIME<br/>LIMIT
            </span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={props.timerOn}
              onChange={e => props.updateTimer(e.target.checked)}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>


        <div className={`collapsible ${props.usingGuessInsurance ? 'open' : ''}`}>
  <div className="info-heading">
    <h2 className="mb-0">BOMB BAILOUTS</h2>
    <span className="info-button" onClick={props.toggleInsuranceInstructions}>
      i
    </span>
  </div>
    <div className="buttons setup-buttons">
      <div
        className={`button ${props.defaultGuessInsurance == '0' ? 'active' : ''}`}
        onClick={props.updateGuessInsurance.bind(null, 0)}
      >
        <p>OFF</p>
      </div>
      <div
        className={`button ${props.defaultGuessInsurance == '1' ? 'active' : ''}`}
        onClick={props.updateGuessInsurance.bind(null, 1)}
      >
        <p>1</p>
      </div>
      <div
        className={`button ${props.defaultGuessInsurance == '2' ? 'active' : ''}`}
        onClick={props.updateGuessInsurance.bind(null, 2)}
      >
        <p>2</p>
      </div>
      <div
        className={`button lg ${props.defaultGuessInsurance == '3' ? 'active' : ''}`}
        onClick={props.updateGuessInsurance.bind(null, 3)}
      >
        <p>3</p>
      </div>
    </div>
  </div>

  <div className={`collapsible timer-menu ${props.timerMenuOpen ? "open" : ""}`}>
  <div className="info-heading">
    <h2 className="mb-0">TIME LIMIT</h2>
  </div>
  <div className="buttons setup-buttons">
  {props.timerOptions.map((option, i) => {
    let name = "Recommended";
    if (option.label === "Harder") {name = "Challenging"}
    if (option.label === "Easier") {name = "Relaxed"}

    return (
  <div
    key={i}
    className={`button timer-option ${props.timerDifficulty === option.label ? 'active' : ''}`}
    onClick={() => props.selectTimerOption({
      time: option.time,
      difficulty: option.label
    })}
  >
    <p className="timer-main">{formatTime(option.time)}</p>
    <p className="timer-label">{name}</p>
  </div>
)})
}
  </div>
</div>




      <div className="action-buttons">
        <div className="button-wide mt-50 main-button" onClick={props.play}>
          <p>GO</p>
        </div>
        <div className="button-wide pale-button mt-50" onClick={props.toggleInstructions}>
          <p>How to play</p>
        </div>
      </div>
    </div>
  )
}

export default Setup