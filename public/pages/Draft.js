'use strict';

const React = require('react'),
    LeagueSettingsNav = require('../components/LeagueSettingsNav'),
    DraftNav = require('../components/DraftNav');

var Draft = React.createClass({
    render : function() {

        console.log('render draft');
        var leagueName=this.props.leagueName;

        var childrenWithProps = React.Children.map(this.props.children,
            (child) => {
                return React.cloneElement(child, {
                    leagueName : leagueName
                });
            });

        return (
            <div id="draftDiv">
                <hr />
                <DraftNav leagueName={leagueName}/>
                <div>
                    {childrenWithProps}
                </div>
            </div>
        )
    }
});

module.exports = Draft;
