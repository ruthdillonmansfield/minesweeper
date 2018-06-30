import React from 'react';
import propTypes from 'prop-types';

const Form = props => {
    return (
        <form>
            <div class='formField'>
                <h5>Width</h5>
                <input type="text" value={props.width} name="firstname" onChange={props.updateWidth}/>
            </div>
            <div class='formField'>
                <h5>Height</h5>
                <input type="text" value={props.height} name="lastname" onChange={props.updateHeight} />
            </div>
            <div class='formField'>
                <h5>Mines</h5>
                <input type="text" value={props.mines} name="firstname" onChange={props.updateMines} />
            </div>
        </form>
    );
};

// Form.propTypes = {
//   setGame: propTypes.any.isRequired
// };

export default Form;