'use strict';

const React = require('react'),
    LeagueSettingsNav = require('../components/LeagueSettingsNav');

let League = React.createClass({
    render : function() {

        let leagueName=this.props.params.leagueName;

        let childrenWithProps = React.Children.map(this.props.children,
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
