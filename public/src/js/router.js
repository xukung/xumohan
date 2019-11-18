import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from "react-router-dom";
import store from './store/';
import history from './libs/history';
import ErrorPage from './components/ErrorPage';
import ArticleLayout from './components/ArticleLayout';
import SortLayout from './components/SortLayout';
import ArticleDetail from './components/ArticleDetail';
import ArticleAdd from './components/ArticleAdd';
import SortAdd from './components/SortAdd';
import ArticleEdit from './components/ArticleEdit';
import SortEdit from './components/SortEdit';


ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Switch>
                <Route path="/article/list" component={ArticleLayout} />
                <Route path="/article/detail" component={ArticleDetail} />
                <Route path="/article/add" component={ArticleAdd} />
                <Route path="/article/edit" component={ArticleEdit} />

                <Route path="/sort/list" component={SortLayout} />
                <Route path="/sort/add" component={SortAdd} />
                <Route path="/sort/edit" component={SortEdit} />

                <Route component={ErrorPage} />
            </Switch>
        </Router>
    </Provider>,
    document.getElementById('APP')
);