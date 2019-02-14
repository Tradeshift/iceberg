import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import Model from './pages/Model/Model';
import ModelsList from './pages/ModelsList/ModelsList';

const App = () => (
    <Router basename="/app">
        <>
            <Route exact path="/" component={ModelsList} />
            <Route path="/model/:username/:modelId" component={Model} />
        </>

    </Router>
);

export default App;
