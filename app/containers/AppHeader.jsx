import React, { PropTypes, Component } from 'react';

import { observer } from 'mobx-react';
import { AppBar } from 'react-toolbox/lib/app_bar';
import SneakerLogo from '../components/SneakerLogo';

import appState from '../store/appState';
import authState from '../store/authState';
import awsState from '../store/awsState';
import theme from './AppHeader.scss';

@observer
export default class AppHeader extends Component {

  static propTypes = {
    children: PropTypes.node,
    other: PropTypes.any
  }

  constructor(props, context) {
    super(props, context);
  }

  handleToggle = () => {
    appState.toggleDrawer();
  }

  loggedIn = () => {
    if (awsState.expired || authState.expired) {
      return false;
    }
    return true;
  }

  render() {
    const idToken = authState.idToken;
    const login = !this.loggedIn() && '' || idToken.email;
    return (
      <AppBar fixed title='Secrets' leftIcon="menu" onLeftIconClick={this.handleToggle} theme={theme}>
        {login}
      </AppBar>
    )
  }
}
