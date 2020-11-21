/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { NotFound } from 'strapi-helper-plugin';
// Utils
import pluginId from '../../pluginId';
// Containers
import ConnectPage from '../ConnectPage';
import ConnectEndpointPage from '../ConnectEndpointPage';
import ConnectSuccessPage from '../ConnectSuccessPage';
import ConnectErrorPage from '../ConnectErrorPage';

const App = () => {
    return (
        <div>
            <Switch>
                <Route
                    path={`/plugins/${pluginId}`}
                    component={ConnectPage}
                    exact
                />
                <Route
                    path={`/plugins/${pluginId}/connect-endpoint`}
                    component={ConnectEndpointPage}
                    exact
                />
                <Route
                    path={`/plugins/${pluginId}/connect-success`}
                    component={ConnectSuccessPage}
                    exact
                />
                <Route
                    path={`/plugins/${pluginId}/connect-error`}
                    component={ConnectErrorPage}
                    exact
                />
                <Route component={NotFound} />
            </Switch>
        </div>
    );
};

export default App;
