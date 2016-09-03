'use strict';

const React = require('react'),
    Link = require('react-router').Link;

var LeagueSettingsNav = React.createClass({
    render : function() {
        var league = this.props.leagueName;
        var prefix = `/leagues/${league}/`;
        var rosterSettings = prefix + "rosterSettings";
        var scoringSettings = prefix + "scoringSettings";
        var vorSettings = prefix + "vorSettings";
        var teams = prefix + "teams";
        var projections = prefix + "projections";
        return (
            <ul>
                <li>
                    <Link to="/" activeClassName="active">Home</Link>
                </li>
                <li>
                    <Link to={rosterSettings} activeClassName="active">Roster Settings</Link>
                </li>
                <li>
                    <Link to={scoringSettings} activeClassName="active">Scoring Settings</Link>
                </li>
                <li>
                    <Link to={vorSettings} activeClassName="active">VOR Settings</Link>
                </li>
                <li>
                    <Link to={teams} activeClassName="active">Teams</Link>
                </li>
                <li>
                    <Link to={projections} activeClassName="active">Projections</Link>
                </li>
            </ul>
        )
    }
});

module.exports = LeagueSettingsNav;
