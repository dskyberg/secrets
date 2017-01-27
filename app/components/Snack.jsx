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
    const active = appState.snackActive;
    const label = appState.snackLabel;
    return (
      <Snackbar
        action='Dismiss'
        active={active}
        label={label}
        timeout={2000}
        onClick={this.handleClick}
        onTimeout={this.handleTimeout}
        type='warning'
      />
    );
  }
}
