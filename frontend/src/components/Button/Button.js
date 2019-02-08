import React from 'react';
import PropTypes from 'prop-types';
import ButtonStyles from './ButtonStyles';

const Card = ({ children, handleOnClick }) => (
    <ButtonStyles onClick={handleOnClick}>
        { children }
    </ButtonStyles>
);

Card.propTypes = {
    children: PropTypes.node.isRequired,
    handleOnClick: PropTypes.func.isRequired,
};

export default Card;
