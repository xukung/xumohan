import React from 'react';
import store from '../store';
import * as TYPE from '../libs/constTYPE';
import * as events from '../libs/customEvents';
import fetchJson from '../libs/fetchJson';

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sorts: [1, 2],
        };
    }

    componentDidMount() {
        this.init();
    }

    componentWillUnmount() {

    }

    init() {
        this.getSorts();
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

    changeSort(e) {
        let tar = e.currentTarget;
        let id = tar.dataset.id;
        console.log(id);
    }

    render() {
        let sortsArray = this.state.sorts.map((value, index)=> {
            return (
                <li className="" key={index} data-id={value.id} onClick={this.changeSort.bind(this)}>
                    <a className="btn" href="javascript:void(0)">{value.cname}</a>
                </li>
            )
        });


        return (
            <div>
                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="#">Brand</a>
                        </div>

                        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                            <ul className="nav navbar-nav">
                                {sortsArray}
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}