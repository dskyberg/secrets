// @flow
import React, { Component, PropTypes } from 'react';
import Dropdown from 'react-toolbox/lib/dropdown';
import { observer } from 'mobx-react';
import theme from './BucketChooser.scss';
import s3State from '../store/s3State';


@observer
export default class BucketChooser extends Component {

  constructor(props, context) {
    super(props, context);
  }

  formatValues = (buckets) => {
    var values = [];

    if (buckets == null) {
      return values;
    }
    buckets.forEach((bucket) => {
      values.push({ value: bucket, label: bucket });
    });
    return values;
  }

  formatLabel = (buckets) => {
    return buckets == null || buckets.length == 0 ? 'Fetching buckets...' : 'Select S3 Bucket';
  }

  handleChange = (value) => {
    s3State.setBucket(value);
  };

  render() {
    const {bucket, buckets, bucketCount} = s3State;
    const label = this.formatLabel(buckets);
    const values = this.formatValues(buckets);
    const disabled = bucketCount == 0;

    return (
      <Dropdown theme={theme}
        disabled={disabled}
        auto
        label={label}
        onChange={this.handleChange}
        source={values}
        value={bucket}
      />
    );
  }
}
