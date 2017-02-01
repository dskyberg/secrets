// @flow
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import HomePage from './pages/HomePage';
import ConfigPage from './pages/ConfigPage';
import AddObjectPage from './pages/AddObjectPage';
import KeysPage from './pages/KeysPage';
import AuthPage from './pages/AuthPage';
import authState from './store/authState';

function requireAuth(nextState, replace) {
  if (authState.expired) {
    replace({
      pathname: '/auth',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

export default (
  <Route path="/" component={App} >
    <IndexRoute component={HomePage} onEnter={requireAuth}/>
    <Route path='config' component={ConfigPage} onEnter={requireAuth}/>
    <Route path='add' component={AddObjectPage} onEnter={requireAuth}/>
    <Route path='keys' component={KeysPage} onEnter={requireAuth}/>
    <Route path='auth' component={AuthPage} />
  </Route>
);
