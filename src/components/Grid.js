import React, {Constructor} from 'react'
// import Row from './Row';



class Grid extends Constructor {
    constructor (props) {
        super(props);
        this.state = {
            tthing: ''
        };
    }
    render () {
        return (
            <div className=''>
                {/* <Row /> */}
            </div>
        )
    };
}



export default Grid;

// function Grid () {
//     return <p>YEY</p>
// }

// export default Grid