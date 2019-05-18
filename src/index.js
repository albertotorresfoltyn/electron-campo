import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import { Provider as ReduxProvider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import configureStore from './data/store';

const reduxStore = configureStore();
ReactDOM.render(
    <ReduxProvider store = {reduxStore}>
        <App tuvieja="entanga"/>
    </ReduxProvider>
    , document.getElementById('root'));

serviceWorker.unregister();
