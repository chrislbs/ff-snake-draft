const React = require('react'),
    ReactDOM = require('react-dom'),
    Router = require('react-router').Router,
    Route = require('react-router').Route,
    browserHistory = require('react-router').browserHistory,
    Draft = require('./pages/Draft'),
    LeagueRosterSettings = require('./components/LeagueRosterSettings'),
    LeagueScoringSettings = require('./components/LeagueScoringSettings'),
    LeagueVorSettings = require('./components/LeagueVorSettings'),
    LeagueProjections = require('./components/LeagueProjections'),
    LeagueTeams = require('./components/LeagueTeams'),
    LeagueRoot = require('./pages/LeagueRoot'),
    ChooseLeague = require('./pages/ChooseLeague');

var App = React.createClass({
    render: function () {
        return (<ChooseLeague />);
    }
});

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={App} />
        <Route path="/leagues/:leagueName" component={LeagueRoot}>
            <Route path="rosterSettings" component={LeagueRosterSettings} />
            <Route path="scoringSettings" component={LeagueScoringSettings} />
            <Route path="vorSettings" component={LeagueVorSettings} />
            <Route path="teams" component={LeagueTeams}/>
            <Route path="projections" component={LeagueProjections} />
            <Route path="draft" component={Draft}>
            </Route>
        </Route>
    </Router>,
    document.getElementById('content')
);
