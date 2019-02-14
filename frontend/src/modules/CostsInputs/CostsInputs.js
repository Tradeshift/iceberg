import React from 'react';
import PropTypes from 'prop-types';
import Card from 'components/Card/Card';
import Button from 'components/Button/Button';
import Input from 'components/Input/Input';
import CostsInputsStyles from './CostsInputsStyles';

const CostsInputs = (props) => {
    const {
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
                <div className="inputWrapper">
                    <span>Cost of making an error</span>
                    <Input
                        type="number"
                        name="errorCost"
                        value={errorCost}
                        handleOnChange={handleOnChange}
                    />
                </div>
                <div className="inputWrapper">
                    <span>Cost of abstaining</span>
                    <Input
                        type="number"
                        name="abstainCost"
                        value={abstainCost}
                        handleOnChange={handleOnChange}
                    />
                </div>
                <div className="inputWrapper">
                    <span>Cost of making a correct classification</span>
                    <Input
                        type="number"
                        name="correctCost"
                        value={correctCost}
                        handleOnChange={handleOnChange}
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
    errorCost: PropTypes.number.isRequired,
    abstainCost: PropTypes.number.isRequired,
    correctCost: PropTypes.number.isRequired,
    handleOnChange: PropTypes.func.isRequired,
    handleOnClick: PropTypes.func.isRequired,
};

export default CostsInputs;
