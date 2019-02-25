import React from 'react';
import Card from 'components/Card/Card';
import api from 'assets/api.svg';
import DataNotFoundStyles from './DataNotFoundStyles';

const DataNotFound = () => (
    <DataNotFoundStyles>
        <Card>
            <img src={api} alt="data not found icon" />
            <h4>No data found...</h4>
            <p>
                There is no data available for the selected dates.
                <br />
                Please try to pick another time interval.
            </p>
        </Card>
    </DataNotFoundStyles>
);

export default DataNotFound;
