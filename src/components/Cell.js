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
    }
    if (props.status === 'won' && props.cell.mine) {
        contents = <img src='./mine.png' alt='mine' className='mine'/>;
    }

    // Determine if this cell is the insured cell (using props.insuredCell, props.row, and props.column)
    const isInsured = props.insuredCell &&
                      props.insuredCell[0] === props.row &&
                      props.insuredCell[1] === props.column &&
                      props.insurance
    return (
        <div 
            className={`cell ${color} ${props.cell.revealed ? "" : "cell-secret"} ${isInsured ? "insurance" : ""} ${props.status === "lost" || props.status === "won" ? "static" : ""}`}
            onClick={props.sweep.bind(null, props.grid, [props.row, props.column], props.cell.mine, props.cell.flag)}
            onContextMenu={props.updateFlag.bind(null, props.row, props.column)}
        >
            {contents}
        </div>
    );
};

export default Cell;
