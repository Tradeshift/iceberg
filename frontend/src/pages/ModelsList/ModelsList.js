import React, { Component } from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Card from 'components/Card/Card';
import ModelsListStyles from './ModelsListStyles';


class ModelsList extends Component {
    constructor() {
        super();
        this.state = {
            models: [],
        };
    }

    componentDidMount() {
        fetch('/multi', {
            accept: 'application/json',
        })
            .then(results => results.json())
            .then(data => this.setState({ models: data }));
    }

    render() {
        const { models } = this.state;
        return (
            <ModelsListStyles>
                <Card title="Users and models">
                    <Table responsive striped bordered hover>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Model id</th>
                            </tr>
                        </thead>
                        <tbody>
                            {_.map(models, model => (
                                <tr>
                                    <th>{model.username}</th>
                                    <th>
                                        <Link to={`/model/${model.username}/${model.id}`}>
                                            {model.id}
                                        </Link>
                                    </th>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card>
            </ModelsListStyles>
        );
    }
}

export default ModelsList;
