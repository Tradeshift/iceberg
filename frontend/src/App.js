import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PageContainer from './modules/PageContainer/PageContainer';
import SingleModel from './pages/SingleModel/SingleModel';
import ModelsList from './pages/ModelsList/ModelsList';

const App = () => (
    <Router>
        <PageContainer>
            <Route exact path="/" component={ModelsList} />
            <Route path="/model/:username/:modelId" component={SingleModel} />
        </PageContainer>

    </Router>
);

export default App;
