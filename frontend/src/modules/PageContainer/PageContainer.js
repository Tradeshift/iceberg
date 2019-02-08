import React from 'react';
import PropTypes from 'prop-types';
import PageContainerStyles from './PageContainerStyles';

const PageContainer = ({ children }) => (
    <PageContainerStyles>
        { children }
    </PageContainerStyles>
);

PageContainer.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PageContainer;
