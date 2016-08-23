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
        'onCreateUser': PropTypes.func.isRequired,
        'onDeleteUser': PropTypes.func.isRequired
    };
    // }}}

    state = {
        'creating': false
    };

    constructor(props) {
        super(props);
    }

    handleCreateUser = (username, age) => {
        const { onCreateUser } = this.props;

        onCreateUser(username, age);

        this.setState({'creating': false});
    };

    handleCancelCreate = () => {
        this.setState({'creating': false});
    };

    handleDeleteUser = (user) => {
        const { onDeleteUser } = this.props;

        onDeleteUser(user.get('id'));
    };

    openCreateForm = () => {
        this.setState({'creating': true});
    };

    render() {
        const { users } = this.props;
        const { creating } = this.state;

        return (
            <div className="db-list-wrapper">
                <div>
                    <h1>Users</h1> 
                    <button className="create btn btn-default" onClick={this.openCreateForm}>Add</button>
                    <div className="clearfix" />
                </div>

                <ul className="db-list">
                    {/* Column Headers */}
                    <li key={'headers'} className="db-list-headers">
                        <div className="id"><label>ID</label></div>
                        <div className="username"><label>Username</label></div>
                        <div className="age"><label>Age</label></div>
                        <div className="actions"><label>Actions</label></div>
                    </li>

                    {/* Create user form - Only shown when the "creating" state is true */}
                    {creating ?
                        <UserListForm
                            key={'form'}
                            onCreateUser={this.handleCreateUser}
                            onCancelCreate={this.handleCancelCreate}
                        /> : null}

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

class UserListForm extends Component {
    // {{{ PropTypes
    static propTypes = {
        'onCreateUser': PropTypes.func.isRequired,
        'onCancelCreate': PropTypes.func.isRequired
    };
    // }}}

    state = {
        'username': '',
        'age': ''
    };

    constructor(props) {
        super(props);
    }

    handleChangeUsername = (e) => {
        this.setState({'username': e.target.value});
    };

    handleChangeAge = (e) => {
        this.setState({'age': e.target.value});
    };

    handleCreateUser = () => {
        const { onCreateUser } = this.props;
        const { username, age } = this.state;

        onCreateUser(username, age);
    };

    handleCancelCreate = () => {
        const { onCancelCreate } = this.props;

        // Reset the form fields
        this.setState({'username': '', 'age': ''});

        onCancelCreate();
    };

    handleKeyDown = (e) => {
        const { onCreateUser, onCancelCreate } = this.props;
        const { username, age } = this.state;
        console.log('keycode: ', e.keycode);

        switch(e.keyCode) {
            // enter
            case 13:
                onCreateUser(username, age);
                break;
            // esc
            case 27:
                // Reset the form fields
                this.setState({'username': '', 'age': ''});

                onCancelCreate();
                break;
            default:
                break;
        }
    };

    focusOnInput = (el) => {
        el && el.focus();
    };

    render() {
        const { username, age } = this.state;

        return (
            <li className="db-list-form">
                <div className="id">---</div>
                <div className="username">
                    <input
                        type="text"
                        ref={this.focusOnInput}
                        value={username}
                        onChange={this.handleChangeUsername}
                        onKeyDown={this.handleKeyDown}
                        placeholder="User's Username..."
                    />
                </div>
                <div className="age">
                    <input
                        type="number"
                        value={age}
                        onChange={this.handleChangeAge}
                        onKeyDown={this.handleKeyDown}
                        placeholder="User's Age..."
                    />
                </div>
                <div className="actions">
                    <button className="btn btn-success" onClick={this.handleCreateUser.bind(this)}>Create</button>
                    <button className="btn btn-warning" onClick={this.handleCancelCreate.bind(this)}>Cancel</button>
                </div>
            </li>
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
                <div className="id">{user.get('id')}</div>
                <div className="username">{user.get('username')}</div>
                <div className="age">{user.get('age')}</div>
                <div className="actions">
                    <Link to={{pathname: `/users/${user.get('id')}/`}} className="btn btn-default" role="button">View Profile</Link>
                    <button className="btn btn-danger" role="button" onClick={this.handleDelete.bind(this)}>Delete</button>
                </div>
            </li>
        );
    }
}
