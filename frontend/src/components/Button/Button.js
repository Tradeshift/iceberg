import React from 'react';
import PropTypes from 'prop-types';
import ButtonStyles from './ButtonStyles';

const Button = ({
    children,
    handleOnClick,
    secondary,
    disabled,
}) => (
    <ButtonStyles
        onClick={handleOnClick}
        secondary={secondary}
        disabled={disabled}
    >
        { children }
    </ButtonStyles>
);

Button.propTypes = {
    children: PropTypes.node.isRequired,
    handleOnClick: PropTypes.func.isRequired,
    secondary: PropTypes.bool,
    disabled: PropTypes.bool,
};

Button.defaultProps = {
    secondary: false,
    disabled: false,
};

export default Button;
