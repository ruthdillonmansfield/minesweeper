import React from 'react';
import Form from './Form';

const Setup = props => { 
    return (
        <div className="Game">
            {/* GRID SIZE */}
            <h2 className=''>GRID SIZE</h2>
            <div className='buttons setup-buttons'>
                <div className={`button sm ${props.activeSize === 'small' ? 'active' : ''}`} onClick={props.updateSize.bind(null, 5, 6, 'small')}>
                    <p>SMALL</p>
                </div>
                <div className={`button sm ${props.activeSize === 'large' ? 'active' : ''}`} onClick={props.updateSize.bind(null, 6, 8, 'large')}>
                    <p>LARGE</p>
                </div>
                <div className={`button lg ${props.activeSize === 'small' ? 'active' : ''}`} onClick={props.updateSize.bind(null, 7, 7, 'small')}>
                    <p>SMALL</p>
                </div>
                <div className={`button lg ${props.activeSize === 'medium' ? 'active' : ''}`} onClick={props.updateSize.bind(null, 10, 10, 'medium')}>
                    <p>MEDIUM</p>
                </div>
                <div className={`button lg ${props.activeSize === 'large' ? 'active' : ''}`} onClick={props.updateSize.bind(null, 15, 10, 'large')}>
                    <p>LARGE</p>
                </div>
                <div className={`button lg ${props.activeSize === 'huge' ? 'active' : ''}`} onClick={props.updateSize.bind(null, 24, 14, 'huge')}>
                    <p>HUGE</p>
                </div>
                <div className={`button lg ${props.activeSize === 'custom' ? 'active' : ''}`} onClick={props.customise.bind(null, 'size')}>
                    <p>CUSTOM</p>
                </div>
            </div>

            {/* DIFFICULTY */}
            <h2 className=''>DIFFICULTY</h2>
            <div className='buttons setup-buttons'>
                <div className={`button ${props.activeDifficulty === 'easy' ? 'active' : ''}`} onClick={props.updateDifficulty.bind(null, 'easy')}>
                    <p>EASY</p>
                </div>
                <div className={`button ${props.activeDifficulty === 'normal' ? 'active' : ''}`} onClick={props.updateDifficulty.bind(null, 'normal')}>
                    <p>NORMAL</p>
                </div>
                <div className={`button ${props.activeDifficulty === 'hard' ? 'active' : ''}`} onClick={props.updateDifficulty.bind(null, 'hard')}>
                    <p>HARD</p>
                </div>
                <div className={`button lg ${props.activeDifficulty === 'crazy' ? 'active' : ''}`} onClick={props.updateDifficulty.bind(null, 'crazy')}>
                    <p>CRAZY</p>
                </div>
                <div className={`button lg ${props.activeDifficulty === 'custom' ? 'active' : ''}`} onClick={props.customise.bind(null, 'difficulty')}>
                    <p>CUSTOM</p>
                </div>
            </div>

            {props.custom ? (
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
                />
            ) : null}

            {/* GUESS INSURANCE */}
            <div className="info-heading">
                <h2 className="mb-0">BOMB BAILOUT</h2>
                <span className="info-button" onClick={props.toggleInsuranceInstructions}>i</span>
            </div>

            <div className='buttons setup-buttons'>
                <div className={`button ${props.defaultGuessInsurance == '0' ? 'active' : ''}`} onClick={props.updateGuessInsurance.bind(null, 0)}>
                    <p>OFF</p>
                </div>
                <div className={`button ${props.defaultGuessInsurance == '1' ? 'active' : ''}`} onClick={props.updateGuessInsurance.bind(null, 1)}>
                    <p>1</p>
                </div>
                <div className={`button ${props.defaultGuessInsurance == '2' ? 'active' : ''}`} onClick={props.updateGuessInsurance.bind(null, 2)}>
                    <p>2</p>
                </div>
                <div className={`button lg ${props.defaultGuessInsurance == '3' ? 'active' : ''}`} onClick={props.updateGuessInsurance.bind(null, 3)}>
                    <p>3</p>
                </div>
            </div>

            <div className="toggle-container">
            <span className="toggle-text">TIME LIMIT</span>
            <label className="switch">
                <input
                type="checkbox"
                checked={props.timerOn}
                onChange={(e) => props.updateTimer(e.target.checked)}
                />
                <span className="slider round"></span>
            </label>
            </div>


            {/* ACTION BUTTONS */}
            <div className='action-buttons'>
                <div className='button-wide mt-50 main-button' onClick={props.play}>
                    <p>GO</p>
                </div>
                <div className='button-wide pale-button mt-50' onClick={props.toggleInstructions}>
                    <p>How to play</p>
                </div>
            </div>
        </div>
    );
};

export default Setup;
