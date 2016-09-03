'use strict';

const React = require('react'),
    LeagueSettingsNav = require('../components/LeagueSettingsNav');

var League = React.createClass({
    render : function() {

        var leagueName=this.props.params.leagueName;

        var childrenWithProps = React.Children.map(this.props.children,
            (child) => {
                return React.cloneElement(child, {
                    leagueName : leagueName
                });
            });

        return (
            <div>
                <LeagueSettingsNav leagueName={leagueName} />
                <div>{childrenWithProps}</div>
            </div>
        )
    }
});

module.exports = League;
