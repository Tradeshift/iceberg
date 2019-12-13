import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'components/Chart/Chart';
import {
    getLineData,
    getLineOptions,
} from 'utils/chartConfigData';
import Card from 'components/Card/Card';
import CostChartStyles from './CostChartStyles';
import colors from '../../utils/constants';

const CostChart = (props) => {
    const {
        threshold,
        savedThreshold,
        costPoints,
        handleOnDrag,
    } = props;

    const legendItems = [
        {
            name: 'Cost',
            color: colors.lightorange
        }
    ];

    return (
        <CostChartStyles>
            <Card
                title="Cost"
                legendItems={legendItems}
                withLegend
            >
                <Chart
                    data={getLineData(costPoints)}
                    options={getLineOptions(threshold, savedThreshold, handleOnDrag)}
                />
            </Card>
        </CostChartStyles>
    );
};

CostChart.propTypes = {
    threshold: PropTypes.number.isRequired,
    costPoints: PropTypes.instanceOf(Array).isRequired,
    handleOnDrag: PropTypes.func.isRequired,
    savedThreshold: PropTypes.number,
};

CostChart.defaultProps = {
    savedThreshold: null,
};

export default CostChart;
