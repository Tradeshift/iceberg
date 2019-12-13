import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'components/Chart/Chart';
import {
    getChartData,
    getChartOptions,
} from 'utils/chartConfigData';
import Card from '../../components/Card/Card';
import StatsChartStyles from './StatsChartStyles';
import colors from '../../utils/constants';

const StatsChart = (props) => {
    const {
        threshold,
        savedThreshold,
        minErrors,
        errors,
        maxErrors,
        minAbstains,
        abstains,
        maxAbstains,
        minCorrects,
        corrects,
        maxCorrects,
        handleOnDrag,
    } = props;

    const legendItems = [
        {
            name: 'Error',
            color: colors.lightred
        },
        {
            name: 'Abstain',
            color: colors.blue
        },
        {
            name: 'Correct',
            color: colors.lightgreen
        }
    ];

    return (
        <StatsChartStyles>
            <Card
                title="Threshold for suggestions"
                legendItems={legendItems}
                additionalNote="Shaded areas indicate 95% confidence regions"
                withLegend
            >
                <Chart
                    data={getChartData(
                        errors,
                        abstains,
                        corrects,
                        minErrors,
                        maxErrors,
                        minAbstains,
                        maxAbstains,
                        minCorrects,
                        maxCorrects,
                    )}
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
    minErrors: PropTypes.instanceOf(Array).isRequired,
    minAbstains: PropTypes.instanceOf(Array).isRequired,
    minCorrects: PropTypes.instanceOf(Array).isRequired,
    maxErrors: PropTypes.instanceOf(Array).isRequired,
    maxAbstains: PropTypes.instanceOf(Array).isRequired,
    maxCorrects: PropTypes.instanceOf(Array).isRequired,
    handleOnDrag: PropTypes.func.isRequired,
    savedThreshold: PropTypes.number,
};

StatsChart.defaultProps = {
    savedThreshold: null,
};

export default StatsChart;
