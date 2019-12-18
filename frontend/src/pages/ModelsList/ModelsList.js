import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import debounce from 'lodash/debounce';
import ReactTable from 'react-table-v6';
import TopBar from 'components/TopBar/TopBar';
import ModelsListStyles from './ModelsListStyles';


class ModelsList extends Component {
    constructor() {
        super();
        this.state = {
            models: [],
            loading: false,
            totalPages: 1,
            usernameSearchTerm: null,
            idSearchTerm: null,
            filtered: undefined
        };
        this.timeout = null;
    }

    fetchData(url) {
        fetch(url, {
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
    }

    componentDidMount() {        
        this.fetchData('/iceberg/multi/?page=0');
    }

    updateData(state) {
        this.setState({ loading: true });
        const baseUrl = `/iceberg/multi/?page=${state.page}`;

        function getResults() {
            if(state.filtered.length === 0) {
                // fetch data for that page
                this.fetchData(baseUrl);
            } else if (state.filtered.length > 0) {
                let searchUrl = baseUrl;

                state.filtered.forEach(filter => {
                    searchUrl += `&${filter.id}=${filter.value}`;
                });

                // perform search
                this.fetchData(searchUrl);
            }
        }

        if(this.timeout) {this.timeout.cancel()}
        
        // the function returned by debounce will only be invoked once, after it stops being called for 400ms
        // this is to prevent sending too many requests when the users type into the search box
        this.timeout = debounce(getResults, 400);

        this.timeout();
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
                        onFetchData={(state) => this.updateData(state)}
                    />
                </ModelsListStyles>
            </>
        );
    }
}

export default ModelsList;
