import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table-v6';
import TopBar from 'components/TopBar/TopBar';
import ModelsListStyles from './ModelsListStyles';


class ModelsList extends Component {
    constructor() {
        super();
        this.state = {
            models: [],
            loading: false,
            totalPages: 1
        };
        this.timeout = null;
    }

    componentDidMount() {
        fetch(`/iceberg/multi/?page=0`, {
            accept: 'application/json',
        })
            .then(results => results.json())
            .then(data => {
                this.setState({ models: data.models, totalPages: data.numPages })
            })
            .catch(err => console.log(err));
    }

    fetchData(state) {
        this.setState({ loading: true });

        const baseUrl = `/iceberg/multi/?page=${state.page}`;

        if(state.filtered.length === 0) {
            // fetch data for that page
            fetch(baseUrl, {
                accept: 'application/json',
            })
                .then(results => results.json())
                .then(data => {
                    this.setState({ models: data.models, loading: false })
                })
                .catch(err => console.log(err));
        } else if (state.filtered.length > 0) {
            let searchUrl = baseUrl;

            state.filtered.forEach(filter => {
                searchUrl += `&${filter.id}=${filter.value}`;
            });

            if(this.timeout) {clearTimeout(this.timeout)}
            this.timeout = setTimeout(() => {
                // perform search
                fetch(searchUrl, {
                    accept: 'application/json',
                })
                    .then(results => results.json())
                    .then(data => {
                        this.setState({
                            models: data.models,
                            totalPages: data.numPages,
                            loading: false
                        })
                    })
                    .catch(err => console.log(err));
            }, 500);
        }
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
                        defaultPageSize={5} // the table will have a minimum of 5 rows - if a page has more than 5 rows it will show all of them; if it's less, it will fill up with empty rows
                        showPageSizeOptions={false}
                        pages={this.state.totalPages}
                        loading={this.state.loading}
                        filterable
                        manual // informs React Table that you'll be handling sorting and pagination server-side
                        onFetchData={(state) => this.fetchData(state)}
                    />
                </ModelsListStyles>
            </>
        );
    }
}

export default ModelsList;
