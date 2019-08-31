'use strict';
const React = require('react'),
    fetch = require('isomorphic-fetch'),
    browserHistory = require('react-router').browserHistory,
    FixedDataTable = require('fixed-data-table'),
    {Table, Column, Cell} = FixedDataTable;

const DataCell = ({rowIndex, data, col}) => (
    <Cell>
        {data[rowIndex][col]}
    </Cell>
);

const SelectCell = React.createClass({
    onButtonClick: function (e) {
        this.props.onSelect(this.props.rowIndex);
    },
    render: function () {
        return (
            <Cell>
                <input type="button" value="Select" onClick={this.onButtonClick}/>
            </Cell>
        )
    }
});

let ChooseLeague = React.createClass({
    getInitialState: function () {
        return {
            leagueList: [],
            league: ''
        };
    },
    componentDidMount: function () {
        fetch('/api/leagues', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
            .then((response) => response.json())
            .then((leagues) => this.setState({leagueList: leagues}));
    },
    handleLeagueChange: function (e) {
        this.setState({league: e.target.value});
    },
    handleGoExisting: function (e) {
        e.preventDefault();
        e.stopPropagation();
        browserHistory.push(`/leagues/${this.state.league.trim()}`);
    },
    handleLeagueSelected: function (index) {
        let selectedLeague = this.state.leagueList[index].name;
        browserHistory.push(`/leagues/${selectedLeague.trim()}`);
    },
    handleCreateNew: function (e) {
        e.preventDefault();
        e.stopPropagation();
        // this should navigate me to a new page
        let league = this.state.league.trim();
        fetch('/api/leagues', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: league
            })
        })
            .then((response) => {
                if (response.status === 200) {
                    browserHistory.push(`/leagues/${league}`);
                }
            });
    },
    render: function () {

        let leagues = this.state.leagueList;
        return (
            <div id="leagueContainer" className="u-full-width">
                <Table
                    width={950}
                    rowHeight={50}
                    headerHeight={50}
                    maxHeight={500}
                    rowsCount={leagues.length}>

                    <Column
                        header={<Cell>League Id</Cell>}
                        cell={<DataCell data={leagues} col="id"/>}
                        fixed={true}
                        width={100}
                    />
                    <Column
                        header={<Cell>League Name</Cell>}
                        cell={<DataCell data={leagues} col="name"/>}
                        fixed={true}
                        width={700}
                    />
                    <Column
                        cell={<SelectCell onSelect={this.handleLeagueSelected}/>}
                        fixed={true}
                        width={150}
                    />
                </Table>
                <div className="row">
                    <div className="nine columns">
                        <input type="text"
                               className="u-full-width"
                               placeholder="League Name:"
                               value={this.state.league}
                               onChange={this.handleLeagueChange}/>
                    </div>
                    <div className="three columns">
                        <input type="button"
                               value="Create a New League"
                               className="button-primary"
                               onClick={this.handleCreateNew}/>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = ChooseLeague;