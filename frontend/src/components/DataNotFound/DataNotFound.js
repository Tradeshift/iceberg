import React from 'react';
import Card from 'components/Card/Card';
import warning from 'assets/warning-icon.svg';
import DataNotFoundStyles from './DataNotFoundStyles';

const DataNotFound = () => (
    <DataNotFoundStyles>
        <Card>
            <img src={warning} alt="data not found icon" />
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
