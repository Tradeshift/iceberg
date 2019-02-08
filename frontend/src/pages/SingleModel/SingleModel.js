import 'chartjs-plugin-annotation';
import 'chartjs-plugin-draggable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import TopBar from 'modules/TopBar/TopBar';
import Stats from 'modules/Stats/Stats';
import { getValuePair, startDate, endDate } from 'utils/helpers';
import CostsInputs from '../../modules/CostsInputs/CostsInputs';
import Charts from '../../modules/Charts/Charts';
import SingleModelStyles from './SingleModelStyles';

class Model extends Component {
    constructor() {
        super();
        this.state = {
            errorCost: 0,
            abstainCost: 0,
            correctCost: 0,
            threshold: 0,
            outcomes: 0,
            samples: 0,
            stats: [{
                threshold: 0.00,
                correct: '',
                error: '',
                abstain: '',
            }],
            start: startDate,
            end: endDate,
        };

        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleOnDrag = this.handleOnDrag.bind(this);
    }

    componentWillMount() {
        const { match } = this.props;
        const { start, end } = this.state;

        fetch(
            `/multi/${match.params.username}/${match.params.modelId}/thresholds?from=${start}&to=${end}`, {
                accept: 'application/json',
            },
        )
            .then(results => results.json())
            .then((data) => {
                this.setState({
                    errorCost: data.model.errorCost,
                    abstainCost: data.model.abstainCost,
                    correctCost: data.model.correctCost,
                    threshold: data.model.threshold,
                    outcomes: data.outcomes,
                    samples: data.samples,
                    stats: data.stats,
                });
            });
    }

    handleOnChange = e => this.setState({
        [e.target.name]: e.target.value,
    });

    handleOnDrag = e => this.setState({
        threshold: e.subject.config.value,
    });

    handleOnSave = () => {
        const { match } = this.props;
        const {
            threshold,
            errorCost,
            abstainCost,
            correctCost,
        } = this.state;
        fetch(
            `/multi/${match.params.username}/${match.params.modelId}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: match.params.username,
                    id: match.params.modelId,
                    threshold,
                    errorCost,
                    abstainCost,
                    correctCost,
                }),
            },
        )
            .then(results => console.log('results', results));
    }

    render() {
        const { match } = this.props;
        const {
            errorCost,
            abstainCost,
            correctCost,
            threshold,
            outcomes,
            samples,
            stats,
            start,
            end,
        } = this.state;

        const errors = map(stats, stat => ({
            x: stat.threshold,
            y: Math.round(stat.error * 100),
        }));
        const abstains = map(stats, stat => ({
            x: stat.threshold,
            y: Math.round(stat.abstain * 100),
        }));
        const corrects = map(stats, stat => ({
            x: stat.threshold,
            y: Math.round(stat.correct * 100),
        }));
        const costPoints = map(stats, stat => ({
            x: stat.threshold,
            y: errorCost * stat.error
            + abstainCost * stat.abstain
            + correctCost * stat.correct,
        }));

        const averageCost = getValuePair(costPoints, threshold);
        const errorRate = getValuePair(errors, threshold);
        const abstainRate = getValuePair(abstains, threshold);
        const correctRate = getValuePair(corrects, threshold);

        return (
            <>
                <TopBar
                    modelId={match.params.modelId}
                    handleOnChange={this.handleOnChange}
                    start={start}
                    end={end}
                />
                <SingleModelStyles>
                    <Stats
                        samples={samples}
                        outcomes={outcomes}
                        errorRate={errorRate}
                        abstainRate={abstainRate}
                        correctRate={correctRate}
                        averageCost={averageCost}
                    />
                    <CostsInputs
                        threshold={threshold}
                        errorCost={errorCost}
                        abstainCost={abstainCost}
                        correctCost={correctCost}
                        handleOnChange={this.handleOnChange}
                        handleOnClick={this.handleOnSave}
                    />
                    <Charts
                        threshold={threshold}
                        errors={errors}
                        abstains={abstains}
                        corrects={corrects}
                        costPoints={costPoints}
                        handleOnDrag={this.handleOnDrag}
                    />
                </SingleModelStyles>
            </>
        );
    }
}

Model.propTypes = {
    match: PropTypes.instanceOf(Object).isRequired,
};

export default Model;