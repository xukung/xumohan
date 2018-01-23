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

    render() {
        let sortsArray = this.state.sorts.map((value, index)=> {
            return (
                <li className="nav-item" key={index}><a className="nav-link" href="#">{value.cname}</a></li>
            )
        });


        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <a className="navbar-brand" href="#">Navbar</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            {sortsArray}
                        </ul>
                    </div>
                </nav>
            </div>
        );
    }
}