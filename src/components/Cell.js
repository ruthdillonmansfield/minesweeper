import React from 'react';
import propTypes from 'prop-types';

const Cell = props => {
    let contents = '';
    if (props.cell.mine) {
        contents = 'M'
    }
    if (props.cell.revealed) {
        contents = props.cell.bordering
    }
    return (
        <div 
            className='cell'
            onClick={props.sweep.bind(null, props.grid, [props.row, props.column])}
        >
            <p>{contents}</p>
        </div>
    );
};

// Row.propTypes = {
//   setGame: propTypes.any.isRequired
// };

export default Cell;