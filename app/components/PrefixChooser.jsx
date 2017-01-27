// @flow
import React, { Component, PropTypes } from 'react';
import Dropdown from 'react-toolbox/lib/dropdown';
import { inject } from 'react-tunnel';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import theme from './PrefixChooser.scss';
import s3State from '../store/s3State';

@observer
export default class PrefixChooser extends Component {

  constructor(props, context) {
    super(props, context);
  }

  formatValues = (prefixes) => {
    var values = [];

    prefixes.forEach((prefix) => {
      values.push({ value: prefix, label: prefix });
    });
    return values;
  }

  formatLabel = (fetchingPrefixes) => {
    return fetchingPrefixes === true ? 'Fetching prefixes...' : 'Select S3 Prefix';
  }

  handleChange = (value) => {
    s3State.setPrefix(value);
  };

  render() {
    const {prefix, prefixes, fetchingPrefixes} = s3State;
    const label = this.formatLabel(fetchingPrefixes);
    const values = this.formatValues(prefixes);
    const disabled = fetchingPrefixes;

    return (
      <Dropdown theme={theme}
        disabled={disabled}
        auto
        label={label}
        onChange={this.handleChange}
        source={values}
        value={prefix}
      />
    );
  }
}
