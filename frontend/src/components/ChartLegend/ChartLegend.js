import React from 'react';
import PropTypes from 'prop-types';
import ChartLegendStyles from './ChartLegendStyles';
import ChartLegendItemStyles from './ChartLegendItemStyles';

const ChartLegend = ({ legendItems = [], additionalNote }) => (
	<ChartLegendStyles>
		<div className="legend-wrapper">	
			{legendItems.map(item => (
				<ChartLegendItemStyles key={item.name} color={item.color}>
					<span className="square"></span>
					<p>{item.name}</p>
				</ChartLegendItemStyles>
			))}
		</div>
		{additionalNote && <p className="note">{additionalNote}</p>}
	</ChartLegendStyles>
);

ChartLegend.propTypes = {
	legendItems: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string,
			color: PropTypes.string,
			customShape: PropTypes.string,
		})
	).isRequired,
	additionalNote: PropTypes.string
};

export default ChartLegend;
