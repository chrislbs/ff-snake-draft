'use strict';

const React = require('react'),
    Link = require('react-router').Link;

let DraftSettingsNav = React.createClass({
    render: function () {
        let league = this.props.leagueName;
        let prefix = `/leagues/${league}/draft/`;
        let draftOrder = prefix + "draftOrder";
        let players = prefix + "players";
        return (
            <div id="draftNav">
                <div className="row justify-content-center">
                    <div className="col">
                        <Link to={draftOrder} activeClassName="active">Draft Order</Link>
                    </div>
                    <div className="col">
                        <Link to={players} activeClassName="active">Player List</Link>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = DraftSettingsNav;
