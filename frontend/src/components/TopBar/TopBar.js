import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import TopBarStyles from './TopBarStyles';
import Button from '../Button/Button';
import Input from '../Input/Input';

const TopBar = ({
    modelId,
    handleOnChange,
    handleChangeDate,
    isFrontPage,
    start,
    end,
}) => (
    <TopBarStyles>
        {isFrontPage ? (
            <h1>Users and models</h1>
        ) : (
            <h1>
                <Link to="/">Users and models</Link>
                {` / ${modelId}`}
            </h1>
        )}
        {!isFrontPage && (
            <div className="timePicker">
                <span>From</span>
                <Input
                    type="date"
                    className="datepicker"
                    name="start"
                    value={start}
                    handleOnChange={handleOnChange}
                />
                <span>To</span>
                <Input
                    type="date"
                    name="end"
                    className="datepicker"
                    value={end}
                    handleOnChange={handleOnChange}
                />
                <Button handleOnClick={handleChangeDate} secondary>Apply dates</Button>
            </div>
        )}
    </TopBarStyles>
);

TopBar.propTypes = {
    modelId: PropTypes.string,
    handleOnChange: PropTypes.func,
    handleChangeDate: PropTypes.func,
    isFrontPage: PropTypes.bool,
    start: PropTypes.string,
    end: PropTypes.string,
};

TopBar.defaultProps = {
    modelId: '',
    handleOnChange: null,
    handleChangeDate: null,
    isFrontPage: false,
    start: '',
    end: '',
};

export default TopBar;
