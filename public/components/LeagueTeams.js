'use strict';

const React = require('react'),
    update = require('react-addons-update');

var TeamRow = React.createClass({
    handleRemoveClick : function(e) {
        this.props.deleteTeam(this.props.teamId);
    },
    render : function() {
        return (
            <div>
                <span>{this.props.teamName}</span>
                <input type="button" value="Delete" onClick={this.handleRemoveClick} />
            </div>
        )
    }
});

var TeamCreate = React.createClass({
    getInitialState : function() {
        return { teamName : '' }
    },
    handleNameChange : function(e) {
        var newState = update(this.state, {
            teamName : { $set : e.target.value }
        });
        this.setState(newState);
    },
    handleCreateClick : function(e) {
        fetch(`/api/leagues/${this.props.leagueName}/teams`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify({name : this.state.teamName})
            })
            .then((response) => {
                this.props.teamCreated();
                this.setState( {teamName : ''})
            });
    },
    render : function() {
        return (
            <div>
                <input type="text" value={this.state.teamName} onChange={this.handleNameChange} />
                <input type="button" value="Create" onClick={this.handleCreateClick}/>
            </div>
        )
    }
});

var TeamList = React.createClass({
    getInitialState : function() {
        return { teams : [] }
    },
    componentDidMount : function() {
        this.updateWithCurrentTeams();
    },
    // call back takes an array of teams
    updateWithCurrentTeams : function() {
        console.log(this);
        fetch(`/api/leagues/${this.props.leagueName}/teams`)
            .then((response) => response.json())
            .then((json) => {
                var newState = update(this.state, {
                    teams : { $set : json }
                });
                this.setState(newState);
            });
    },
    deleteTeam : function(teamId) {
        fetch(`/api/leagues/${this.props.leagueName}/teams/${teamId}`,
            {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => this.updateWithCurrentTeams());
    },
    teamCreated : function() {
        this.updateWithCurrentTeams();
    },
    render : function() {

        var teamRows = this.state.teams.map((team) => {
            return (
                <TeamRow teamName={team.name} teamId={team.id} key={team.name}
                         deleteTeam={this.deleteTeam} />
            );
        });

        return (
            <div>
                <div>{teamRows}</div>
                <div>
                    <TeamCreate leagueName={this.props.leagueName} teamCreated={this.teamCreated} />
                </div>
            </div>
        );
    }
});

module.exports = TeamList;
