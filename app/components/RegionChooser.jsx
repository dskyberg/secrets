// @flow
import React, { Component, PropTypes } from 'react';
import Dropdown from 'react-toolbox/lib/dropdown';
import { inject } from 'react-tunnel';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import theme from './RegionChooser.scss';
import awsState from '../store/awsState';

@observer
export default class RegionChooser extends Component {

  constructor(props, context) {
    super(props, context);
  }

  formatValues = (regions) => {
    var values = [];

    if (regions == null) {
      return values;
    }
    regions.forEach((region) => {
      values.push({ value: region, label: region });
    });
    return values;
  }

  formatLabel = (regions) => {
    return regions == null || regions.length == 0 ? 'Fetching regions...' : 'Select AWS Region';
  }

  handleChange = (value) => {
    awsState.setRegion(value);
  };

  render() {
    const {region, regions, regionsCount} = awsState;
    const label = this.formatLabel(regions);
    const values = this.formatValues(regions);
    const disabled = regionsCount == 0;

    return (
      <Dropdown theme={theme}
        disabled={disabled}
        auto
        label={label}
        onChange={this.handleChange}
        source={values}
        value={region}
      />
    );
  }
}
