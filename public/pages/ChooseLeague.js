'use strict';
const React = require('react'),
    fetch = require('isomorphic-fetch'),
    browserHistory = require('react-router').browserHistory;

var ChooseLeague = React.createClass({
    getInitialState : function() {
        return { league : '' };
    },
    handleLeagueChange : function(e) {
        this.setState({league : e.target.value });
    },
    handleGoExisting : function(e) {
        e.preventDefault();
        e.stopPropagation();
        browserHistory.push(`/leagues/${this.state.league.trim()}`);
    },
    handleCreateNew : function(e) {
        e.preventDefault();
        e.stopPropagation();
        // this should navigate me to a new page
        var league = this.state.league.trim();
        fetch('/api/leagues', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: league
            })
        })
        .then((response) => {
            if (response.status == 200) {
                this.props.history.push(`/leagues/${league}`);
            }
        });
    },
    render : function() {
        return (
            <div id="leagueContainer" className="u-full-width">
                <div className="u-full-width">
                    <input type="text" placeholder="League Name:" value={this.state.league}
                           onChange={this.handleLeagueChange} />
                </div>
                <div className="u-full-width">
                    <input type="button" value="Go to Existing" className="button-primary"
                           onClick={this.handleGoExisting} />
                </div>
                <div className="u-full-width">
                    <input type="button" value="Create a New League" className="button-primary"
                        onClick={this.handleCreateNew} />
                </div>
            </div>
        )
    }
});

module.exports = ChooseLeague;