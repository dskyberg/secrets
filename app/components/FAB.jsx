import React, { Component, PropTypes } from 'react';
import { Button } from 'react-toolbox/lib/button';
import theme from './FAB.scss';

export default class FAB extends Component {
  static propTYpes = {
    onClick: PropTypes.func
  }

  constructor(props, context) {
    super(props, context);
  }

  render() {
    const {onClick} = this.props;
    return (
      <Button icon='add' floating accent mini theme={theme} onClick={onClick} />
    )
  }
}