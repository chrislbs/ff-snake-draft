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
        return { players : new DataList([]), filteredList : new DataList([]) }
    },
    filterPlayers : function(players) {
        return _.filter(players, (p) => p.projectedPoints > 0);
    },
    componentDidMount : function() {
        fetch(`/api/leagues/${this.props.leagueName}/projections`)
            .then((response) => response.json())
            .then((players) => {
                players = this.filterPlayers(players);
                var playerList = new DataList(players);
                var newState = update(this.state, {
                    players : { $set : playerList},
                    filteredList: { $set : playerList }
                });
                this.setState(newState);
            });
    },
    onPlayerFilter : function(e) {

        var updatedList = this.state.players;
        if(e.target.value)
        {
            var partialName = e.target.value.toLowerCase();
            var size = this.state.players.getSize();
            var filteredIndexes = [];
            for(var index = 0; index < size; index++) {
                var {player} = this.state.players.getAt(index);
                if(player.toLowerCase().indexOf(partialName) !== -1) {
                    filteredIndexes.push(index);
                }
            }
            updatedList = new DataWrapper(filteredIndexes, this.state.players);
        }
        var newState = update(this.state, {
            filteredList: { $set : updatedList }
        });
        this.setState(newState);
    },
    render : function() {

        var dataList = this.state.filteredList;
        console.log(dataList);
        return (
            <div>
                <input type="text" onChange={this.onPlayerFilter} placeholder="Filter by Name" />
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
                        width={200}
                    />
                    <Column
                        header={<Cell>VOR</Cell>}
                        cell={<NumCell data={dataList} col="vor" />}
                        fixed={true}
                        width={200}
                    />

                </Table>
            </div>
        )
    }
});

module.exports = DraftTable;