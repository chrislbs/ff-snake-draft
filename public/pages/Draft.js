'use strict';

const React = require('react'),
    LeagueSettingsNav = require('../components/LeagueSettingsNav'),
    DraftNav = require('../components/DraftNav');

var Draft = React.createClass({
    render : function() {

        console.log('render draft');
        var leagueName=this.props.params.leagueName;
        var settings=this.props.route.settings;

        var content = null;
        if (settings == 'draftOrder')
        {
            content = (<div>Hello Draft Order</div>)
        }
        else
        {
            content = (<div>Unknown Draft Page</div>)
        }

        return (
            <div>
                <LeagueSettingsNav leagueName={leagueName}/>
                <div id="draftDiv">
                    <hr />
                    <DraftNav leagueName={leagueName}/>
                    <div>
                        {content}
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = Draft;
