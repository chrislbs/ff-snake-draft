'use strict';

import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './containers/App';
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
        <IndexRoute component={ExamplePage} />
        <Route name="example-route" path="example" component={ExampleSection}>
            <IndexRoute name="example-route" component={ExamplePage} />
            <Route name="example-page" path="page" component={ExamplePage} />
        </Route>
    </Route>
);
