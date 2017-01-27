import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { NavDrawer } from 'react-toolbox/lib/layout';
import { Link } from 'react-toolbox/lib/link';
import barTheme from './SideDrawer.scss';
import appState from '../store/appState';

@observer
export default class SideDrawer extends Component {

  constructor(props, context) {
    super(props, context);
  }

  handleToggle = () => {
    appState.toggleDrawer();
  }

  render() {

    return (
      <NavDrawer active={appState.showDrawer} width="normal"
        onOverlayClick={this.handleToggle}
        permanentAt="lg" scrollY={true}
        theme={barTheme}>
        scrollY={false}
        <div style={{ paddingTop: '6.4rem' }}>
          <Link href="#/"><i className="fa fa-home" style={{ paddingRight: '10px' }}></i>Home</Link>
          <Link href="#/keys"><i className="fa fa-key" style={{ paddingRight: '10px' }}></i>Manage Keys</Link>
          <Link href="#/config"><i className="fa fa-gear" style={{ paddingRight: '10px' }}></i>Config</Link>
        </div>
      </NavDrawer>
    );
  }
}