'use strict';

import React, { Component } from 'react';
import BasePage from './BasePage';
import { List } from 'immutable';
import PathSection from './PathSection';
import { connect } from 'react-redux';
import { getAllUsers, getAllPlayers } from '../actions';
import classNames from 'classnames';

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
                            <h1>Players</h1> 
                            {/* This will be a list of players */}

                            <h1>Users</h1>
                            {/* This will be a list of users */}
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
    { getAllPlayers, getAllUsers }
)(Dashboard);
