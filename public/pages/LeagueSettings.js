'use strict';

const React = require('react'),
    LeagueRosterSettings = require('../components/LeagueRosterSettings'),
    LeagueSettingsNav = require('../components/LeagueSettingsNav');

var LeagueSettings = React.createClass({
    render : function() {

        var leagueName=this.props.params.leagueName;
        var settings=this.props.route.settings;

        var content = null;
        if (settings == 'roster')
        {
            content = (<LeagueRosterSettings leagueName={leagueName} />)
        }

        return (
            <div>
                <LeagueSettingsNav leagueName={leagueName} />
                <div>
                    {content}
                </div>
            </div>
        )
    }
});

module.exports = LeagueSettings;
