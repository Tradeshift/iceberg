/* eslint-disable jsx-a11y/accessible-emoji */
import 'chartjs-plugin-annotation';
import 'chartjs-plugin-draggable';
import React from 'react';
import PropTypes from 'prop-types';
import { map, isEmpty } from 'lodash';
import FeedbackModal from 'components/FeedbackModal/FeedbackModal';
import DataNotFound from 'components/DataNotFound/DataNotFound';
import TopBar from 'components/TopBar/TopBar';
import Stats from 'modules/Stats/Stats';
import CostsInputs from 'modules/CostsInputs/CostsInputs';
import StatsChart from 'modules/StatsChart/StatsChart';
import CostChart from 'modules/CostChart/CostChart';
import {
    getValuePair,
    formatFloat,
    startDate,
    endDate,
    isNull,
} from 'utils/helpers';
import ModelStyles from './ModelStyles';


class Model extends React.Component {
    constructor() {
        super();
        this.state = {
            errorCost: 0,
            abstainCost: 0,
            correctCost: 0,
            threshold: 0,
            savedThreshold: 0,
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
            showSuccessModal: false,
            showErrorModal: false,
            noData: true,
        };

        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleOnDrag = this.handleOnDrag.bind(this);
    }

    componentWillMount() {
        const { match } = this.props;
        const { start, end } = this.state;

        this.fetchModelData(match, start, end);
    }

    handleOnChange = e => this.setState({
        [e.target.name]: e.target.value,
    });

    handleChangeDate = () => {
        const { match } = this.props;
        const { start, end } = this.state;

        this.fetchModelData(match, start, end);
    }

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
            `/iceberg/multi/${match.params.username}/${match.params.modelId}`,
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
            .then((res) => {
                if (res.ok) {
                    this.setState({
                        showSuccessModal: true,
                        savedThreshold: threshold,
                    });
                } else {
                    this.setState({
                        showErrorModal: true,
                    });
                }
            });
    }

    handleModalClose = () => this.setState({
        showSuccessModal: false,
        showErrorModal: false,
    });

    fetchModelData = (match, start, end) => {
        fetch(
            `/iceberg/multi/${match.params.username}/${match.params.modelId}/thresholds?from=${start}&to=${end}`, {
                accept: 'application/json',
            },
        )
            .then(results => results.json())
            .then((data) => {
                this.setState({
                    errorCost: data.model.errorCost,
                    abstainCost: data.model.abstainCost,
                    correctCost: data.model.correctCost,
                    threshold: isNull(data.model.threshold) ? 0 : data.model.threshold,
                    savedThreshold: data.model.threshold,
                    outcomes: data.outcomes,
                    samples: data.samples,
                    stats: data.stats,
                    noData: isEmpty(data.stats),
                });
            })
            .catch(err => console.log(err));
    }

    render() {
        const { match } = this.props;
        const {
            errorCost,
            abstainCost,
            correctCost,
            threshold,
            savedThreshold,
            outcomes,
            samples,
            stats,
            start,
            end,
            showSuccessModal,
            showErrorModal,
            noData,
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
            y: formatFloat(errorCost * stat.error
            + abstainCost * stat.abstain
            + correctCost * stat.correct),
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
                    handleChangeDate={this.handleChangeDate}
                    start={start}
                    end={end}
                />
                <ModelStyles>
                    <Stats
                        samples={samples}
                        outcomes={outcomes}
                        savedThreshold={savedThreshold}
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
                        noData={noData}
                        handleOnChange={this.handleOnChange}
                        handleOnClick={this.handleOnSave}
                    />
                    {
                        noData ? <DataNotFound />
                            : (
                                <StatsChart
                                    threshold={threshold}
                                    savedThreshold={savedThreshold}
                                    errors={errors}
                                    abstains={abstains}
                                    corrects={corrects}
                                    handleOnDrag={this.handleOnDrag}
                                />
                            )
                    }
                    {
                        noData ? <DataNotFound />
                            : (
                                <CostChart
                                    threshold={threshold}
                                    savedThreshold={savedThreshold}
                                    costPoints={costPoints}
                                    handleOnDrag={this.handleOnDrag}
                                />
                            )
                    }
                    <FeedbackModal
                        showSuccessModal={showSuccessModal}
                        showErrorModal={showErrorModal}
                        handleModalClose={this.handleModalClose}
                    />
                </ModelStyles>
            </>
        );
    }
}

Model.propTypes = {
    match: PropTypes.instanceOf(Object).isRequired,
};

export default Model;
