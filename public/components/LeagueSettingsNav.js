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
        var draft = prefix + "draft/draftOrder";
        return (
            <div id="leagueNav" className="u-full-width">
                <div>
                    <Link to="/" activeClassName="active">Home</Link>
                </div>
                <div>
                    <Link to={rosterSettings} activeClassName="active">Roster Settings</Link>
                </div>
                <div>
                    <Link to={scoringSettings} activeClassName="active">Scoring Settings</Link>
                </div>
                <div>
                    <Link to={vorSettings} activeClassName="active">VOR Settings</Link>
                </div>
                <div>
                    <Link to={teams} activeClassName="active">Teams</Link>
                </div>
                <div>
                    <Link to={projections} activeClassName="active">Projections</Link>
                </div>
                <div>
                    <Link to={draft} activeClassName="active">Draft</Link>
                </div>
            </div>
        )
    }
});

module.exports = LeagueSettingsNav;
