import React, { Component, PropTypes } from 'react';
import Snackbar from 'react-toolbox/lib/snackbar';
import { observer } from 'mobx-react';
import theme from './Snack.scss';
import appState from '../store/appState';

export default class Snack extends Component {
  constructor(props, context) {
    super(props, context);
  }

  handleTimeout = (event, instance) => {
    appState.toggleSnack();
  };

  handleClick = () => {
    appState.toggleSnack();
  };


  render() {
    const action = appState.snackAction;
    const active = appState.snackActive;
    const label =  appState.snackLabel;
    const timeout = appState.snackTimeout;
    const type = appState.snackType;
    return (
      <Snackbar
        action={action}
        active={active}
        label={label}
        timeout={timeout}
        onClick={this.handleClick}
        onTimeout={this.handleTimeout}
        type='warning'
      />
    );
  }
}
