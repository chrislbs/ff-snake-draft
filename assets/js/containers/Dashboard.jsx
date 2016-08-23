'use strict';

import React, { Component } from 'react';
import BasePage from './BasePage';
import { List } from 'immutable';
import PathSection from './PathSection';
import { connect } from 'react-redux';
import {
    getAllUsers,
    createUser,
    deleteUser,
    getAllPlayers,
    createPlayer,
    deletePlayer
} from '../actions';
import classNames from 'classnames';
import { PlayerList } from '../components/players';
import { UserList } from '../components/users';

class Dashboard extends BasePage {

    // Initial state
    state = {
        fetch_stack: List([])
    };

    constructor(props) {
        super(props);
    }

    fetchData = () => {
        const { getAllPlayers, getAllUsers }  = this.props;

        getAllPlayers();
        getAllUsers();
    };

    handleCreatePlayer = (name, birthday) => {
        const { createPlayer } = this.props;

        createPlayer(name, birthday);
    };

    handleDeletePlayer = (id) => {
        const { deletePlayer } = this.props;

        deletePlayer(id);
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
        const { fetching, users, players } = this.props;

        const loadingWrapperClasses = classNames('loading-fade-wrapper', {loading: fetching});

        const loadingSpinner = fetching ? <img src="/public/img/spinner.gif" className="loading-spinner" alt="Loading..." /> : '';

        // Wrap with a path section so that this page renders just like the other pages that are actually nested in a Route
        return (
            <PathSection>
                <div className="page-wrapper players-page-wrapper row">
                    <div className={loadingWrapperClasses}>
                        <div className="col-xs-12 page-title">
                            {/* List all of the players and tools for creating/deleting them. */}
                            <PlayerList
                                players={players}
                                onCreatePlayer={this.handleCreatePlayer}
                                onDeletePlayer={this.handleDeletePlayer}
                            />

                            <br />

                            {/* List all of the users and tools for creating/deleting them. */}
                            <UserList
                                users={users}
                                onCreateUser={this.handleCreateUser}
                                onDeleteUser={this.handleDeleteUser}
                            />
                        </div>
                    </div>
                    {loadingSpinner}
                </div>
            </PathSection>
        );
    }
}

export default connect(
    // Redux state binding
    (state) => {
        return {
            fetching: state.players.get('fetching') || state.users.get('fetching'),
            players: state.players.get('all'),
            users: state.users.get('all')
        };
    },
    { getAllPlayers, createPlayer, deletePlayer, getAllUsers, createUser, deleteUser }
)(Dashboard);
