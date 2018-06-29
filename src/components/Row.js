import React from 'react';
import propTypes from 'prop-types';
import Cell from './Cell'

const Row = props => {
    const cells = props.cells.map((el, i) => {
        return (
            <Cell 
                key={'cell' + i} 
                cells={el}
            />
        )
    })
    return (
        <div className='select'>
            <h5>ROW</h5>
            {cells}
        </div>
    );
};

// Row.propTypes = {
//   setGame: propTypes.any.isRequired
// };

export default Row;