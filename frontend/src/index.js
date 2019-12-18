import React from 'react';
import { hydrate, render } from 'react-dom';
import './index.css';
import 'unfetch/polyfill';
import 'abortcontroller-polyfill';
import App from './App';

const rootElement = document.getElementById('root');

if (rootElement.hasChildNodes()) {
    hydrate(<App />, rootElement);
} else {
    render(<App />, rootElement);
}
