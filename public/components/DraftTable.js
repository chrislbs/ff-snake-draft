'use strict';

const React = require('react'),
    update = require('react-addons-update'),
    _ = require('lodash'),
    FixedDataTable = require('fixed-data-table'),
    { Table, Column, Cell } = FixedDataTable;

const DataCell = ({rowIndex, data, col}) => (
    <Cell>
        {data.getAt(rowIndex)[col]}
    </Cell>
);

const NumCell = ({rowIndex, data, col}) => (
    <Cell>
        {data.getAt(rowIndex)[col].toFixed(2)}
    </Cell>
);

const RankCell = ({rowIndex}) => (
    <Cell>
        {rowIndex + 1}
    </Cell>
);

const ButtonCell = React.createClass({
    onButtonClick : function(e) {
        this.props.onPick(this.props.rowIndex);
    },
    render : function() {
        return (
            <Cell>
                <input type="button" value="Pick" onClick={this.onButtonClick} />
            </Cell>
        )
    }
});

class DataList {
    constructor(data) {
        this._data = data;
    }

    getSize() {
        return this._data.length;
    }

    getAt(index) {
        return this._data[index];
    }
}

class DataWrapper {
    constructor(indexMap, data) {
        this._indexMap = indexMap;
        this._data = data;
    }

    getSize() {
        return this._indexMap.length;
    }

    getAt(index) {
        var actualIndex = this._indexMap[index];
        return this._data.getAt(actualIndex)
    }
}

var DraftTable = React.createClass({
    getInitialState : function() {
        return {
            players : new DataList([]),
            filteredList : new DataList([]),
            namePredicate : this.alwaysTruePredicate,
            pickedPlayerPredicate : this.alwaysTruePredicate
        }
    },
    alwaysTruePredicate : function(player) {
        return true;
    },
    filterNoProjections : function(players) {
        return _.filter(players, (p) => p.projectedPoints > 0);
    },
    fetchPickedPlayers : function() {
        return fetch(`/api/leagues/${this.props.leagueName}/draft/allPicks`)
            .then((response) => response.json())
            .then((pickList) => {
                var pred = function(player) {
                    var index = _.findIndex(pickList, (pickedPlayer) => {
                        return pickedPlayer.playerName == player.player &&
                                pickedPlayer.teamName == player.team;
                    });

                    return index == -1;
                };
                var newState = update(this.state, {
                    pickedPlayerPredicate : { $set : pred }
                });
                this.setState(newState);
            })
            .then(() => this.updateFilteredList());
    },
    componentDidMount : function() {
        fetch(`/api/leagues/${this.props.leagueName}/projections`)
            .then((response) => response.json())
            .then((players) => {
                players = this.filterNoProjections(players);
                var playerList = new DataList(players);
                var newState = update(this.state, {
                    players : { $set : playerList}
                });
                this.setState(newState);
            })
            .then(() => this.fetchPickedPlayers());
    },
    onPlayerFilter : function(e) {

        var pred = null;
        if(e.target.value)
        {
            var partialName = e.target.value.toLowerCase();
            pred = function(p) {
                return p.player.toLowerCase().indexOf(partialName) !== -1;
            };
        }
        else {
            pred = this.alwaysTruePredicate;
        }

        var newState = update(this.state, {
            namePredicate : { $set : pred }
        });
        this.setState(newState, function() {
            this.updateFilteredList();
        });
    },
    onPick : function(rowIndex) {
        var player = this.state.filteredList.getAt(rowIndex);
        fetch(`/api/leagues/${this.props.leagueName}/draft/pick`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    playerName : player.player,
                    teamName : player.team
                })
            })
            .then((response) => response.json())
            .then((pickInfo) => {
                console.log('player picked', pickInfo);
                return this.fetchPickedPlayers();
            });
    },
    updateFilteredList : function() {
        var dataList = this.state.players;
        var size = dataList.getSize();
        var filteredIndexes = [];
        for (var index = 0; index < size; index++) {
            var player = dataList.getAt(index);
            if (this.state.namePredicate(player) &&
                this.state.pickedPlayerPredicate(player)) {
                filteredIndexes.push(index);
            }
        }
        dataList = new DataWrapper(filteredIndexes, this.state.players);
        var newState = update(this.state, {
            filteredList : { $set : dataList}
        });
        this.setState(newState);
    },
    undoLastPick : function(e) {
        fetch(`/api/leagues/${this.props.leagueName}/draft/undoLastPick`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => this.fetchPickedPlayers());
    },
    render : function() {

        var dataList = this.state.filteredList;
        return (
            <div>
                <input type="text" onChange={this.onPlayerFilter} placeholder="Filter by Name" />
                <input type="button" onClick={this.undoLastPick} value="Undo Last" />
                <br />
                <Table
                    rowHeight={50}
                    headerHeight={50}
                    rowsCount={dataList.getSize()}
                    width={950}
                    height={600}
                    {...this.props}>

                    <Column
                        cell={<RankCell />}
                        fixed={true}
                        width={50}
                        />
                    <Column
                        header={<Cell>Player Name</Cell>}
                        cell={<DataCell data={dataList} col="player" />}
                        fixed={true}
                        width={200}
                        />
                    <Column
                        header={<Cell>Position</Cell>}
                        cell={<DataCell data={dataList} col="position" />}
                        fixed={true}
                        width={150}
                        />
                    <Column
                        header={<Cell>Team</Cell>}
                        cell={<DataCell data={dataList} col="team" />}
                        fixed={true}
                        width={150}
                    />
                    <Column
                        header={<Cell>Projected</Cell>}
                        cell={<NumCell data={dataList} col="projectedPoints" />}
                        fixed={true}
                        width={125}
                    />
                    <Column
                        header={<Cell>VOR</Cell>}
                        cell={<NumCell data={dataList} col="vor" />}
                        fixed={true}
                        width={125}
                    />
                    <Column
                        cell={<ButtonCell onPick={this.onPick} />}
                        fixed={true}
                        width={150}
                    />

                </Table>
            </div>
        )
    }
});

module.exports = DraftTable;