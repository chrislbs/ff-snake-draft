'use strict';

import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './containers/App';
import IndexPage from './containers/IndexPage';

import PlayersSection from './containers/PlayersSection';
import PlayersPage from './containers/PlayersPage';
import PlayerProfile from './containers/PlayerProfile';

import UsersSection from './containers/UsersSection';
import UsersPage from './containers/UsersPage';
import UserProfile from './containers/UserProfile';

import ExampleSection from './containers/ExampleSection';
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

        <IndexRoute component={IndexPage} />

        <Route name="players" path="players" component={PlayersSection}>
            <IndexRoute name="all-players" component={PlayersPage} />
            <Route name="player-profile" component={PlayerProfilePage} />
        </Route>

        <Route name="users" path="users" component={UsersSection}>
            <IndexRoute name="all-users" component={UsersPage} />
            <Route name="user-profile" component={UserProfilePage} />
        </Route>

        <Route name="example-route" path="example" component={ExampleSection}>
            <IndexRoute name="example-route" component={ExamplePage} />
            <Route name="example-page" path="page" component={ExamplePage} />
        </Route>
    </Route>
);
