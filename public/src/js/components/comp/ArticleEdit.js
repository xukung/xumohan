import React from 'react';
import store from '../../store';
import history from '../../libs/history';
import * as TYPE from '../../libs/constTYPE';
import * as events from '../../libs/customEvents';
import Header from './Header';
import fetchJson from '../../libs/fetchJson';
import utils from 'utils-xk';

export default class ArticleEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            sort: 3,
            sorts: [],
            article: {},
        };
        this.editor = null;
    }

    componentDidMount() {
        this.init();
    }

    componentWillUnmount() {

    }

    init() {
        this.setState({
            id: utils.getQueryString('id'),
        }, (e) => {
            this.getSorts();
            this.getData();
            this.initEditor();
        });


    }

    initEditor() {
        this.editor = KindEditor.create('#note2', {
            height: '350px',
            items: [
                'clearhtml', 'quickformat', 'source', 'code', '|',
                'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', '|',
                'formatblock', 'fontname', 'fontsize', '|',
                'forecolor', 'hilitecolor', 'bold', 'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|',
                'unlink', 'link',
            ],
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
            }, () => {

            });

        } catch (e) {
            // console.error(e); 
        }
    }

    async getData() {
        let data = {
            id: this.state.id,
        };

        try {
            let msg = await fetchJson({
                type: 'GET',
                url: '/json/article/detail',
                data: data,
            });

            this.setState({
                article: msg.data,
                sort: msg.data.sort,
            }, (e) => {
                $('#sorts2').val(msg.data.sort);
                $('#title2').val(msg.data.title);
                // $('#note2').val(msg.data.note);
                this.editor.html(msg.data.note);

            });


        } catch (e) {
            // console.error(e); 
        }
    }

    async editArticle() {
        let data = {
            id: this.state.article.id,
            sort: $('#sorts2').val(),
            title: $('#title2').val(),
            note: this.editor.html(),
        };
        try {
            let msg = await fetchJson({
                type: 'POST',
                url: '/json/article/edit',
                data: data,
            });

            if (msg.status === 'success') {
                history.push(`/article/list`);
            }
        } catch (e) {
            // console.error(e);
        }
    }

    render() {
        let sorts = this.state.sorts || [];

        return (
            <div>
                <Header/>
                <div className="container">
                    <div className="row">
                        <div className="col s12 m10 offset-m1">
                            <div style={{width: '150px'}}>
                                <select className="browser-default" id="sorts2" value={this.state.sort}
                                        onChange={(e) => {
                                            this.setState({
                                                sort: e.target.value,
                                            });
                                        }}
                                >
                                    {
                                        sorts.map((value, index) => {
                                            return <option key={index} value={value.id}>{value.cname}</option>;
                                        })
                                    }
                                </select>
                            </div>
                            <div className="mt">
                                <input id="title2" className="form-control" type="text" placeholder="标题"
                                       defaultValue={this.state.article.title}/>
                            </div>
                            <div className="mt">
                                <textarea id="note2" className="form-control note" placeholder="内容" cols="30"
                                          rows="10" defaultValue={this.state.article.note}></textarea>
                            </div>
                            <div className="mt">
                                <button className="btn btn-default blue" onClick={this.editArticle.bind(this)}>修改
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}