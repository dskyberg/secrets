// @flow
import React, { Component, PropTypes } from 'react';
import { Layout, Panel } from 'react-toolbox/lib/layout';
import { observer } from 'mobx-react';
import SideDrawer from './SideDrawer';
import AppHeader from './AppHeader';
import Snack from '../components/Snack';
import Page from './Page';
import appState from '../store/appState';

@observer
export default class App extends Component {
  static propsTypes = {
    children: PropTypes.any
  }
  state = {
    showDrawer: false
  }

  constructor(props, context) {
    super(props, context);
  }

  handleToggle = () => {
    this.setState({ showDrawer: !this.state.showDrawer });
  }

  render() {
    const snack = appState.snackActive;
    return (
      <Layout >
        <SideDrawer />
        <Panel scrollY={true}>
          <AppHeader />
          <Snack />
          <Page>
            {this.props.children}
          </Page>
        </Panel>
      </Layout>
    );
  }
}
