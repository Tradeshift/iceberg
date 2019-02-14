import React from 'react';
import PropTypes from 'prop-types';
import ButtonStyles from './ButtonStyles';

const Button = ({ children, handleOnClick }) => (
    <ButtonStyles onClick={handleOnClick}>
        { children }
    </ButtonStyles>
);

Button.propTypes = {
    children: PropTypes.node.isRequired,
    handleOnClick: PropTypes.func.isRequired,
};

export default Button;
