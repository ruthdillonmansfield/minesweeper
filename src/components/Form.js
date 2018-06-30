import React from 'react';
import propTypes from 'prop-types';

const Form = props => {
    return (
        <form>
            <h5>Width</h5>
            <input type="text" name="firstname" />
            <h5>Height</h5>
            <input type="text" name="lastname" />
            <h5>Mines</h5>
            <input type="text" name="firstname" />
            <br />
            <input type="submit" value="Submit" />
        </form>
    );
};

// Form.propTypes = {
//   setGame: propTypes.any.isRequired
// };

export default Form;