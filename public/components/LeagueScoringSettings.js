'use strict';

const React = require('react'),
    update = require('react-addons-update'),
    _ = require('lodash');

const validPositions = [
    "QB", "RB", "WR", "TE", "FLEX", "K", "DST", "BN", "DL", "LB", "D", "DB"
];

const scoringSections = {
    'Passing': {
        pass300: 'Pass for 300 yards',
        pass350: 'Pass for 350 yards',
        pass400: 'Pass for 400 yards',
        pass40: 'Passing play over 40 yards',
        passAttempt: 'Attempted Pass',
        passCompletion: 'Completed Pass',
        passIncompletion: 'Incomplete Pass',
        passIntercepted: 'Intercepted Pass',
        passTouchdown: 'Passing Touchdown',
        passYardsPerPoint: 'Pass Yards Per Point'
    },
    'Receiving': {
        recPointsPer: 'Points Per Reception',
        rec100: 'Receive for 100 yards',
        rec150: 'Receive for 150 yards',
        rec200: 'Receive for 200 yards',
        rec40: 'Reception for over 40 yards',
        recTouchdown: 'Receiving Touchdown',
        recYardsPerPoint: 'Receiving Yards Per Point'
    },
    'Rushing': {
        rush100: 'Rush for 100 yards',
        rush150: 'Rush for 150 yards',
        rush200: 'Rush for 200 yards',
        rush40: 'Rushing play over 40 yards',
        rushAttempt: 'Rushing Attempt',
        rushTouchdown: 'Rushing Touchdown',
        rushYardsPerPoint: 'Rush Yards Per Point'
    },
    'All Offense': {
        fumblesLost: 'Fumbles',
        twoPts: '2 Point Conversion'
    },
    'Returning': {
        returnTouchdown: 'Returning Touchdown',
        returnYardsPerPoint: 'Returning Yards Per Point'
    },
    'Kicking': {
        fg0019: 'Field Goal <= 19',
        fg2029: 'Field Goal [20, 29]',
        fg3039: 'Field Goal [30, 39]',
        fg4049: 'Field Goal [40, 49]',
        fg50: 'Field Goal 50+',
        fgAttempt: 'Field Goal Attempt',
        fgMiss: 'Field Goal Miss',
        fgExtraPoint: 'Extra Point'
    },
    'Defense': {
        idpTackleAssist: 'Assisted Tackle',
        idpTackleSolo: 'Solo Tackle',
        idpFumbleForced: 'Forced Fumble',
        idpFumbleRecovered: 'Recovered Fumble',
        idpInterception: 'Interception',
        idpPassDefended: 'Pass Defended',
        idpSack: 'Sack',
        idpTackleForLoss: 'Tackle For Loss',
        idpTouchdown: 'Defensive Touchdown'
    }
};

var ScoringRow = React.createClass({
    handleValueChange : function(e) {
        this.props.valueChanged(this.props.scoringKey, e.target.value);
    },
    render : function() {
        return (
            <div>
                <span>{this.props.scoringDesc}</span>
                <input type="input" value={this.props.scoringValue} onChange={this.handleValueChange} />
            </div>
        )
    }
});

var LeagueScoringSettings = React.createClass({
    getInitialState : function() {
        var scoringData = _.reduce(scoringSections, (dataMap, scoringDescs) => {
            _.forEach(scoringDescs, (desc, scoringKey) => {
                dataMap[scoringKey] = 0;
            });
            return dataMap;
        }, {});
        return { scoringData : scoringData };
    },
    componentDidMount : function() {
        var comp = this;
        fetch(`/api/leagues/${this.props.leagueName}/scoringSettings`)
            .then((response) => response.json())
            .then((json) => {
                var newState = update(comp.state, {
                    scoringData : { $set : json }
                });
                comp.setState(newState);
            });
    },
    scoringValueChanged : function(scoringKey, scoringValue) {
        var newState = update(this.state, {
            scoringData : {
                [scoringKey] : { $set : scoringValue }
            }
        });
        this.setState(newState);
    },
    saveScoringData : function(e) {
        var comp = this;
        fetch(`/api/leagues/${this.props.leagueName}/scoringSettings`,
            {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state.scoringData)
            })
            .then((response) => response.json())
            .then((json) => {
                var newState = update(comp.state, {
                    scoringData : { $set : json }
                });
                comp.setState(newState);
            });
    },
    render : function() {
        var sections = _.map(scoringSections, (scoringDescs, section) => {
            var scoringRows = _.map(scoringDescs, (scoringDesc, scoringKey) => {
                var scoringValue = this.state.scoringData[scoringKey] || 0;
                return (
                    <ScoringRow scoringKey={scoringKey} scoringDesc={scoringDesc}
                                scoringValue={scoringValue} key={scoringKey}
                                valueChanged={this.scoringValueChanged} />
                )
            });
            return (
                <div key={section}>
                    <h3>{section}</h3>
                    {scoringRows}
                </div>
            )
        });

        return (
            <div>
                <div>
                    {sections}
                </div>
                <div>
                    <input type="button" value="Update" onClick={this.saveScoringData} />
                </div>
            </div>);
    }
});

module.exports = LeagueScoringSettings;
