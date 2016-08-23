'use strict';

import React, { Component } from 'react';
import BasePage from './BasePage';
import { List } from 'immutable';
import { connect } from 'react-redux';
import { getPlayer } from '../actions';
import classNames from 'classnames';

class PlayerProfilePage extends BasePage {

    // Initial state
    state = {
        fetch_stack: List([])
    };

    constructor(props) {
        super(props);
    }

    fetchData = (id) => {
        const { getPlayer }  = this.props;

        getPlayer(id || this.props.player_id);
    };

    render() {
        const { fetching, player } = this.props;

        const loadingWrapperClasses = classNames('loading-fade-wrapper', {loading: fetching});

        const loadingSpinner = fetching ? <img src="/public/img/spinner.gif" className="loading-spinner" alt="Loading..." /> : '';

        return (
            <div className="page-wrapper player-profile-page-wrapper row">
                <div className={loadingWrapperClasses}>
                    <div className="col-xs-12 page-title">
                        <h1>Player Profile</h1> 
                        {/* This will be a player profile */}
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
            fetching: state.players.get('fetching'),
            player_id: ownProps.params.id,
            player: state.players.get('active')
        };
    },
    { getPlayer }
)(PlayerProfilePage);
