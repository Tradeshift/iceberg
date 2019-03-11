import React from 'react';
import PropTypes from 'prop-types';
import { formatFloat, isNull } from 'utils/helpers';
import StatsStyles from './StatsStyles';

const Stats = (props) => {
    const {
        samples,
        outcomes,
        savedThreshold,
        correctRate,
        errorRate,
        abstainRate,
        averageCost,
    } = props;
    return (
        <StatsStyles>
            <div>
                <h5>Samples</h5>
                <p>{samples}</p>
            </div>
            <div>
                <h5>Classes</h5>
                <p>{outcomes}</p>
            </div>
            <div>
                <h5>Correct</h5>
                <p>{`${correctRate}%`}</p>
            </div>
            <div>
                <h5>Errors</h5>
                <p>{`${errorRate}%`}</p>
            </div>
            <div>
                <h5>Abstentions</h5>
                <p>{`${abstainRate}%`}</p>
            </div>
            <div>
                <h5>Average cost</h5>
                <p>{formatFloat(averageCost)}</p>
            </div>
            <div>
                <h5>Saved threshold</h5>
                <p>{isNull(savedThreshold) ? 'None saved' : formatFloat(savedThreshold)}</p>
            </div>
        </StatsStyles>
    );
};

Stats.propTypes = {
    samples: PropTypes.number.isRequired,
    outcomes: PropTypes.number.isRequired,
    correctRate: PropTypes.number.isRequired,
    errorRate: PropTypes.number.isRequired,
    abstainRate: PropTypes.number.isRequired,
    averageCost: PropTypes.number.isRequired,
    savedThreshold: PropTypes.number,
};

Stats.defaultProps = {
    savedThreshold: null,
};

export default Stats;
