import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route, hashHistory, IndexRoute, browserHistory} from 'react-router';

// Material-UI
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();//injectTapEventPlugin(): Can only be called once per application lifecycle.

import store from './store/';
import Base from './components/Base';
import ErrorPage from './components/ErrorPage';
import List from './components/List';


ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={Base}>
                <IndexRoute component={List}/>
                <Route path="/list" component={List}/>
            </Route>
            <Route path="/*" component={ErrorPage}/>
        </Router>
    </Provider>,
    document.getElementById('APP')
);