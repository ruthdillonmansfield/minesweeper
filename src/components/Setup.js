import React from 'react';
import propTypes from 'prop-types';
import Form from './Form';

const Setup = props => {
    return (
        <div className="Game">
            <h3>Grid Size</h3>
            <div className='buttons'>
                <div className='button' onClick={props.updateSize.bind(null, 7, 7)}>
                    <p>Small</p>
                </div>
                <div className='button' onClick={props.updateSize.bind(null, 10, 10)}>
                    <p>Medium</p>
                </div>
                <div className='button' onClick={props.updateSize.bind(null, 20, 15)}>
                    <p>Large</p>
                </div>
                <div className='button' onClick={props.updateSize.bind(null, 25, 30)}>
                    <p>Huge</p>
                </div>
                <div className='button' onClick={props.custom}>
                    <p>Custom</p>
                </div>
            </div>
            <h3>Difficulty</h3>
            <div className='buttons'>
                <div className='button' onClick={props.updateDifficulty.bind(null, 'easy')}>
                    <p>Easy</p>
                </div>
                <div className='button' onClick={props.updateDifficulty.bind(null, 'normal')}>
                    <p>Normal</p>
                </div>
                <div className='button' onClick={props.updateDifficulty.bind(null, 'hard')}>
                    <p>Hard</p>
                </div>
                <div className='button' onClick={props.updateDifficulty.bind(null, 'crazy')}>
                    <p>Crazy</p>
                </div>
                <div className='button' onClick={props.custom}>
                    <p>Custom</p>
                </div>
            </div>
            <div className='buttons'>
                <div className='button' onClick={props.play}>
                    <p>GO</p>
                </div>
            </div>
            <Form />
        </div>
    );
};

// Setup.propTypes = {
//   setGame: propTypes.any.isRequired
// };

export default Setup;
