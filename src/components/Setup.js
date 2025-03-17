import React from 'react';
import propTypes from 'prop-types';
import Form from './Form';

const Setup = props => {    
    return (
        <div className="Game">
            <h2 class='mb-0 mt-50'>GRID SIZE</h2>
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
                <div className={`button lg ${props.activeSize === 'large' ? 'active' : ''}`} onClick={props.updateSize.bind(null, 18, 15, 'large')}>
                    <p>LARGE</p>
                </div>
                <div className={`button lg ${props.activeSize === 'huge' ? 'active' : ''}`} onClick={props.updateSize.bind(null, 25, 18, 'huge')}>
                    <p>HUGE</p>
                </div>
                <div className={`button lg ${props.activeSize === 'custom' ? 'active' : ''}`} onClick={props.customise.bind(null, 'size')}>
                    <p>CUSTOM</p>
                </div>
            </div>
            <h2 class='mb-0 mt-50'>DIFFICULTY</h2>
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
            {props.custom ? <Form 
                height={props.height}
                width={props.width}
                mines={props.mines}
                updateHeight={props.updateHeight}
                updateWidth={props.updateWidth}
                updateMines={props.updateMines}
            /> : ''}
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

// Setup.propTypes = {
//   setGame: propTypes.any.isRequired
// };

export default Setup;
