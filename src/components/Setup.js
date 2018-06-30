import React from 'react';
import propTypes from 'prop-types';
import Form from './Form';

const Setup = props => {    
    return (
        <div className="Game">
            <h3>Grid Size</h3>
            <div className='buttons'>
                <div className={`button ${props.activeSize === 'small' ? 'active' : ''}`} onClick={props.updateSize.bind(null, 7, 7, 'small')}>
                    <p>Small</p>
                </div>
                <div className={`button ${props.activeSize === 'medium' ? 'active' : ''}`} onClick={props.updateSize.bind(null, 10, 10, 'medium')}>
                    <p>Medium</p>
                </div>
                <div className={`button ${props.activeSize === 'large' ? 'active' : ''}`} onClick={props.updateSize.bind(null, 20, 15, 'large')}>
                    <p>Large</p>
                </div>
                <div className={`button ${props.activeSize === 'huge' ? 'active' : ''}`} onClick={props.updateSize.bind(null, 25, 30, 'huge')}>
                    <p>Huge</p>
                </div>
                <div className={`button ${props.activeSize === 'custom' ? 'active' : ''}`} onClick={props.customise.bind(null, 'size')}>
                    <p>Custom</p>
                </div>
            </div>
            <h3>Difficulty</h3>
            <div className='buttons'>
                <div className={`button ${props.activeDifficulty === 'easy' ? 'active' : ''}`} onClick={props.updateDifficulty.bind(null, 'easy')}>
                    <p>Easy</p>
                </div>
                <div className={`button ${props.activeDifficulty === 'normal' ? 'active' : ''}`} onClick={props.updateDifficulty.bind(null, 'normal')}>
                    <p>Normal</p>
                </div>
                <div className={`button ${props.activeDifficulty === 'hard' ? 'active' : ''}`} onClick={props.updateDifficulty.bind(null, 'hard')}>
                    <p>Hard</p>
                </div>
                <div className={`button ${props.activeDifficulty === 'crazy' ? 'active' : ''}`} onClick={props.updateDifficulty.bind(null, 'crazy')}>
                    <p>Crazy</p>
                </div>
                <div className={`button ${props.activeDifficulty === 'custom' ? 'active' : ''}`} onClick={props.customise.bind(null, 'difficulty')}>
                    <p>Custom</p>
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
            <div className='buttons'>
                <div className='button' onClick={props.play}>
                    <p>GO</p>
                </div>
            </div>
        </div>
    );
};

// Setup.propTypes = {
//   setGame: propTypes.any.isRequired
// };

export default Setup;
