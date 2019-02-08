import 'chartjs-plugin-annotation';
import 'chartjs-plugin-draggable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { map, findKey } from 'lodash';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Chart from 'components/Chart/Chart';
import {
    getChartData,
    getLineData,
    getChartOptions,
    getLineOptions,
} from 'utils/chartConfigData';
import TopBar from '../TopBar/TopBar';

class Model extends Component {
    constructor() {
        super();
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
        };

        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleOnDrag = this.handleOnDrag.bind(this);
    }

    componentWillMount() {
        const { match } = this.props;
        const header = new Headers({
            'Access-Control-Allow-Origin': '*',
        });
        fetch(
            `http://localhost:8080/1/multi/${match.params.username}/${match.params.modelId}/thresholds?from=2019-01-01&to=2019-01-30`,
            {
                accept: 'application/json',
                headers: header,
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
        } = this.state;

        const formatFloat = n => parseFloat(n.toFixed(3).slice(0, -1));

        const getValuePair = (arr, value) => {
            const key = arr ? findKey(arr, ['x', formatFloat(value)]) : 0;
            return key ? arr[parseInt(key, 10)].y : 0;
        };

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
                <TopBar modelId={match.params.modelId} />
                <Row className="mt-5">
                    <Col>
                        <Row>
                            <Col>
                                <h5>Samples</h5>
                            </Col>
                            <Col>
                                <p>{samples}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <h5>Classes</h5>
                            </Col>
                            <Col>
                                <p>{outcomes}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <h5>Threshold</h5>
                            </Col>
                            <Col>
                                <p>{formatFloat(threshold)}</p>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <Col>
                                <h5>Correct</h5>
                            </Col>
                            <Col>
                                <p>{`${correctRate} %`}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <h5>Errors</h5>
                            </Col>
                            <Col>
                                <p>{`${errorRate} %`}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <h5>Abstentions</h5>
                            </Col>
                            <Col>
                                <p>{`${abstainRate} %`}</p>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col md="8">
                        <h2>Abstain threshold</h2>
                        <Chart
                            data={getChartData(errors, abstains, corrects)}
                            options={getChartOptions(threshold, this.handleOnDrag)}
                        />
                        <Chart
                            data={getLineData(costPoints)}
                            options={getLineOptions(threshold, this.handleOnDrag)}
                        />
                    </Col>
                    <Col md="4">
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
                        <Form>
                            <Form.Control
                                type="number"
                                name="errorCost"
                                value={errorCost}
                                onChange={this.handleOnChange}
                            />
                            <Form.Text className="text-muted">
                                Cost of making an error
                            </Form.Text>
                            <Form.Control
                                type="number"
                                name="abstainCost"
                                value={abstainCost}
                                onChange={this.handleOnChange}
                            />
                            <Form.Text className="text-muted">
                                Cost of abstaining
                            </Form.Text>
                            <Form.Control
                                type="number"
                                name="correctCost"
                                value={correctCost}
                                onChange={this.handleOnChange}
                            />
                            <Form.Text className="text-muted">
                                Cost of making a correct classification
                            </Form.Text>
                        </Form>
                        <Row>
                            <Col>
                                <h5>Average cost</h5>
                            </Col>
                            <Col>
                                <p>{formatFloat(averageCost)}</p>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </>
        );
    }
}

Model.propTypes = {
    match: PropTypes.instanceOf(Object).isRequired,
};

export default Model;
