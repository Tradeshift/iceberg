import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'components/Chart/Chart';
import {
    getChartData,
    getChartOptions,
} from 'utils/chartConfigData';
import Card from '../../components/Card/Card';
import StatsChartStyles from './StatsChartStyles';

const StatsChart = (props) => {
    const {
        threshold,
        savedThreshold,
        errors,
        abstains,
        corrects,
        handleOnDrag,
    } = props;
    return (
        <StatsChartStyles>
            <Card title="Abstain threshold">
                <Chart
                    data={getChartData(errors, abstains, corrects)}
                    options={getChartOptions(threshold, savedThreshold, handleOnDrag)}
                />
            </Card>
        </StatsChartStyles>
    );
};

StatsChart.propTypes = {
    threshold: PropTypes.number.isRequired,
    errors: PropTypes.instanceOf(Array).isRequired,
    abstains: PropTypes.instanceOf(Array).isRequired,
    corrects: PropTypes.instanceOf(Array).isRequired,
    handleOnDrag: PropTypes.func.isRequired,
    savedThreshold: PropTypes.number,
};

StatsChart.defaultProps = {
    savedThreshold: null,
};

export default StatsChart;
