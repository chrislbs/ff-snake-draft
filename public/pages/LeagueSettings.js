'use strict';

const React = require('react'),
    LeagueSettingsNav = require('../components/LeagueSettingsNav');

var LeagueSettings = React.createClass({
    render : function() {
        return (
            <div>
                <LeagueSettingsNav leagueName={this.props.params.leagueName} />
            </div>
        )
    }
});

module.exports = LeagueSettings;
