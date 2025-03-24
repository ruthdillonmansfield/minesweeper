import React from 'react';
import propTypes from 'prop-types';

const Form = props => {
    return (
        <form className={`collapsible lg ${props.custom ? 'open' : ""}`}>
            <div className='formField'>
                <h5>Width</h5>
                <h5 className='form-sub'>{`Max. ${props.maxWidth}`}</h5>
                <input type="text" value={props.width} name="firstname" onChange={props.updateWidth}/>
            </div>
            <div className='formField'>
                <h5>Height</h5>
                <h5 className='form-sub'>{`Max. ${props.maxHeight}`}</h5>
                <input type="text" value={props.height} name="lastname" onChange={props.updateHeight} />
            </div>
            <div className='formField'>
                <h5>Mines</h5>
                <h5 className='form-sub'>{`Max. ${props.maxMines}`}</h5>
                <input type="text" value={props.mines} name="firstname" onChange={props.updateMines} />
            </div>
        </form>
    );
};

// Form.propTypes = {
//   setGame: propTypes.any.isRequired
// };

export default Form;