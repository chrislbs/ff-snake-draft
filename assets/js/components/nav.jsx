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
                    {/* Home button */}
                    <li>
                        <Link to={{pathname: "/", query: nav_query}}>
                            <span className="glyphicon glyphicon-home"></span><br /><span className="nav-label">Dashboard</span>
                        </Link>
                    </li>

                    {/* Players nav menu */}
                    <li className="dropdown">
                        <Link to={{pathname: "/players/", query: nav_query}} activeClassName="active" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" id="dm1">
                            <span className="glyphicon glyphicon-star"></span><br /><span className="nav-label">Players</span>
                        </Link>

                        <ul aria-labelledby="dm1" className="dropdown-menu right">
                            <li><Link to={{pathname: "/players/", query: nav_query}} activeClassName="active">All Players</Link></li>
                        </ul>
                    </li>

                    {/* Users nav menu */}
                    <li className="dropdown">
                        <Link to={{pathname: "/users/", query: nav_query}} activeClassName="active" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" id="dm2">
                            <span className="glyphicon glyphicon-user"></span><br /><span className="nav-label">Users</span>
                        </Link>

                        <ul aria-labelledby="dm2" className="dropdown-menu right">
                            <li><Link to={{pathname: "/users/", query: nav_query}} activeClassName="active">All Users</Link></li>
                        </ul>
                    </li>
                </ul>
            </nav>
        );
    }
}
