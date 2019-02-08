import React from 'react';
import PropTypes from 'prop-types';
import TopBarStyles from './TopBarStyles';

const TopBar = ({
    modelId,
    handleOnChange,
    start,
    end,
}) => (
    <TopBarStyles>
        <div>
            <h1>{modelId}</h1>
        </div>
        <div className="timePicker">
            <span>From</span>
            <input
                type="date"
                className="datepicker"
                name="start"
                value={start}
                onChange={handleOnChange}
            />
            <span>To</span>
            <input
                type="date"
                name="end"
                className="datepicker"
                value={end}
                onChange={handleOnChange}
            />
        </div>
    </TopBarStyles>
);

TopBar.propTypes = {
    modelId: PropTypes.string.isRequired,
    handleOnChange: PropTypes.func.isRequired,
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
};

export default TopBar;
