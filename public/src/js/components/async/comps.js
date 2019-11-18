import React from 'react';
import loadable from '@loadable/component';


const Loadable_ArticleAdd = loadable(() => import('../comp/ArticleAdd'));
const Loadable_ArticleEdit = loadable(() => import('../comp/ArticleEdit'));
const Loadable_ArticleDetail = loadable(() => import('../comp/ArticleDetail'));
const Loadable_ArticleLayout = loadable(() => import('../comp/ArticleLayout'));

const Loadable_SortAdd = loadable(() => import('../comp/SortAdd'));
const Loadable_SortEdit = loadable(() => import('../comp/SortEdit'));
const Loadable_SortLayout = loadable(() => import('../comp/SortLayout'));


export class ArticleAdd extends React.Component {
    render() {
        return <Loadable_ArticleAdd />;
    }
}

export class ArticleEdit extends React.Component {
    render() {
        return <Loadable_ArticleEdit />;
    }
}

export class ArticleDetail extends React.Component {
    render() {
        return <Loadable_ArticleDetail />;
    }
}

export class ArticleLayout extends React.Component {
    render() {
        return <Loadable_ArticleLayout />;
    }
}

export class SortAdd extends React.Component {
    render() {
        return <Loadable_SortAdd />;
    }
}

export class SortEdit extends React.Component {
    render() {
        return <Loadable_SortEdit />;
    }
}

export class SortLayout extends React.Component {
    render() {
        return <Loadable_SortLayout />;
    }
}






