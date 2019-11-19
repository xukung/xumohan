import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from "react-router-dom";
import store from './store/';
import history from './libs/history';
import ErrorPage from './components/comp/ErrorPage';

import {
    ArticleAdd,
    ArticleEdit,
    ArticleDetail,
    ArticleLayout,
    SortAdd,
    SortEdit,
    SortLayout,
} from './components/async/comps';

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Switch>
                <Route path="/article" exact component={ArticleLayout} />
                <Route path="/article/list" component={ArticleLayout} />
                <Route path="/article/detail" component={ArticleDetail} />
                <Route path="/article/add" component={ArticleAdd} />
                <Route path="/article/edit" component={ArticleEdit} />

                <Route path="/sort" exact component={SortLayout} />
                <Route path="/sort/list" component={SortLayout} />
                <Route path="/sort/add" component={SortAdd} />
                <Route path="/sort/edit" component={SortEdit} />

                <Route component={ErrorPage} />
            </Switch>
        </Router>
    </Provider>,
    document.getElementById('APP')
);