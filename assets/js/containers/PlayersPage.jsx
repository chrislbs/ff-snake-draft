'use strict';

import React, { Component } from 'react';
import BasePage from './BasePage';
import { List } from 'immutable';
import { connect } from 'react-redux';
import { getAllPlayers, deletePlayer } from '../actions';
import { PlayerList } from '../components/players';
import classNames from 'classnames';

class PlayersPage extends BasePage {

    // Initial state
    state = {
        fetch_stack: List([])
    };

    constructor(props) {
        super(props);
    }

    fetchData = () => {
        const { getAllPlayers }  = this.props;

        getAllPlayers();
    };

    handleDeletePlayer = (id) => {
        const { deletePlayer } = this.props;

        deletePlayer(id);
    };

    render() {
        const { fetching, players } = this.props;

        const loadingWrapperClasses = classNames('loading-fade-wrapper', {loading: fetching});

        const loadingSpinner = fetching ? <img src="/public/img/spinner.gif" className="loading-spinner" alt="Loading..." /> : '';

        return (
            <div className="page-wrapper players-page-wrapper row">
                <div className={loadingWrapperClasses}>
                    <div className="col-xs-12 page-title">
                        <PlayerList players={players} onDeletePlayer={this.handleDeletePlayer.bind(this)} />
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
            fetching: state.players.get('fetching'),
            players: state.players.get('all')
        };
    },
    { getAllPlayers, deletePlayer }
)(PlayersPage);
