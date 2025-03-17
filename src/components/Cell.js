import React from 'react';
import propTypes from 'prop-types';

const Cell = props => {
    let contents = '';
    let color = 'white';

    if (props.cell.mine) {
        contents = '';
    }
    if (props.cell.revealed && !props.cell.mine) {
        contents = <p>{props.cell.bordering}</p>;
        color = `bordering-${props.cell.bordering}`;
    }
    if (props.cell.flag) {
        contents = <img src='./flag.png' alt='flag' className='flag'/>;
    }
    if (props.status === 'lost' && props.cell.mine) {
        contents = <img src='./mine.png' alt='mine' className='mine'/>;
        color = 'red';
    }
    if (props.status === 'won' && props.cell.mine) {
        contents = <img src='./mine.png' alt='mine' className='mine'/>;
        color = 'green';
    }

    // Add a special class for cells that just had a mine removed
    const animationClass = props.cell.removedMine ? 'mine-removed' : '';

    return (
        <div 
            className={`cell ${color} ${props.cell.revealed ? "" : "cell-secret"} ${animationClass}`}
            onClick={props.sweep.bind(null, props.grid, [props.row, props.column], props.cell.mine, props.cell.flag)}
            onContextMenu={props.updateFlag.bind(null, props.row, props.column)}
        >
            {contents}
        </div>
    );
};

export default Cell;
