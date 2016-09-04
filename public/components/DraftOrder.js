'use strict';

const React = require('react'),
    update = require('react-addons-update'),
    _ = require('lodash');

var TeamRow = React.createClass({
    handleUpClick : function(e) {
        this.props.changeRelative(this.props.teamId, -1);
    },
    handleDownClick : function(e) {
        this.props.changeRelative(this.props.teamId, 1);
    },
    render : function() {
        return (
            <div key={this.props.teamId}>
                <span>{this.props.order}</span>
                <span>{this.props.teamName}</span>
                <input type="button" value="Up" onClick={this.handleUpClick} />
                <input type="button" value="Down" onClick={this.handleDownClick} />
            </div>
        )
    }
});

var DraftOrder = React.createClass({
    getInitialState : function() {
        return { teams : {}, order : [] }
    },
    componentDidMount : function() {
        fetch(`/api/leagues/${this.props.leagueName}/teams`)
            .then((response) => response.json())
            .then((teamList) => {
                var teams = _.reduce(teamList, (teamObj, team) => {
                    teamObj[team.id] = team;
                    return teamObj;
                }, {});
                var newState = update(this.state, {
                    teams : { $set : teams },
                    order : { $set : Object.keys(teams) }
                });
                this.setState(newState);
            })
            .then(() => {
                return fetch(`/api/leagues/${this.props.leagueName}/draft/order`)
            })
            .then((response) => response.json())
            .then((orderedTeamIds) => {
                if(orderedTeamIds.length == Object.keys(this.state.teams).length) {
                    var updatedState = update(this.state, {
                        order : { $set : orderedTeamIds }
                    });
                    this.setState(updatedState);
                }
            })
    },

    changeRelative : function(teamId, offset) {
        var teamOrder = this.state.order.slice();
        var origIndex = _.findIndex(teamOrder, (id) => id == teamId);
        var newIndex = origIndex + offset;

        if(newIndex > -1 && newIndex < teamOrder.length) {
            var swapTeam = teamOrder[newIndex];
            teamOrder[newIndex] = teamOrder[origIndex];
            teamOrder[origIndex] = swapTeam;
        }
        var newState = update(this.state, {
            order : { $set : teamOrder}
        });
        this.setState(newState);
    },
    updateClicked : function(e) {
        fetch(`/api/leagues/${this.props.leagueName}/draft/order`,
            {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state.order)
            })
            .then((response) => response.json())
            .then((json) => {
                var newState = update(this.state, {
                    order : { $set : json }
                });
                this.setState(newState);
            });
    },
    render : function() {
        var rows = _.map(this.state.order, (teamId, index) => {
            var team = this.state.teams[teamId];
            return (<TeamRow teamId={team.id} teamName={team.name} key={team.id} order={index + 1}
                             changeRelative={this.changeRelative} />)
        });
        return (
            <div>
                <div>{rows}</div>
                <div><input type="button" value="Update" onClick={this.updateClicked} /></div>
            </div>
        );
    }
});

module.exports = DraftOrder;
