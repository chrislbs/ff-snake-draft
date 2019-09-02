'use strict';

const React = require('react'),
    update = require('react-addons-update'),
    _ = require('lodash');

const validPositions = [
    "QB", "RB", "WR", "TE", "K", "DL", "LB", "DB", "D", "DST"
];

let VorRow = React.createClass({
    handleValueChange: function (e) {
        this.props.valueChanged(this.props.position, e.target.value);
    },
    render: function () {
        return (
            <div className="row justify-content-end">
                <span className="col">{this.props.position}</span>
                <span className="col-auto">
                    <input type="text"
                           value={this.props.baseline}
                           onChange={this.handleValueChange}/>
                </span>
            </div>
        )
    }
});

let LeagueVorSettings = React.createClass({
    getInitialState: function () {
        return {leaguePositions: [], vorBaselines: {}}
    },
    componentDidMount: function () {
        let comp = this;
        fetch(`/api/leagues/${this.props.leagueName}/rosterSettings`)
            .then((response) => response.json())
            .then((json) => {
                let leaguePositions = _.filter(
                    Array.from(new Set(json)),
                    (pos) => validPositions.includes(pos));

                leaguePositions = _.map(leaguePositions, (pos) => {
                    if (pos == 'D') {
                        return ['DL', 'LB'];
                    } else {
                        return pos;
                    }
                });

                leaguePositions = _.flatten(leaguePositions);

                let newState = update(comp.state, {
                    leaguePositions: {$set: leaguePositions}
                });
                comp.setState(newState);
            })
            .then(() => fetch(`/api/leagues/${comp.props.leagueName}/vorSettings`))
            .then((response) => response.json())
            .then((json) => {
                let positions = comp.state.leaguePositions;
                let baselines = _.reduce(positions, (baselineObj, position) => {
                    baselineObj[position] = json[position];
                    return baselineObj;
                }, {});
                let newState = update(comp.state, {
                    vorBaselines: {$set: baselines}
                });
                comp.setState(newState);
            });
    },
    baselineChange: function (position, baseline) {
        let newState = update(this.state, {
            vorBaselines: {
                [position]: {$set: baseline}
            }
        });
        this.setState(newState);
    },
    updateClicked: function (e) {
        let comp = this;
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
                let newState = update(comp.state, {
                    vorBaselines: {$set: json}
                });
                comp.setState(newState);
            });
    },
    render: function () {
        let rows = _.map(this.state.leaguePositions, (position) => {
            let baseline = this.state.vorBaselines[position];
            return (<VorRow baseline={baseline} position={position} key={position}
                            valueChanged={this.baselineChange}/>)
        });
        return (
            <div id="leagueVorSettings">
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

module.exports = LeagueVorSettings;
