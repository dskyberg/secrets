import React, { Component } from 'react';
import RegionChooser from '../components/RegionChooser';
import BucketChooser from '../components/BucketChooser';
import KeyChooser from '../components/KeyChooser';
import theme from './ConfigPage.scss';

export default class ConfigPage extends Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {

    return (
      <section className={theme.section} >
        <KeyChooser />
        <RegionChooser />
        <BucketChooser />
      </section>
    );
  }
}
