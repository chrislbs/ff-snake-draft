'use strict';

const React = require('react'),
    LeagueSettingsNav = require('../components/LeagueSettingsNav'),
    DraftNav = require('../components/DraftNav');

var Draft = React.createClass({
    render : function() {

        console.log('render draft');
        var leagueName=this.props.leagueName;

        return (
            <div id="draftDiv">
                <hr />
                <DraftNav leagueName={leagueName}/>
                <div>
                    {this.props.children}
                </div>
            </div>
        )
    }
});

module.exports = Draft;
