'use strict';

const React = require('react'),
    update = require('react-addons-update'),
    _ = require('lodash');

let TeamRow = React.createClass({
    handleUpClick: function (e) {
        this.props.changeRelative(this.props.teamId, -1);
    },
    handleDownClick: function (e) {
        this.props.changeRelative(this.props.teamId, 1);
    },
    render: function () {
        return (
            <div className="row justify-content-end" key={this.props.teamId}>
                <span className="col-1">{this.props.order}</span>
                <span className="col-7">{this.props.teamName}</span>
                <span className="col-auto">
                    <input type="button" value="Up" onClick={this.handleUpClick}/>
                    <input type="button" value="Down" onClick={this.handleDownClick}/>
                </span>
            </div>
        )
    }
});

let DraftOrder = React.createClass({
    getInitialState: function () {
        return {teams: {}, order: []}
    },
    componentDidMount: function () {
        fetch(`/api/leagues/${this.props.leagueName}/teams`)
            .then((response) => response.json())
            .then((teamList) => {
                let teams = _.reduce(teamList, (teamObj, team) => {
                    teamObj[team.id] = team;
                    return teamObj;
                }, {});
                let newState = update(this.state, {
                    teams: {$set: teams},
                    order: {$set: Object.keys(teams)}
                });
                this.setState(newState);
            })
            .then(() => {
                return fetch(`/api/leagues/${this.props.leagueName}/draft/order`)
            })
            .then((response) => response.json())
            .then((orderedTeamIds) => {
                if (orderedTeamIds.length == Object.keys(this.state.teams).length) {
                    let updatedState = update(this.state, {
                        order: {$set: orderedTeamIds}
                    });
                    this.setState(updatedState);
                }
            })
    },

    changeRelative: function (teamId, offset) {
        let teamOrder = this.state.order.slice();
        let origIndex = _.findIndex(teamOrder, (id) => id == teamId);
        let newIndex = origIndex + offset;

        if (newIndex > -1 && newIndex < teamOrder.length) {
            let swapTeam = teamOrder[newIndex];
            teamOrder[newIndex] = teamOrder[origIndex];
            teamOrder[origIndex] = swapTeam;
        }
        let newState = update(this.state, {
            order: {$set: teamOrder}
        });
        this.setState(newState);
    },
    updateClicked: function (e) {
        fetch(`/api/leagues/${this.props.leagueName}/draft/order`,
            {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state.order)
            })
            .then((response) => response.json())
            .then((json) => {
                let newState = update(this.state, {
                    order: {$set: json}
                });
                this.setState(newState);
            });
    },
    render: function () {
        let rows = _.map(this.state.order, (teamId, index) => {
            let team = this.state.teams[teamId];
            return (<TeamRow teamId={team.id} teamName={team.name} key={team.id} order={index + 1}
                             changeRelative={this.changeRelative}/>)
        });
        return (
            <div id="draftOrder">
                {rows}
                <div className="row justify-content-end">
                    <div className="col-auto">
                        <input type="button" value="Update" onClick={this.updateClicked}/>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = DraftOrder;
