'use strict';

import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './containers/App';
import Dashboard from './containers/Dashboard';
import PathSection from './containers/PathSection';

import PlayersPage from './containers/PlayersPage';
import PlayerProfilePage from './containers/PlayerProfilePage';

import UsersPage from './containers/UsersPage';
import UserProfilePage from './containers/UserProfilePage';

import ExamplePage from './containers/ExamplePage';

// This route tree defines the urls for our UI and how they map to container components. Each route's "component" will be rendered
// as the child of it's parent route's component. For example, the url "/example/page/" will produce this component tree:
// <App>
//     <ExampleSection>
//         <ExamplePage />
//     </ExampleSection>
// </App>
export default (
    <Route name="app" path="/" component={App}>

        <IndexRoute component={Dashboard} />

        <Route name="players" path="players" component={PathSection}>
            <IndexRoute name="all-players" component={PlayersPage} />
            <Route name="player-profile" path=":id" component={PlayerProfilePage} />
        </Route>

        <Route name="users" path="users" component={PathSection}>
            <IndexRoute name="all-users" component={UsersPage} />
            <Route name="user-profile" path=":id" component={UserProfilePage} />
        </Route>

        <Route name="example-route" path="example" component={PathSection}>
            <IndexRoute name="example-route" component={ExamplePage} />
            <Route name="example-page" path="page" component={ExamplePage} />
        </Route>
    </Route>
);
