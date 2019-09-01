'use strict';

const React = require('react'),
    Link = require('react-router').Link;

let LeagueSettingsNav = React.createClass({
    render: function () {
        let league = this.props.leagueName;
        let prefix = `/leagues/${league}/`;
        let rosterSettings = prefix + "rosterSettings";
        let scoringSettings = prefix + "scoringSettings";
        let vorSettings = prefix + "vorSettings";
        let teams = prefix + "teams";
        let projections = prefix + "projections";
        let draft = prefix + "draft";
        return (
            <div id="leagueNav" className="row">
                <div className="col">
                    <Link to="/" activeClassName="active">Home</Link>
                </div>
                <div className="col">
                    <Link to={rosterSettings} activeClassName="active">Roster Settings</Link>
                </div>
                <div className="col">
                    <Link to={scoringSettings} activeClassName="active">Scoring Settings</Link>
                </div>
                <div className="col">
                    <Link to={vorSettings} activeClassName="active">VOR Settings</Link>
                </div>
                <div className="col">
                    <Link to={teams} activeClassName="active">Teams</Link>
                </div>
                <div className="col">
                    <Link to={projections} activeClassName="active">Projections</Link>
                </div>
                <div className="col">
                    <Link to={draft} activeClassName="active">Draft</Link>
                </div>
            </div>
        )
    }
});

module.exports = LeagueSettingsNav;
