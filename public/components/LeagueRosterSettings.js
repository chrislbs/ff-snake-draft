'use strict';

const React = require('react'),
    update = require('react-addons-update'),
    FixedDataTable = require('fixed-data-table-2'),
    {Table, Column, Cell} = FixedDataTable;

const validPositions = [
    "QB", "RB", "WR", "TE", "FLEX", "K", "DST", "BN", "DL", "LB", "D", "DB"
];

const DataCell = ({rowIndex, data, col}) => (
    <Cell>
        {data[rowIndex]}
    </Cell>
);

const RemoveCell = React.createClass({
    onButtonClick: function (e) {
        e.preventDefault();
        this.props.onRemove(this.props.rowIndex);
    },
    render: function () {
        return (
            <Cell>
                <input className="delete" type="button" value="Remove" onClick={this.onButtonClick}/>
            </Cell>
        )
    }
});

var PositionRow = React.createClass({
    handleRemoveClick: function (e) {
        this.props.remove(this.props.index);
    },
    render: function () {
        return (
            <div>
                <span>{this.props.position}</span>
                <input className="remove-position-btn" type="button" value="Remove" onClick={this.handleRemoveClick}/>
            </div>
        )
    }
});

let LeagueRosterSettings = React.createClass({
    getInitialState: function () {
        return {positions: [], selected: 'QB'}
    },
    componentDidMount: function () {
        // lol how do i this?
        // var comp = this;
        fetch(`/api/leagues/${this.props.leagueName}/rosterSettings`)
            .then((response) => response.json())
            .then(positions => this.setState({positions: positions}));
    },
    removePosition: function (index) {
        var positions = this.state.positions.slice();
        positions.splice(index, 1);
        this.setState({positions: positions});
    },
    handleSelectionChange: function (e) {
        var newState = update(this.state, {
            selected: {$set: e.target.value}
        });
        this.setState(newState);
    },
    handleAddPosition: function (e) {
        var newState = update(this.state, {
            positions: {$push: [this.state.selected]}
        });
        this.setState(newState);
    },
    handleOnUpdate: function (e) {
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
    render: function () {

        var positionRows = this.state.positions.map((position, index) => {
            return (
                <PositionRow position={position} index={index} key={index}
                             remove={this.removePosition}/>
            );
        });

        let selections = validPositions.map((position, index) => {
            let key = 'select-' + index;
            return (<option value={position} key={key}>{position}</option>)
        });

        let positions = this.state.positions;
        return (
            <div id="leaguePositionsContent">
                <Table
                    width={350}
                    rowHeight={50}
                    headerHeight={50}
                    height={700}
                    rowsCount={positions.length}
                    {...this.props}>
                    <Column
                        header={<Cell>Position</Cell>}
                        cell={<DataCell data={positions} />}
                        fixed={true}
                        width={200}
                    />
                    <Column
                        cell={<RemoveCell onRemove={this.removePosition} />}
                        fixed={true}
                        width={150}
                    />
                </Table>
                <div>
                    <select onChange={this.handleSelectionChange}>
                        {selections}
                    </select>
                    <input type="button" value="Add" onClick={this.handleAddPosition}/>
                    <input className="save" type="button" value="Update" onClick={this.handleOnUpdate}/>
                </div>
            </div>
        );
    }
});

module.exports = LeagueRosterSettings;
