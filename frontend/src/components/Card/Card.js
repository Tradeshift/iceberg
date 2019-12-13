import React from 'react';
import PropTypes from 'prop-types';
import CardStyles from './CardStyles';
import ChartLegend from '../ChartLegend/ChartLegend';

const Card = ({
    children,
    title,
    withLegend,
    legendItems,
    additionalNote
}) => (
    <CardStyles withLegend={withLegend}>
        {withLegend && title && (
            <div className="title--with-legend">
                <h5>{title}</h5>
                <ChartLegend legendItems={legendItems} additionalNote={additionalNote} />
            </div>
        )}
        {!withLegend && title && (
            <h5>{title}</h5>
        )}
        { children }
    </CardStyles>
);

Card.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
    withLegend: PropTypes.bool,
    legendItems: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string,
			color: PropTypes.string
		})
	)
};

Card.defaultProps = {
    title: '',
    withLegend: false
};

export default Card;
