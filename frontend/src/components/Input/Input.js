import React from 'react';
import PropTypes from 'prop-types';
import InputStyles from './InputStyles';

const Input = ({
    type,
    name,
    value,
    placeholder,
    handleOnChange,
}) => (
    <InputStyles
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={handleOnChange}
    />
);

Input.propTypes = {
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    placeholder: PropTypes.string,
    handleOnChange: PropTypes.func.isRequired,
};

Input.defaultProps = {
    type: 'text',
    value: '',
    placeholder: '',
};

export default Input;
