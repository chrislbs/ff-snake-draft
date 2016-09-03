const React = require('react'),
    ReactDOM = require('react-dom'),
    ChooseLeague = require('./pages/ChooseLeague');

var App = React.createClass({
    // on component load
    getInitialState : function() {
        return { page : 'league' };
    },
    // after first render
    componentDidMount : function() {
    },
    render : function() {
        console.log(this.state);
        if (this.state.page == 'league') {
            return (<ChooseLeague />);
        }
        else {
            return ('<h3>Whoops!</h3>');
        }
    }
});

ReactDOM.render(
    <App />,
    document.getElementById('content')
);
