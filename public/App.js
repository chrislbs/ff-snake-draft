const React = require('react'),
    ReactDOM = require('react-dom'),
    PlayersList = require('./components/PlayersList'),
    $ = require('jquery');

var App = React.createClass({
    // on component load
    getInitialState : function() {
        return { page : 'landing', players : [] };
    },
    // after first render
    componentDidMount : function() {
        console.log('hello');
        $.ajax({
            url: '/api/leagues/test/projections',
            dataType: 'json',
            cache : false,
            success: function(players) {
                this.setState({players : players});
            }.bind(this)
        })
    },
    render : function() {
        console.log('hello render');
        return (<PlayersList players={this.state.players} />);
    }
});

ReactDOM.render(
    <App />,
    document.getElementById('content')
);
