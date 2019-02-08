import React from 'react';
import PropTypes from 'prop-types';
import { formatFloat } from 'utils/helpers';
import Card from 'components/Card/Card';
import Button from 'components/Button/Button';
import CostsInputsStyles from './CostsInputsStyles';

const CostsInputs = (props) => {
    const {
        threshold,
        errorCost,
        abstainCost,
        correctCost,
        handleOnChange,
        handleOnClick,
    } = props;
    return (
        <CostsInputsStyles>
            <Card>
                <p>
                    By setting a threshold you can make the classifier abstain
                    unless its score is above the threshold.
                    This can be useful in cases where
                    abstaining cost less than making errors.
                </p>
                <p>
                    Specify the average cost of the different outcomes and
                    select the threshold that minimizes the average cost.
                </p>
                <h5>{`Threshold: ${formatFloat(threshold)}`}</h5>
                <div className="inputWrapper">
                    <span>Cost of making an error</span>
                    <input
                        type="number"
                        name="errorCost"
                        value={errorCost}
                        onChange={handleOnChange}
                    />
                </div>
                <div className="inputWrapper">
                    <span>Cost of abstaining</span>
                    <input
                        type="number"
                        name="abstainCost"
                        value={abstainCost}
                        onChange={handleOnChange}
                    />
                </div>
                <div className="inputWrapper">
                    <span>Cost of making a correct classification</span>
                    <input
                        type="number"
                        name="correctCost"
                        value={correctCost}
                        onChange={handleOnChange}
                    />
                </div>
                <span className="info">
                    Drag the threshold on the graph to the right.
                </span>
                <Button handleOnClick={handleOnClick}>
                    Update &amp; save threshold
                </Button>
            </Card>
        </CostsInputsStyles>
    );
};

CostsInputs.propTypes = {
    threshold: PropTypes.number.isRequired,
    errorCost: PropTypes.number.isRequired,
    abstainCost: PropTypes.number.isRequired,
    correctCost: PropTypes.number.isRequired,
    handleOnChange: PropTypes.func.isRequired,
    handleOnClick: PropTypes.func.isRequired,
};

export default CostsInputs;
