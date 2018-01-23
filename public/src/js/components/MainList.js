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
    }

    componentWillUnmount() {

    }

    init() {
        this.getTotal();
        this.getArticles();
    }

    async getTotal() {
        try {
            let msg = await fetchJson({
                type: 'GET',
                url: '/json/article/total',
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
                url: `/json/article/list?page=${this.state.page}&size=${this.state.size}`,
            });

            this.setState({
                articles: msg.data,
            });

        } catch (e) {
            // console.error(e); 
        }
    }

    setPages() {
        $('#pages').twbsPagination({
            totalPages: Math.ceil(this.state.total / this.state.size),
            visiblePages: 7,
            onPageClick: (event, page)=> {
                // console.log(page);
                this.setState({
                    page: page,
                });
                this.getArticles();
            }
        });
    }

    render() {
        let articleArray = this.state.articles.map((value, index)=> {
            return (
                <tr key={index}>
                    <td>{value.sort}</td>
                    <td>{value.title}</td>
                    <td>{value.datetime}</td>
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