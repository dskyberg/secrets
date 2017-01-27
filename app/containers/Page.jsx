// @flow
import React, { Component, PropTypes } from 'react';

import theme from './Page.scss';

export default class App extends Component {
  static propsTypes = {
    children: PropTypes.any
  }

  constructor(props, context) {
    super(props, context);
  }

  render() {
    const {children} = this.props;

    return (
      <div className={theme.page}>
        {children}
      </div>
    );
  }
}
