// @flow
import React, { Component, PropTypes } from 'react';
import Input from 'react-toolbox/lib/input';
import { observer } from 'mobx-react';
import theme from './ContextInput.scss';
import awsState from '../store/awsState';

@observer
export default class ContextInput extends Component {

  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
  }


  handleChange = (value) => {
    awsState.setContext(value);
  };

  render() {
    const {context} = awsState;

    return (
      <Input type='text'
        label="Default Context"
        onChange={this.handleChange}
        value={context}
      />
    );
  }
}
