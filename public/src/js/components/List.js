import React from 'react';
import store from '../store';
import * as TYPE from '../libs/constTYPE';
import * as events from '../libs/customEvents';
import Header from './Header';
import MainList from './MainList';

export default class List extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        return (
            <div>
                <Header/>
                <MainList/>
            </div>
        );
    }
}