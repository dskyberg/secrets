// @flow
import React, { Component, PropTypes } from 'react';
import Dropdown from 'react-toolbox/lib/dropdown';
import { inject } from 'react-tunnel';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import theme from './KeyChooser.scss';
import kmsState from '../store/kmsState';

@observer
export default class KeyChooser extends Component {

  constructor(props, context) {
    super(props, context);
  }

  formatValues = (keys) => {
    var values = [];

    if (keys == null) {
      return values;
    }
    keys.forEach((key) => {
      values.push({ value: key.KeyId, label: key.Description });
    });
    return values;
  }

  formatLabel = (length) => {
    return length == 0 ? 'Fetching keys ...' : 'Select Sneaker Master Key';
  }

  handleChange = (value) => {
    kmsState.setKey(value);
  };

  render() {
    const {key, keys, keysCount} = kmsState;
    const label = this.formatLabel(keysCount);
    const values = this.formatValues(keys);
    const disabled = keysCount == 0;

    return (
      <Dropdown
        disabled={disabled}
        auto
        label={label}
        onChange={this.handleChange}
        source={values}
        value={key}
      />
    );
  }
}
