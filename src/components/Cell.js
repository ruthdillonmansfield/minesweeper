import React from 'react';
import propTypes from 'prop-types';

const Cell = props => {
    console.log(props);
    return (
        <div 
            className='cell'
            onClick={props.sweep.bind(null, props.grid, [props.row, props.column])}
        >
            <p>{props.cell.mine ? 'MINE' : props.cell.bordering}</p>
        </div>
    );
};

// Row.propTypes = {
//   setGame: propTypes.any.isRequired
// };

export default Cell;