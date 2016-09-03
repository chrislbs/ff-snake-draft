'use strict';

const React = require('react'),
    Link = require('react-router').Link;

var DraftSettingsNav = React.createClass({
    render : function() {
        var league = this.props.leagueName;
        var prefix = `/leagues/${league}/draft/`;
        var draftOrder = prefix + "draftOrder";
        return (
            <div id="#draftNav">
                <div>
                    <Link to={draftOrder} activeClassName="active">Draft Order</Link>
                </div>
            </div>
        )
    }
});

module.exports = DraftSettingsNav;
