'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

/*********************************************************************************************************************
 * A simple component for a SPA nav bar. We use the Link component from react-router to define <a> tags so that all
 * link clicks result in a redux state change and AJAX request rather than a full page reload.
 *********************************************************************************************************************/
export class Nav extends Component {

    // {{{ PropTypes
    static propTypes = {
        url_query: PropTypes.object
    };
    // }}}

    constructor(props) {
        super(props);
    }

    render() {
        const { url_query } = this.props;

        // Only carry over the provider_ids, start, end, and timeframe url parameters to other pages
        let nav_query = {
        };

        return (
            <nav className="app-nav" role="navigation">
                <ul className="nav">
                    <li className="dropdown">
                        <Link to={{pathname: "/example/", query: nav_query}} activeClassName="active" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" id="dm3"><span className="glyphicon glyphicon-transfer"></span><br /><span className="nav-label">Example Section</span></Link>
                        <ul aria-labelledby="dm3" className="dropdown-menu right">
                            <li><Link to={{pathname: "/example/page/", query: nav_query}}>Example Page</Link></li>
                        </ul>
                    </li>
                </ul>
            </nav>
        );
    }
}
