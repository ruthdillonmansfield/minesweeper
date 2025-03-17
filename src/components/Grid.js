import React from 'react';
import propTypes from 'prop-types';
import Row from './Row';

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
        />  
    ));

    return (
        <div className={`grid-container ${props.status === 'won' ? 'win' : ''} ${props.status === 'lost' ? 'lose' : ''}`}>
            <div className='grid'>
                {rows}
            </div>
            <div className={`status-message ${props.status}`}>
                {props.status === 'playing' 
                    ? `${props.remaining} Remaining` 
                    : props.status === 'won' 
                    ? "🎉 YOU WON! 🎉" 
                    : props.status === 'firstClickInsurance'
                        ? "✨ First Click Insurance! ✨" 
                        : "💥 YOU LOST 💥"}
                </div>

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
// Grid.propTypes = {
//   setGame: propTypes.any.isRequired
// };

export default Grid;
