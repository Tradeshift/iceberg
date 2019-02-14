import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import Card from 'components/Card/Card';
import TopBar from 'components/TopBar/TopBar';
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
            .then(data => this.setState({ models: data }))
            .catch(err => console.log(err));
    }

    render() {
        const { models } = this.state;
        const columns = [{
            Header: 'Users',
            accessor: 'username',
            Filter: ({ filter, onChange }) => (
                <div>
                    <i className="fas fa-search" />
                    <input
                        onChange={event => onChange(event.target.value)}
                        value={filter ? filter.value : ''}
                        placeholder="Search users"
                        style={{ border: 'none', background: 'none' }}
                    />
                </div>
            ),
        }, {
            Header: 'Models',
            accessor: 'id',
            Cell: ({ row }) => <Link to={`/model/${row.username}/${row.id}`}>{row.id}</Link>,
            Filter: ({ filter, onChange }) => (
                <div>
                    <i className="fas fa-search" />
                    <input
                        onChange={event => onChange(event.target.value)}
                        value={filter ? filter.value : ''}
                        placeholder="Search models"
                        style={{ border: 'none', background: 'none' }}
                    />
                </div>
            ),
        }];

        return (
            <>
                <TopBar
                    isFrontPage
                />
                <ModelsListStyles>
                    <Card>
                        <ReactTable
                            data={models}
                            columns={columns}
                            className="highlight"
                            defaultPageSize={15}
                            pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
                            filterable
                        />
                    </Card>
                </ModelsListStyles>
            </>
        );
    }
}

export default ModelsList;
