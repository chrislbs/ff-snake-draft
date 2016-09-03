'use strict';
const React = require('react'),
    Promise = require('bluebird'),
    fetch = require('isomorphic-fetch');

var PlayerListRow = React.createClass({
    render : function() {
        return (
            <tr>
                <td>{this.props.player.player}</td>
                <td>{this.props.player.position}</td>
                <td>{this.props.player.team}</td>
                <td>{this.props.player.projectedPoints}</td>
                <td>{this.props.player.vor}</td>
            </tr>
        )
    }
});

var PlayerListHeader = React.createClass({
    render : function() {
        return (
            <thead>
                <tr>
                    <th>Player</th>
                    <th>Position</th>
                    <th>Team</th>
                    <th>Projected Points</th>
                    <th>Value Over Replacement</th>
                </tr>
            </thead>
        )
    }
});

var PlayersList = React.createClass({
    getInitialState : function() {
        return { players: [] }
    },
    componentDidMount : function() {
        // lol how do i this?
        var comp = this;
        fetch(`/api/leagues/${this.props.params.leagueName}/projections`)
            .then((response) => {
                console.log(response.status);
                if(response.status == 200) {
                    response.json().then((json) => {
                        comp.setState({players : json});
                    });
                }
            });
    },
    render : function() {
        console.log(this.state);
        var playerRows = this.state.players.map((player) => {
            return (
                <PlayerListRow player={player} key={player.player + player.team} />
            )
        });
        return (
            <table className="u-full-width">
                <PlayerListHeader />
                <tbody>
                {playerRows}
                </tbody>
            </table>
        );
    }
});

module.exports = PlayersList;
