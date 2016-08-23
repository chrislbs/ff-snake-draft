'use strict';

import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Map, List, fromJS } from 'immutable';
import { buildProps } from '../utils';
//import { pushState } from 'redux-router';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { Nav } from '../components/nav';
import _ from 'lodash';
import moment from 'moment';
import classNames from 'classnames';

class App extends Component {

    static childContextTypes = {
        'url_query': PropTypes.any
    };

    // Initial state
    state = {
    };

    constructor(props) {
        super(props);
    }

    getChildContext() {
        const { url_query } = this.props;

        return { url_query };
    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {
    }

    componentDidUpdate(prevProps, prevState) {
    }

    render() {
        const { pathname, url_query, debug, children } = this.props;

        let nav = <Nav url_query={url_query} />;

        const loadingSpinner = <img src="/public/img/spinner.gif" className="loading-spinner" alt="Loading..." />;

        const contentWrapperClasses = classNames(['main-content-gutter container-fluid'], {'loading-wrapper': false});

        const appWrapperClasses = classNames(['app-wrapper'], {'error': false});

        return (
            <div id="app-wrapper" className={appWrapperClasses}>
                <div className="content-wrapper">
                    {nav}
                    <div className="main-content">
                        <div className={contentWrapperClasses}>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// Connects the Redux state to this component by updating props everytime the state changes.
export default connect(
    (state, ownProps) => {
        return {
            env: state.settings.get('env'),
            debug: state.settings.get('debug', false),
            pathname: ownProps.location.pathname,
            url_query: ownProps.location.query,
            url: ownProps.location.pathname + (ownProps.location.search !== '' ? ownProps.location.search : '?')
        };
    },
    // We also add action dispatchers to props so that we can kick off Redux actions from within the component.
    {
        pushState: push
    }
)(App);
