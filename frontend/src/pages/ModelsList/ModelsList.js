import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
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
        fetch('/iceberg/multi', {
            accept: 'application/json',
        })
            .then(results => results.json())
            .then(data => this.setState({ models: data }))
            .catch(err => console.log(err));
    }

    render() {
        const { models } = this.state;
        const columns = [{
            accessor: 'username',
            Filter: ({ filter, onChange }) => (
                <div className="table-search">
                    <i className="fas fa-search" />
                    <input
                        onChange={event => onChange(event.target.value)}
                        value={filter ? filter.value : ''}
                        placeholder="Users"
                        style={{ border: 'none', background: 'none' }}
                    />
                </div>
            ),
        }, {
            accessor: 'id',
            Cell: ({ row }) => <Link to={`/model/${row.username}/${row.id}`}>{row.id}</Link>,
            Filter: ({ filter, onChange }) => (
                <div className="table-search">
                    <i className="fas fa-search" />
                    <input
                        onChange={event => onChange(event.target.value)}
                        value={filter ? filter.value : ''}
                        placeholder="Models"
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
                    <ReactTable
                        data={models}
                        columns={columns}
                        className="highlight"
                        defaultPageSize={15}
                        pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
                        filterable
                    />
                </ModelsListStyles>
            </>
        );
    }
}

export default ModelsList;
