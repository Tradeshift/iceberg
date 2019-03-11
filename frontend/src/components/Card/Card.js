import React from 'react';
import PropTypes from 'prop-types';
import CardStyles from './CardStyles';

const Card = ({ children, title }) => (
    <CardStyles>
        {title && (
            <h5>{title}</h5>
        )}
        { children }
    </CardStyles>
);

Card.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
};

Card.defaultProps = {
    title: '',
};

export default Card;
