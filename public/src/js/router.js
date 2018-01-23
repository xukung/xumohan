import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route, hashHistory, IndexRoute, browserHistory} from 'react-router';
import store from './store/';
import Base from './components/Base';
import ErrorPage from './components/ErrorPage';
import List from './components/List';
import Detail from './components/Detail';


ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={Base}>
                <IndexRoute component={List}/>
                <Route path="/list" component={List}/>
                <Route path="/detail" component={Detail}/>
            </Route>
            <Route path="/*" component={ErrorPage}/>
        </Router>
    </Provider>,
    document.getElementById('APP')
);