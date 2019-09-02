'use strict';

const React = require('react'),
    LeagueSettingsNav = require('../components/LeagueSettingsNav'),
    DraftNav = require('../components/DraftNav');

let Draft = React.createClass({
    render : function() {

        console.log('render draft');
        let leagueName=this.props.leagueName;

        let childrenWithProps = React.Children.map(this.props.children,
            (child) => {
                return React.cloneElement(child, {
                    leagueName : leagueName
                });
            });

        return (
            <div id="draftDiv">
                <DraftNav leagueName={leagueName}/>
                <hr />
                {childrenWithProps}
            </div>
        )
    }
});

module.exports = Draft;
