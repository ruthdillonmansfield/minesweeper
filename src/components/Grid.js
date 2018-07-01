import React from 'react';
import propTypes from 'prop-types';
import Row from './Row'

const Grid = props => {
    const rows = props.grid.map((el, i) => {
        return (
            <Row 
                key={'row' + i} 
                grid={props.grid}
                row={i}
                cells={el}
                sweep={props.sweep}
                status={props.status}
                updateFlag={props.updateFlag}
            />  
        )
    });
    let message = '';
    if (props.status === 'won') {
        message = <h3>YOU WON!</h3>
    }
    if (props.status === 'lost') {
        message = <h3>YOU LOST!</h3>
    }
    const wonButton = props.status !== 'playing' ? (
        <div className='buttons'>
            <div className='button-wide' onClick={props.reset}>
                <p>PLAY AGAIN</p>
            </div>
        </div>
    ) : '';
    return (
        <div class='grid-container'>
            <div className='grid'>
                {rows}
            </div>
            {message}
            {wonButton}
        </div>
    );
};

// Grid.propTypes = {
//   setGame: propTypes.any.isRequired
// };

export default Grid;