import React, { Component } from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';


class DataTable extends Component {
    constructor() {
        super();
        this.state = {
            models: [],
        };
    }

    componentDidMount() {
        const header = new Headers({
            'Access-Control-Allow-Origin': '*',
        });
        fetch('http://localhost:8080/1/multi', {
            accept: 'application/json',
            headers: header,
        })
            .then(results => results.json())
            .then(data => this.setState({ models: data }));
    }

    render() {
        const { models } = this.state;
        return (
            <div>
                <h1>Users and models</h1>

                <Table responsive>
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
            </div>
        );
    }
}

export default DataTable;
