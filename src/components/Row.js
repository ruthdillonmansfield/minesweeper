import React, {Constructor} from 'react'
import Cell from './Cell';



export class Row extends Constructor {
    render () {
        return (
            <div className=''>
                <Cell />
            </div>
        )
    };
}



export default Row;