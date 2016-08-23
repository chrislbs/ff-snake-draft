'use strict';

import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import moment from 'moment';

export class PlayerList extends Component {

    // {{{ PropTypes
    static propTypes = {
        'players': ImmutablePropTypes.listOf(
            ImmutablePropTypes.contains({
                'id': PropTypes.number.isRequired,
                'name': PropTypes.string.isRequired,
                'birthday': PropTypes.string
            })
        ),
        'onDeletePlayer': PropTypes.func.isRequired
    };
    // }}}

    constructor(props) {
        super(props);
    }

    handleDeletePlayer = (player) => {
        const { onDeletePlayer } = this.props;

        onDeletePlayer(player.get('id'));
    };

    render() {
        const { players } = this.props;

        return (
            <div className="db-list-wrapper">
                <h1>Players</h1> 
                <ul className="db-list">
                    {/* Column Headers */}
                    <li key={-1} className="db-list-headers">
                        <div className="val id"><label>ID</label></div>
                        <div className="val name"><label>Name</label></div>
                        <div className="val birthday"><label>Birthday</label></div>
                        <div className="actions"><label>Actions</label></div>
                    </li>

                    {/* Player list items */}
                    {players ?
                        players.map((player, i) => {
                            return <PlayerListItem key={i} player={player} onDelete={this.handleDeletePlayer.bind(this, player)} />;
                        })
                            : <li key={0}>There are no players in the database</li>
                    }
                </ul>
            </div>
        );
    }
}

export class PlayerListItem extends Component {
    // {{{ PropTypes
    static propTypes = {
        'player': ImmutablePropTypes.contains({
            'id': PropTypes.number.isRequired,
            'name': PropTypes.string.isRequired,
            'birthday': PropTypes.string
        }).isRequired,
        'onDelete': PropTypes.func.isRequired
    };
    // }}}

    constructor(props) {
        super(props);
    }

    handleDelete = () => {
        const { player, onDelete } = this.props;

        onDelete(player);
    };

    render() {
        const { player } = this.props;

        return (
            <li className="db-list-item">
                <div className="val id">{player.get('id')}</div>
                <div className="val name">{player.get('name')}</div>
                <div className="val birthday">{moment(player.get('birthday')).format('MMM. Do, YYYY')}</div>
                <div className="actions">
                    <Link to={{pathname: `/players/${player.get('id')}/`}} className="btn btn-default" role="button">View Profile</Link>
                    <button className="btn btn-danger" role="button" onClick={this.handleDelete.bind(this)}>Delete</button>
                </div>
            </li>
        );
    }
}
