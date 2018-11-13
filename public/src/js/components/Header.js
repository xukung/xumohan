import React from 'react';
import store from '../store';
import {browserHistory} from 'react-router';
import * as TYPE from '../libs/constTYPE';
import * as events from '../libs/customEvents';
import fetchJson from '../libs/fetchJson';
import utils from 'utils-xk';

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sorts: [],
        };
    }

    componentDidMount() {
        this.init();
    }

    componentWillUnmount() {

    }

    init() {
        this.getSorts();

        //回车提交表单
        $('#searchInput').keydown((event)=> {
            // console.info(event.keyCode);
            switch (event.keyCode) {
                case 13:
                    this.search();
                    break;
                default:
                    ;
            }
        });
    }

    async getSorts() {
        try {
            let msg = await fetchJson({
                type: 'GET',
                url: '/json/sort/list',
            });

            this.setState({
                sorts: msg.data,
            });

        } catch (e) {
            // console.error(e); 
        }
    }

    changeSort(id, e) {
        browserHistory.push(`/article/list?sort=${id}`);

        // store.dispatch({
        //     type: TYPE.SET_CURRENT_SORT,
        //     val: id,
        // });

        events.customEvent.emit(events.REFRESH_ARTICLE_LIST);

    }

    search() {
        browserHistory.push(`/article/list`);

        let keywords = $('#searchInput').val();
        store.dispatch({
            type: TYPE.SET_KEYWORDS,
            val: keywords,
        });

        events.customEvent.emit(events.REFRESH_ARTICLE_LIST);
    }

    render() {
        // console.log('render header');
        let currentSort = parseInt(store.getState().project.currentSort, 10);


        let sortsArray = this.state.sorts.map((value, index)=> {
            return (
                <li className={currentSort === value.id ? 'active' : ''}
                    key={index} onClick={this.changeSort.bind(this, value.id)}>
                    <a href="javascript:void(0)">{value.cname}</a>
                </li>
            )
        });


        return (
            <div className="">
                <nav className="blue">
                    <div className="nav-wrapper">
                        <ul id="nav-pc" className="left hide-on-small-only">
                            {sortsArray}
                        </ul>
                        <ul id="nav-mobile" className="sidenav">
                            {sortsArray}
                        </ul>
                        <div className="right  hide-on-small-only">
                            <div className="left">
                                <input type="text" name="keywords" id="searchInput" className="form-control"
                                       placeholder="Search"/>
                            </div>
                            <span className="white-text waves-effect waves-light"
                                  style={{width: '50px'}}
                                  onClick={this.search.bind(this)}
                            >
                                <i className="material-icons">search</i>
                            </span>
                        </div>
                        <div className="right">
                            <a href="#" data-target="nav-mobile" className="sidenav-trigger white-text"><i
                                className="material-icons">menu</i></a>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}