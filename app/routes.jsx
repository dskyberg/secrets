// @flow
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import HomePage from './pages/HomePage';
import ConfigPage from './pages/ConfigPage';
import AddObjectPage from './pages/AddObjectPage';
import KeysPage from './pages/KeysPage';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path='config' component={ConfigPage} />
    <Route path='add' component={AddObjectPage} />
    <Route path='keys' component={KeysPage} />
  </Route>
);
