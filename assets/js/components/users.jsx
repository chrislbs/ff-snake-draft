'use strict';

import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';

export class UserList extends Component {

    // {{{ PropTypes
    static propTypes = {
        'users': ImmutablePropTypes.listOf(
            ImmutablePropTypes.contains({
                'id': PropTypes.number.isRequired,
                'username': PropTypes.string.isRequired,
                'age': PropTypes.string
            })
        ),
        'onDeleteUser': PropTypes.func.isRequired
    };
    // }}}

    constructor(props) {
        super(props);
    }

    handleDeleteUser = (user) => {
        const { onDeleteUser } = this.props;

        onDeleteUser(user.get('id'));
    };

    render() {
        const { users } = this.props;

        return (
            <div className="db-list-wrapper">
                <h1>Users</h1> 
                <ul className="db-list">
                    {/* Column Headers */}
                    <li key={-1} className="db-list-headers">
                        <div className="val id"><label>ID</label></div>
                        <div className="val username"><label>Username</label></div>
                        <div className="val age"><label>Age</label></div>
                        <div className="actions"><label>Actions</label></div>
                    </li>

                    {/* User list items */}
                    {users ?
                        users.map((user, i) => {
                            return <UserListItem key={i} user={user} onDelete={this.handleDeleteUser.bind(this, user)} />;
                        })
                            : <li key={0}>There are no users in the database</li>
                    }
                </ul>
            </div>
        );
    }
}

export class UserListItem extends Component {
    // {{{ PropTypes
    static propTypes = {
        'user': ImmutablePropTypes.contains({
            'id': PropTypes.number.isRequired,
            'username': PropTypes.string.isRequired,
            'age': PropTypes.string
        }).isRequired,
        'onDelete': PropTypes.func.isRequired
    };
    // }}}

    constructor(props) {
        super(props);
    }

    handleDelete = () => {
        const { user, onDelete } = this.props;

        onDelete(user);
    };

    render() {
        const { user } = this.props;

        return (
            <li className="db-list-item">
                <div className="val id">{user.get('id')}</div>
                <div className="val username">{user.get('username')}</div>
                <div className="val age">{user.get('age')}</div>
                <div className="actions">
                    <Link to={{pathname: `/users/${user.get('id')}/`}} className="btn btn-default" role="button">View Profile</Link>
                    <button className="btn btn-danger" role="button" onClick={this.handleDelete.bind(this)}>Delete</button>
                </div>
            </li>
        );
    }
}
