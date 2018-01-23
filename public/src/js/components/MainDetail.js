import React from 'react';
import store from '../store';
import * as TYPE from '../libs/constTYPE';
import * as events from '../libs/customEvents';
import fetchJson from '../libs/fetchJson';

export default class MainDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            article: {},
        };
    }

    componentDidMount() {
        this.init();
    }

    componentWillUnmount() {

    }

    init() {
        this.getArticle();
    }

    async getArticle() {
        function GetQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
            var r = window.location.search.substr(1).match(reg);
            if (r!=null) return (r[2]); return null;
        }

        let data = {
            id: GetQueryString("id"),
        };
        try {
            let msg = await fetchJson({
                type: 'GET',
                url: '/json/article/detail',
                data: data,
            });

            // console.log(msg.data);

            this.setState({
                article: msg.data,
            });

        } catch (e) {
            // console.error(e);
        }
    }


    render() {
        let a = this.state.article;
        console.log('a:', a);

        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-12 col-md-10 col-md-push-1">
                        <ol className="breadcrumb">
                            <li><a href="/news">文章</a></li>
                        </ol>
                        <h1 className="text-center">{a.title}</h1>
                        <div className="text-center">{a.datetime}</div>
                        <div id="note" dangerouslySetInnerHTML={{__html: a.note}}></div>
                    </div>
                </div>
            </div>
        );
    }
}