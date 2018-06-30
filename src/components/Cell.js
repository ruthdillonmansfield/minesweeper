import React from 'react';
import propTypes from 'prop-types';

const Cell = props => {
    let contents = '';
    let color = 'white';
    if (props.cell.mine) {
        contents = '';
    }
    if (props.cell.revealed && !props.cell.mine) {
        contents = props.cell.bordering;
    }
    if (props.status === 'lost' && props.cell.mine) {
        contents = 'M';
        color = 'red';
    }
    let mine = props.cell.mine ? true : false;
    return (
        <div 
            className={`cell ${color}`}
            onClick={props.sweep.bind(null, props.grid, [props.row, props.column], mine)}
        >
            <p>{contents}</p>
        </div>
    );
};

// Row.propTypes = {
//   setGame: propTypes.any.isRequired
// };

export default Cell;