import React from 'react';
import store from '../store';
import * as TYPE from '../libs/constTYPE';
import * as events from '../libs/customEvents';
import fetchJson from '../libs/fetchJson';

export default class MainList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
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
    }

    refreshList() {
        let currentSort = store.getState().project.currentSort;
        // console.log(currentSort);

        this.getTotal();
    }

    async getTotal() {
        try {
            let msg = await fetchJson({
                type: 'GET',
                url: '/json/article/total',
                data: {
                    sort: store.getState().project.currentSort,
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
                    sort: store.getState().project.currentSort,
                }
            });

            this.setState({
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
        $('#pages').twbsPagination({
            totalPages: totalPage,
            visiblePages: totalPage > 5 ? 5 : totalPage,
            onPageClick: (event, page)=> {
                // console.log(page);
                this.setState({
                    page: page,
                });

                this.getArticles();
            }
        });

        this.getArticles();
    }

    render() {
        let articleArray = this.state.articles.map((value, index)=> {
            return (
                <tr key={index}>
                    <td>{value.sort_name}</td>
                    <td>{value.title}</td>
                    <td>{value.datetime}</td>
                    <td>
                        <button type="button" className="btn btn-xs btn-success">修改</button>
                        <button type="button" className="btn btn-xs btn-danger">删除</button>
                    </td>
                </tr>
            );
        });

        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <table className="data" width="100%">
                            <thead>
                            <tr>
                                <th>分类</th>
                                <th>标题</th>
                                <th>日期</th>
                                <th>操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            {articleArray}
                            </tbody>
                        </table>
                        <div id="pages" className="page"></div>
                    </div>
                </div>
            </div>
        );
    }
}