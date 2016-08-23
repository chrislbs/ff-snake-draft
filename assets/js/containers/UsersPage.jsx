'use strict';

import React, { Component } from 'react';
import BasePage from './BasePage';
import { List } from 'immutable';
import { connect } from 'react-redux';
import { getAllUsers } from '../actions';
import classNames from 'classnames';

class UsersPage extends BasePage {

    // Initial state
    state = {
        fetch_stack: List([])
    };

    constructor(props) {
        super(props);
    }

    fetchData = () => {
        const { getAllUsers }  = this.props;

        getAllUsers();
    };

    render() {
        const { fetching, users } = this.props;

        const loadingWrapperClasses = classNames('loading-fade-wrapper', {loading: fetching});

        const loadingSpinner = fetching ? <img src="/public/img/spinner.gif" className="loading-spinner" alt="Loading..." /> : '';

        return (
            <div className="page-wrapper users-page-wrapper row">
                <div className={loadingWrapperClasses}>
                    <div className="col-xs-12 page-title">
                        <h1>Users</h1> 
                        {/* This will be a list of users */}
                    </div>
                </div>
                {loadingSpinner}
            </div>
        );
    }
}

export default connect(
    // Redux state binding
    (state) => {
        return {
            fetching: state.users.get('fetching'),
            users: state.users.get('all')
        };
    },
    { getAllUsers }
)(UsersPage);
