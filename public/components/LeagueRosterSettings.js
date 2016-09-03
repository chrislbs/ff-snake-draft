'use strict';

const React = require('react'),
    update = require('react-addons-update');

const validPositions = [
    "QB", "RB", "WR", "TE", "FLEX", "K", "DST", "BN", "DL", "LB", "D", "DB"
];

var PositionRow = React.createClass({
    handleRemoveClick : function(e) {
        this.props.remove(this.props.index);
    },
    render : function() {
        return (
            <div>
                <span>{this.props.position}</span>
                <input type="button" value="Remove" onClick={this.handleRemoveClick} />
            </div>
        )
    }
});

var LeagueRosterSettings = React.createClass({
    getInitialState : function() {
        return { positions : [], selected : 'QB' }
    },
    componentDidMount : function() {
        // lol how do i this?
        var comp = this;
        fetch(`/api/leagues/${this.props.leagueName}/rosterSettings`)
            .then((response) => {
                if(response.status == 200) {
                    response.json().then((json) => {
                        comp.setState({positions : json});
                    });
                }
            });
    },
    removePosition : function(index) {
        var positions = this.state.positions.slice();
        positions.splice(index, 1);
        this.setState({positions : positions});
    },
    handleSelectionChange : function(e) {
        var newState = update(this.state, {
            selected : { $set: e.target.value }
        });
        this.setState(newState);
    },
    handleAddPosition : function(e) {
        var newState = update(this.state, {
            positions : { $push: [this.state.selected] }
        });
        this.setState(newState);
    },
    handleOnUpdate : function(e) {
        var comp = this;
        fetch(`/api/leagues/${this.props.leagueName}/rosterSettings`,
            {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state.positions)
            })
            .then((response) => response.json())
            .then((json) => {
                comp.setState({positions: json});
            });
    },
    render : function() {

        var positionRows = this.state.positions.map((position, index) => {
            return (
                <PositionRow position={position} index={index} key={index} remove={this.removePosition} />
            );
        });

        var selections = validPositions.map((position, index) => {
            var key = 'select-' + index;
            return (<option value={position} key={key}>{position}</option> )
        });
        return (
            <div>
                <div>{positionRows}</div>
                <div>
                    <select onChange={this.handleSelectionChange}>
                        {selections}
                    </select>
                    <input type="button" value="Add" onClick={this.handleAddPosition} />
                </div>
                <div>
                    <input type="button" value="Update" onClick={this.handleOnUpdate}/>
                </div>
            </div>
        );
    }
});

module.exports = LeagueRosterSettings;
