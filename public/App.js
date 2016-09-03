const React = require('react'),
    ReactDOM = require('react-dom'),
    Router = require('react-router').Router,
    Route = require('react-router').Route,
    browserHistory = require('react-router').browserHistory,
    PlayersList = require('./components/PlayersList'),
    LeagueSettings = require('./pages/LeagueSettings'),
    ChooseLeague = require('./pages/ChooseLeague');

var App = React.createClass({
    render: function () {
        return (<ChooseLeague />);
    }
});

// explicitly specifying routes because I was struggling to get nested routers working
ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={App} />
        <Route path="/leagues/:leagueName" component={LeagueSettings} />
        <Route path="/leagues/:leagueName/rosterSettings" component={LeagueSettings} settings="roster" />
        <Route path="/leagues/:leagueName/scoringSettings" component={LeagueSettings} settings="scoring" />
        <Route path="/leagues/:leagueName/vorSettings" component={LeagueSettings} settings="vor" />
        <Route path="/leagues/:leagueName/teams" component={LeagueSettings} />
        <Route path="/leagues/:leagueName/projections" component={PlayersList} />
    </Router>,
    document.getElementById('content')
);
