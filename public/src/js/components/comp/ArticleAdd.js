import React from 'react';
import store from '../../store';
import history from '../../libs/history';
import * as TYPE from '../../libs/constTYPE';
import * as events from '../../libs/customEvents';
import Header from './Header';
import fetchJson from '../../libs/fetchJson';
import utils from 'utils-xk';

export default class ArticleAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sorts: [],
            sort: 3,
        };
        this.editor = null;
    }

    componentDidMount() {
        this.init();
    }

    componentWillUnmount() {

    }

    init() {
        this.getSorts();
        this.initEditor();
    }

    /**
     * 不能放在KindEditor.ready里面执行,否则无法触发
     */
    initEditor() {
        this.editor = KindEditor.create('#note', {
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

    async addNew() {
        let data = {
            sort: $('#sorts').val(),
            title: $('#title').val(),
            note: this.editor.html(),
        };
        try {
            let msg = await fetchJson({
                type: 'POST',
                url: '/json/article/add',
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
                                <select  className="browser-default" id="sorts" value={this.state.sort}
                                         onChange={(e) => {
                                             this.setState({
                                                 sort: e.target.value,
                                             });
                                         }}>
                                >
                                    {
                                        sorts.map((value, index) => {
                                            return <option key={index} value={value.id}>{value.cname}</option>;
                                        })
                                    }
                                </select>
                            </div>
                            <div className="mt">
                                <input id="title" className="form-control" type="text" placeholder="标题"/>
                            </div>
                            <div className="mt">
                                <textarea id="note" className="form-control note" placeholder="内容" cols="30"
                                          rows="7"></textarea>
                            </div>
                            <div className="mt">
                                <button className="btn btn-default blue" onClick={this.addNew.bind(this)}>添加</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}