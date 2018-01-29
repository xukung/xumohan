import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route, hashHistory, IndexRoute, browserHistory} from 'react-router';
import store from './store/';
import Base from './components/Base';
import ErrorPage from './components/ErrorPage';
import List from './components/List';
import Detail from './components/Detail';
import ArticleAdd from './components/ArticleAdd';
import ArticleEdit from './components/ArticleEdit';


ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={Base}>
                <IndexRoute component={List}/>
                <Route path="/article/list" component={List}/>
                <Route path="/article/detail" component={Detail}/>
                <Route path="/article/add" component={ArticleAdd}/>
            </Route>
            <Route path="/*" component={ErrorPage}/>
        </Router>
    </Provider>,
    document.getElementById('APP')
);