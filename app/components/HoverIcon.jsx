import React, { Component, PropTypes } from 'react';
import { Button, IconButton } from 'react-toolbox/lib/button';
import theme from './HoverIcon.scss';

export default class HoverIcon extends Component {
  static propTypes = {
    accent: PropTypes.bool,
    primary: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    children: PropTypes.any
  }
  static defaultProps = {
    disabled: false,
    onClick: null
  }
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const {accent, primary, disabled, children, onClick} = this.props;
    return (
      <IconButton theme={theme} accent={accent} primary={primary} disabled={disabled} onClick={onClick}>
        {children}
      </IconButton>
    )
  }
}