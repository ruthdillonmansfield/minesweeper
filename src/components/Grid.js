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
    const wonButton = props.status !== 'playing' ? (
        <div className='buttons'>
            <div className='button' onClick={props.reset}>
                <p>Play again</p>
            </div>
        </div>
    ) : '';
    return (
        <div>
            <div className='grid'>
                {rows}
            </div>
            {wonButton}
        </div>
    );
};

// Grid.propTypes = {
//   setGame: propTypes.any.isRequired
// };

export default Grid;