const React = require('react');

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
    render : function() {

        var playerRows = this.props.players.map((player) => {
            return (
                <PlayerListRow player={player} />
            )
        });
        return (
            <table class="u-full-width">
                <PlayerListHeader />
                <tbody>
                {playerRows}
                </tbody>
            </table>
        );
    }
});

module.exports = PlayersList;
