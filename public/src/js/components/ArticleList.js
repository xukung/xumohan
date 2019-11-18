import React from 'react';
import history from '../libs/history';
import store from '../store';
import * as TYPE from '../libs/constTYPE';
import * as events from '../libs/customEvents';
import fetchJson from '../libs/fetchJson';
import utils from 'utils-xk';

export default class ArticleList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            login: false,
            articles: [],
            total: 0,
            page: 1,
            size: 10,
        };
    }

    componentDidMount() {
        this.init();
        events.customEvent.on(events.REFRESH_ARTICLE_LIST, this.refreshList.bind(this));
    }

    componentWillUnmount() {

    }

    init() {
        this.setState({
            articles: [],
            total: 0,
            page: 1,
            size: 10,
        });

        this.getTotal();

        $('.fixed-action-btn').floatingActionButton();
    }

    refreshList() {
        this.getTotal();
    }

    async getTotal() {
        try {
            let msg = await fetchJson({
                type: 'GET',
                url: '/json/article/total',
                data: {
                    sort: utils.getQueryString('sort') || 0,
                    keywords: utils.getQueryString('keywords'),
                },
            });

            this.setState({
                total: msg.data,
            });

            this.setPages();
        } catch (e) {
            // console.error(e); 
        }
    }

    async getArticles() {
        try {
            let msg = await fetchJson({
                type: 'GET',
                url: `/json/article/list`,
                data: {
                    page: this.state.page,
                    size: this.state.size,
                    sort: utils.getQueryString('sort') || 0,
                    keywords: store.getState().project.keywords,
                }
            });

            this.setState({
                login: msg.login,
                articles: msg.data,
            });

        } catch (e) {
            // console.error(e); 
        }
    }

    setPages() {

        let totalPage = Math.ceil(this.state.total / this.state.size);
        // console.log('totalPage:', totalPage);

        $('#pages').twbsPagination('destroy');

        if (totalPage > 0) {
            $('#pages').twbsPagination({
                totalPages: totalPage,
                visiblePages: totalPage > 8 ? 8 : totalPage,
                onPageClick: (event, page) => {
                    // console.log(page);
                    this.setState({
                        page: page,
                    });

                    this.getArticles();
                },
                first: '&laquo;',
                prev: '<',
                next: '>',
                last: '&raquo;',
            });
        } else {
            this.getArticles();
        }

    }

    editArticle(e) {
        let tar = e.currentTarget;
        let id = parseInt($(tar).attr('data-id'), 10);

        store.dispatch({
            type: TYPE.SET_CURRENT_ARTICLE,
            val: id,
        });

        browserHistory.push(`/article/edit`);
    }

    delArticle(e) {
        let tar = e.currentTarget;
        let $tr = $(tar).closest('tr');
        let id = $tr.attr('data-id');
        let title = $tr.attr('data-title');
        // console.info(id);

        let r = window.confirm(`确认删除" ${title} "吗?`);
        if (r === true) {
            this.del(parseInt(id, 10));
        }
    }

    async del(id) {
        let data = {
            id: id,
        };
        try {
            let msg = await fetchJson({
                type: 'GET',
                url: '/json/article/del',
                data: data,
            });

            if (msg.status === 'success') {
                this.refreshList();
            }
        } catch (e) {
            // console.error(e);
        }
    }

    render() {
        let articleArray = this.state.articles.map((value, index) => {
            return (
                <tr key={index} data-id={value.id} data-title={value.title} onDoubleClick={(e) => {
                    if (this.state.login === true) {
                        location.href = `/article/edit?id=${value.id}`;
                    }
                }}>
                    <td>{value.sort_name}</td>
                    <td><a href={`/article/detail?id=${value.id}`} target="_blank">{value.title}</a></td>
                    <td>{value.datetime}</td>
                    <td>
                        {
                            this.state.login === true ? (
                                <button type="button" className="btn btn-small btn-flat transparent"
                                        onClick={this.delArticle.bind(this)}>
                                    <i className="material-icons red-text">delete</i>
                                </button>
                            ) : null
                        }
                    </td>
                </tr>
            );
        });

        return (
            <div className="container">
                <div className="row">
                    <div className="col s12">

                        <div className="fixed-action-btn">
                            <a className="btn-floating btn-large red" onClick={(e) => {
                                location.href = `/article/add`;
                            }}>
                                <i className="large material-icons">add</i>
                            </a>
                            <ul>
                                <li onClick={(e) => {
                                    location.href = `/it`;
                                }}><a className="btn-floating red"><i className="material-icons">flash_on</i></a></li>
                                <li onClick={(e) => {
                                    location.href = `/code`;
                                }}><a className="btn-floating yellow darken-1"><i
                                    className="material-icons">code</i></a></li>
                                <li><a className="btn-floating green" onClick={(e) => {
                                    location.href = `/logout`;
                                }}><i className="material-icons">exit_to_app</i></a></li>
                                <li><a className="btn-floating blue" onClick={(e) => {
                                    location.href = `/login`;
                                }}><i className="material-icons">vpn_key</i></a></li>
                            </ul>
                        </div>

                        <table className="data" width="100%">
                            <thead>
                            <tr>
                                <th width="10%">分类</th>
                                <th width="60%">标题</th>
                                <th width="20%">日期</th>
                                <th width="10%">{this.state.login === true ? '操作' : ' '}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {articleArray}
                            </tbody>
                        </table>
                        <div id="pages" className="pagination mt-20 center"></div>
                    </div>
                </div>
            </div>
        );
    }
}