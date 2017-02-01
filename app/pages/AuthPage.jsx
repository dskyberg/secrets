// @flow
import React, { Component } from 'react';
import { Button } from 'react-toolbox/lib/button';
import authN from '../api/authN';
import authState from '../store/authState';
import appState from '../store/appState';
import theme from './AuthPage.scss';

export default class AuthPage extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      authenticating: false
    };
  }

  handleClick = (e) => {
    if (e) {
      e.preventDefault();
    }
    if (this.state.authenticating === true) {
      return;
    }
    this.setState({ authenticating: true });

    authN()
      .then(ok => {
        const { location } = this.props
        if (location.state && location.state.nextPathname) {
          this.props.router.replace(location.state.nextPathname)
        } else {
          this.props.router.replace('/')
        }
      })
      .catch(err => {
        appState.showSnack(err.name + ':' + err.message, 'Login Failed', 'warning', 0);
      });
  }

  render() {
    const disabled = this.state.authenticating;
    return (
      <section className={theme.section}>
        <Button icon={<i className="fa fa-sign-in"></i>} label='Login' disabled={disabled} onClick={this.handleClick} />
      </section>
    );
  }

  componentDidMount = () => {
    this.handleClick();
  }
}
