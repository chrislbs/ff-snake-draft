const React = require('react'),
    ReactDOM = require('react-dom'),
    Router = require('react-router').Router,
    Route = require('react-router').Route,
    browserHistory = require('react-router').browserHistory,
    PlayersList = require('./components/PlayersList'),
    ChooseLeague = require('./pages/ChooseLeague');

var App = React.createClass({
    // on component load
    getInitialState : function() {
        return { page : 'league' };
    },
    // after first render
    componentDidMount : function() {
    },
    handleNavLeague : function(leagueName) {
        var state = { page : 'leagueSettings', league : leagueName };
        this.setState(state);
    },
    render : function() {
        console.log(this.state);
        if (this.state.page == 'league') {
            return (<ChooseLeague goToLeague={this.handleNavLeague} />);
        }
        else {
            return (<h3>Whoops!</h3>);
        }
    }
});

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={App} />
        <Route path="/projections/:leagueName" component={PlayersList} />
    </Router>,
    document.getElementById('content')
);
