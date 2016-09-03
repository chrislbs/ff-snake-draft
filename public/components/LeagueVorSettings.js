'use strict';

const React = require('react'),
    update = require('react-addons-update'),
    _ = require('lodash');

const validPositions = [
    "QB", "RB", "WR", "TE", "K", "DL", "LB", "DB"
];

var VorRow = React.createClass({
    handleValueChange : function(e) {
        this.props.valueChanged(this.props.position, e.target.value);
    },
    render : function() {
        return (
            <div>
                <span>{this.props.position}</span>
                <input type="text" value={this.props.baseline} onChange={this.handleValueChange} />
            </div>
        )
    }
});

var LeagueVorSettings = React.createClass({
    getInitialState : function() {
        return { leaguePositions : [], vorBaselines : {} }
    },
    componentDidMount : function() {
        var comp = this;
        fetch(`/api/leagues/${this.props.leagueName}/rosterSettings`)
            .then((response) => response.json())
            .then((json) => {
                var leaguePositions = _.filter(
                    Array.from(new Set(json)),
                    (pos) => validPositions.includes(pos));
                var newState = update(comp.state, {
                    leaguePositions : { $set : leaguePositions}
                });
                comp.setState(newState);
            })
            .then(() => fetch(`/api/leagues/${comp.props.leagueName}/vorSettings`))
            .then((response) => response.json())
            .then((json) => {
                var positions = comp.state.leaguePositions;
                var baselines = _.reduce(positions, (baselineObj, position) => {
                    baselineObj[position] = json[position];
                    return baselineObj;
                }, {});
                var newState = update(comp.state, {
                    vorBaselines : { $set : baselines }
                });
                comp.setState(newState);
            });
    },
    baselineChange : function(position, baseline) {
        var newState = update(this.state, {
            vorBaselines : {
                [position] : { $set : baseline }
            }
        });
        this.setState(newState);
    },
    updateClicked : function(e) {
        var comp = this;
        fetch(`/api/leagues/${this.props.leagueName}/vorSettings`,
            {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state.vorBaselines)
            })
            .then((response) => response.json())
            .then((json) => {
                var newState = update(comp.state, {
                    vorBaselines : { $set : json }
                });
                comp.setState(newState);
            });
    },
    render : function() {
        var rows = _.map(this.state.leaguePositions, (position) => {
            var baseline = this.state.vorBaselines[position];
            return (<VorRow baseline={baseline} position={position} key={position}
                            valueChanged={this.baselineChange} />)
        });
        return (
            <div>
                <div>{rows}</div>
                <div><input type="button" value="Update" onClick={this.updateClicked} /></div>
            </div>
        );
    }
});

module.exports = LeagueVorSettings;
