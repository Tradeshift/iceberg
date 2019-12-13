import React from 'react';
import PropTypes from 'prop-types';
import { Scatter } from 'react-chartjs-2';

const Chart = ({ data, options }) => (
    <div style={{ height: '100%' }}>
        <Scatter data={data} options={options} />
    </div>
);

Chart.propTypes = {
    data: PropTypes.instanceOf(Object),
    options: PropTypes.instanceOf(Object),
};

Chart.defaultProps = {
    data: {},
    options: {},
};

export default Chart;
