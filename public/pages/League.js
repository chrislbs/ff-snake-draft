'use strict';

const React = require('react'),
    LeagueRosterSettings = require('../components/LeagueRosterSettings'),
    LeagueScoringSettings = require('../components/LeagueScoringSettings'),
    LeagueVorSettings = require('../components/LeagueVorSettings'),
    LeagueProjections = require('../components/LeagueProjections'),
    LeagueTeams = require('../components/LeagueTeams'),
    LeagueSettingsNav = require('../components/LeagueSettingsNav');

var League = React.createClass({
    render : function() {

        var leagueName=this.props.params.leagueName;
        var settings=this.props.route.settings;

        var content = null;
        if (settings == 'roster')
        {
            content = (<LeagueRosterSettings leagueName={leagueName} />)
        }
        else if (settings == 'scoring') {
            content = (<LeagueScoringSettings leagueName={leagueName} />)
        }
        else if (settings == 'vor') {
            content = (<LeagueVorSettings leagueName={leagueName} />)
        }
        else if (settings == 'projections') {
            content = (<LeagueProjections leagueName={leagueName} />)
        }
        else if (settings == 'teams') {
            content = (<LeagueTeams leagueName={leagueName} />)
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

module.exports = League;
