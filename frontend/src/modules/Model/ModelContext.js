
import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';

const ModelContext = React.createContext();

const ModelConsumer = ModelContext.Consumer;

// const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

class ModelProvider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            errorCost: '',
            abstainCost: '',
            correctCost: '',
            threshold: 0,
            outcomes: null,
            samples: null,
            stats: [{
                threshold: '',
                correct: '',
                error: '',
                abstain: '',
            }],
            handleOnChange: this.handleOnChange,
            handleOnDrag: this.handleOnDrag,
            setModelData: this.setModelData,
        };

        this.defaultState = this.state;
    }

    handleOnChange = e => this.setState({
        [e.target.name]: e.target.value,
    });

    handleOnDrag = e => this.setState({
        threshold: e.subject.config.value,
        // errorCost: data.model.errorCost,
        // abstainCost: data.model.abstainCost,
        // correctCost: data.model.correctCost,
    });

    setModelData = (data) => {
        const errors = map(data.stats, stat => ({
            x: stat.threshold,
            y: Math.round(stat.error * 100),
        }));
        const abstains = map(data.stats, stat => ({
            x: stat.threshold,
            y: Math.round(stat.abstain * 100),
        }));
        const corrects = map(data.stats, stat => ({
            x: stat.threshold,
            y: Math.round(stat.correct * 100),
        }));
        const costPoints = map(data.stats, stat => ({
            x: stat.threshold,
            y: data.model.errorCost * stat.error
            + data.model.abstainCost * stat.abstain
            + data.model.correctCost * stat.correct,
        }));

        this.setState({
            errorCost: data.model.errorCost,
            abstainCost: data.model.abstainCost,
            correctCost: data.model.correctCost,
            threshold: data.model.threshold,
            outcomes: data.outcomes,
            samples: data.samples,
            stats: data.stats,
            errors,
            abstains,
            corrects,
            costPoints,
        });
    };

    render() {
        const { children } = this.props;
        return (
            <ModelContext.Provider value={{ ...this.state }}>
                {children}
            </ModelContext.Provider>
        );
    }
}

ModelProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { ModelProvider, ModelConsumer };
