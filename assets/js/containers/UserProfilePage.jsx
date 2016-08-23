'use strict';

import React, { Component } from 'react';
import BasePage from './BasePage';
import { List } from 'immutable';
import { connect } from 'react-redux';
import { getUser } from '../actions';
import classNames from 'classnames';

class UserProfilePage extends BasePage {

    // Initial state
    state = {
        fetch_stack: List([])
    };

    constructor(props) {
        super(props);
    }

    fetchData = (id) => {
        const { getUser }  = this.props;

        getUser(id || this.props.user_id);
    };

    render() {
        const { fetching, user } = this.props;

        const loadingWrapperClasses = classNames('loading-fade-wrapper', {loading: fetching});

        const loadingSpinner = fetching ? <img src="/public/img/spinner.gif" className="loading-spinner" alt="Loading..." /> : '';

        return (
            <div className="page-wrapper user-profile-page-wrapper row">
                <div className={loadingWrapperClasses}>
                    <div className="col-xs-12 page-title">
                        <h1>User Profile</h1> 
                        {/* This will be a user profile */}
                    </div>
                </div>
                {loadingSpinner}
            </div>
        );
    }
}

export default connect(
    // Redux state binding
    (state, ownProps) => {
        return {
            fetching: state.users.get('fetching'),
            user_id: ownProps.params.id,
            user: state.users.get('active')
        };
    },
    { getUser }
)(UserProfilePage);
