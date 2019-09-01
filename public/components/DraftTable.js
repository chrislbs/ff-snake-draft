'use strict';

const React = require('react'),
    update = require('react-addons-update'),
    _ = require('lodash'),
    FixedDataTable = require('fixed-data-table-2'),
    { Table, Column, Cell } = FixedDataTable;

function getRank(playerRank, pickedPlayers) {
    let numAbove = _.filter(pickedPlayers, function(pp) { return playerRank > pp.actualRank }).length;
    let numBelow = _.filter(pickedPlayers, function(pp) { return playerRank < pp.actualRank }).length;
    let numPicked = pickedPlayers.length;


    let ret = playerRank - (numPicked - numBelow);

    return ret;
}

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

const RankCell = ({rowIndex, data, col, pickedPlayers}) => (
    <Cell>
        {getRank(data.getAt(rowIndex)[col], pickedPlayers)}
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

const PositionFilter = React.createClass({
    handleOnChange : function(e) {
        var positions = [e.target.value.trim()];
        if(e.target.value.trim() == 'D')
        {
            positions = ['DL','LB'];
        }
        if(e.target.value.trim() == 'All')
        {
            positions = null;
        }
        this.props.onFilterPosition(positions);
    },
    render : function() {
        return (
            <select onChange={this.handleOnChange}>
                <option value="All">All</option>
                <option value="QB">QB</option>
                <option value="WR">WR</option>
                <option value="RB">RB</option>
                <option value="TE">TE</option>
                <option value="K">K</option>
                <option value="D">D</option>
                <option value="LB">LB</option>
                <option value="DL">DL</option>
                <option value="DB">DB</option>
                <option value="DST">DST</option>
            </select>
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
        let actualIndex = this._indexMap[index];
        return this._data.getAt(actualIndex)
    }
}

var DraftTable = React.createClass({
    getInitialState : function() {
        return {
            players : new DataList([]),
            filteredList : new DataList([]),
            pickedPlayers : [],
            namePredicate : this.alwaysTruePredicate,
            pickedPlayerPredicate : this.alwaysTruePredicate,
            positionPredicate : this.alwaysTruePredicate
        }
    },
    notDstPredicate : function(player) {
        return player.position != 'DST';
    },
    alwaysTruePredicate : function(player) {
        return true;
    },
    filterNoProjections : function(players) {
        return _.filter(players, (p) => p.projectedPoints > 0);
    },
    filterDst : function(players) {
        return _.filter(players, (p) => p.position != 'DST');
    },
    fetchPickedPlayers : function() {
        return fetch(`/api/leagues/${this.props.leagueName}/draft/allPicks`)
            .then((response) => response.json())
            .then((pickList) => {
                let pred = function(player) {
                    let index = _.findIndex(pickList, (pickedPlayer) => {
                        return pickedPlayer.playerName === player.player &&
                                pickedPlayer.teamName === player.team;
                                // pickedPlayer.position === player.position;
                    });

                    return index === -1;
                };

                var newState = update(this.state, {
                    pickedPlayerPredicate : { $set : pred }
                });
                this.setState(newState);
            })
            .then(() => this.updateFilteredList());
    },
    componentDidMount : function() {
        let headers = { 'Accept' : 'application/json' };
        fetch(`/api/leagues/${this.props.leagueName}/projections`, { headers: headers })
            .then((response) => response.json())
            .then((players) => {
                players = this.filterNoProjections(players);
                players = this.filterDst(players);
                for(let i = 0; i < players.length; i++) {
                    players[i].actualRank = i + 1;
                }
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
    onFilterPosition : function(positions) {
        var pred;
        if(positions == null) {
            pred = this.alwaysTruePredicate;
        }
        else {
            pred = function(player) {
                return positions.includes(player.position);
            }
        }

        //var dstPred = this.notDstPredicate;
        //var actual = function(player) {
        //    return dstPred(player) && pred(pred);
        //};

        var newState = update(this.state, {
            positionPredicate : { $set : pred }
        });
        this.setState(newState, function() {
            this.updateFilteredList();
        });
    },
    onPick : function(rowIndex) {
        let player = this.state.filteredList.getAt(rowIndex);
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
        let dataList = this.state.players;
        let size = dataList.getSize();
        let filteredIndexes = [];
        let pickedIndexes = [];
        for (let index = 0; index < size; index++) {
            let player = dataList.getAt(index);
            if (this.state.namePredicate(player) &&
                this.state.pickedPlayerPredicate(player) &&
                this.state.positionPredicate(player))
            {
                filteredIndexes.push(index);
            }

            if(!this.state.pickedPlayerPredicate(player)) {
                pickedIndexes.push(index);
            }
            //if (this.state.namePredicate(player) &&
            //    this.state.pickedPlayerPredicate(player))
            //{
            //    filteredIndexes.push(index);
            //}
        }
        dataList = new DataWrapper(filteredIndexes, this.state.players);
        let newState = update(this.state, {
            filteredList : { $set : dataList},
            filteredIndexes : { $set : filteredIndexes },
            pickedIndexes : { $set : pickedIndexes},
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


        let pickedIndexes = this.state.pickedIndexes;
        let playerList = this.state.players;
        let dataList = this.state.filteredList;
        let pickedPlayers = [];
        for (let i = 0; i < playerList.getSize(); i++) {
            let player = playerList.getAt(i);
            if(_.includes(pickedIndexes, i)) {
                pickedPlayers.push(player);
            }
        }

        return (
            <div>
                <input type="text" onChange={this.onPlayerFilter} placeholder="Filter by Name" />
                <PositionFilter onFilterPosition={this.onFilterPosition} />
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
                        cell={<RankCell data={dataList} col="actualRank" pickedPlayers={pickedPlayers} />}
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