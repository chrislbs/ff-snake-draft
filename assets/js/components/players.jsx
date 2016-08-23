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
        'onCreatePlayer': PropTypes.func.isRequired,
        'onDeletePlayer': PropTypes.func.isRequired
    };
    // }}}

    state = {
        'creating': false
    };

    constructor(props) {
        super(props);
    }

    handleCreatePlayer = (name, birthday) => {
        const { onCreatePlayer } = this.props;

        onCreatePlayer(name, birthday);

        this.setState({'creating': false});
    };

    handleCancelCreate = () => {
        this.setState({'creating': false});
    };

    handleDeletePlayer = (player) => {
        const { onDeletePlayer } = this.props;

        onDeletePlayer(player.get('id'));
    };

    openCreateForm = () => {
        this.setState({'creating': true});
    };

    render() {
        const { players } = this.props;
        const { creating } = this.state;

        return (
            <div className="db-list-wrapper">
                <div>
                    <h1>Players</h1> 
                    <button className="create btn btn-default" onClick={this.openCreateForm}>Add</button>
                    <div className="clearfix" />
                </div>

                <ul className="db-list">
                    {/* Column Headers */}
                    <li key={'headers'} className="db-list-headers">
                        <div className="id"><label>ID</label></div>
                        <div className="name"><label>Name</label></div>
                        <div className="birthday"><label>Birthday</label></div>
                        <div className="actions"><label>Actions</label></div>
                    </li>

                    {/* Create player form - Only shown when the "creating" state is true */}
                    {creating ?
                        <PlayerListForm
                            key={'form'}
                            onCreatePlayer={this.handleCreatePlayer}
                            onCancelCreate={this.handleCancelCreate}
                        /> : null}

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

class PlayerListForm extends Component {
    // {{{ PropTypes
    static propTypes = {
        'onCreatePlayer': PropTypes.func.isRequired,
        'onCancelCreate': PropTypes.func.isRequired
    };
    // }}}

    state = {
        'name': '',
        'birthday': ''
    };

    constructor(props) {
        super(props);
    }

    handleChangeName = (e) => {
        this.setState({'name': e.target.value});
    };

    handleChangeBirthday = (e) => {
        this.setState({'birthday': e.target.value});
    };

    handleCreatePlayer = () => {
        const { onCreatePlayer } = this.props;
        const { name, birthday } = this.state;

        onCreatePlayer(name, birthday);
    };

    handleCancelCreate = () => {
        const { onCancelCreate } = this.props;

        // Reset the form fields
        this.setState({'name': '', 'birthday': ''});

        onCancelCreate();
    };

    handleKeyDown = (e) => {
        const { onCreatePlayer, onCancelCreate } = this.props;
        const { name, birthday } = this.state;

        switch(e.keyCode) {
            // enter
            case 13:
                onCreatePlayer(name, birthday);
                break;
            // esc
            case 27:
                // Reset the form fields
                this.setState({'name': '', 'birthday': ''});

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
        const { name, birthday } = this.state;

        return (
            <li className="db-list-form">
                <div className="id">---</div>
                <div className="name">
                    <input
                        type="text"
                        ref={this.focusOnInput}
                        value={name}
                        onChange={this.handleChangeName}
                        onKeyDown={this.handleKeyDown}
                        placeholder="Player's Name..."
                    />
                </div>
                <div className="birthday">
                    <input
                        type="text"
                        value={birthday}
                        onChange={this.handleChangeBirthday}
                        onKeyDown={this.handleKeyDown}
                        placeholder="Player's Birthday..."
                    />
                </div>
                <div className="actions">
                    <button className="btn btn-success" onClick={this.handleCreatePlayer.bind(this)}>Create</button>
                    <button className="btn btn-warning" onClick={this.handleCancelCreate.bind(this)}>Cancel</button>
                </div>
            </li>
        );
    }
}

class PlayerListItem extends Component {
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
                <div className="id">{player.get('id')}</div>
                <div className="name">{player.get('name')}</div>
                <div className="birthday">{moment(player.get('birthday')).format('MMM. Do, YYYY')}</div>
                <div className="actions">
                    <Link to={{pathname: `/players/${player.get('id')}/`}} className="btn btn-default" role="button">View Profile</Link>
                    <button className="btn btn-danger" role="button" onClick={this.handleDelete.bind(this)}>Delete</button>
                </div>
            </li>
        );
    }
}
