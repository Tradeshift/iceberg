import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'components/Chart/Chart';
import {
    getChartData,
    getLineData,
    getChartOptions,
    getLineOptions,
} from 'utils/chartConfigData';
// import ChartsStyles from './ChartsStyles';
import Card from '../../components/Card/Card';

const Charts = (props) => {
    const {
        threshold,
        errors,
        abstains,
        corrects,
        costPoints,
        handleOnDrag,
    } = props;
    return (
        <>
            <Card title="Abstain threshold">
                <Chart
                    data={getChartData(errors, abstains, corrects)}
                    options={getChartOptions(threshold, handleOnDrag)}
                />
            </Card>
            <Card title="Cost">
                <Chart
                    data={getLineData(costPoints)}
                    options={getLineOptions(threshold, handleOnDrag)}
                />
            </Card>
        </>
    );
};

Charts.propTypes = {
    threshold: PropTypes.number.isRequired,
    errors: PropTypes.instanceOf(Array).isRequired,
    abstains: PropTypes.instanceOf(Array).isRequired,
    corrects: PropTypes.instanceOf(Array).isRequired,
    costPoints: PropTypes.instanceOf(Array).isRequired,
    handleOnDrag: PropTypes.func.isRequired,
};

export default Charts;
