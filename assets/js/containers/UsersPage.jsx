'use strict';

import React, { Component } from 'react';
import BasePage from './BasePage';
import { List } from 'immutable';
import { connect } from 'react-redux';
import { getAllUsers, createUser, deleteUser } from '../actions';
import { UserList } from '../components/users';
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

    handleCreateUser = (username, age) => {
        const { createUser } = this.props;

        createUser(username, age);
    };

    handleDeleteUser = (id) => {
        const { deleteUser } = this.props;

        deleteUser(id);
    };

    render() {
        const { fetching, users } = this.props;

        const loadingWrapperClasses = classNames('loading-fade-wrapper', {loading: fetching});

        const loadingSpinner = fetching ? <img src="/public/img/spinner.gif" className="loading-spinner" alt="Loading..." /> : '';

        return (
            <div className="page-wrapper users-page-wrapper row">
                <div className={loadingWrapperClasses}>
                    <div className="col-xs-12 page-title">
                        <UserList
                            users={users}
                            onCreateUser={this.handleCreateUser}
                            onDeleteUser={this.handleDeleteUser}
                        />
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
    { getAllUsers, createUser, deleteUser }
)(UsersPage);
