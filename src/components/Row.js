import React from 'react';
import propTypes from 'prop-types';
import Cell from './Cell'

const Row = props => {
    const cells = props.cells.map((el, i) => {
        return (
            <Cell 
                key={'cell' + i} 
                cell={el}
                row={props.row}
                grid={props.grid}
                column={i}
                sweep={props.sweep}
                status={props.status}
            />
        )
    })
    return (
        <div className='row'>
            {cells}
        </div>
    );
};

// Row.propTypes = {
//   setGame: propTypes.any.isRequired
// };

export default Row;