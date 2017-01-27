// @flow
import React, { Component, PropTypes } from 'react';
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import S3Object from './s3object/S3Object';
import SearchInput from './SearchInput';
import { observer } from 'mobx-react';
import s3State from '../store/s3State';
import appState from '../store/appState';

import theme from './S3ObjectList.scss';

@observer
export default class S3ObjectList extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      selected: ''
    };

  }

  formatValues = (objects, count) => {
    if (objects === null || count === 0) {
      return null;
    }
    const keys = objects.keys();
    return keys.map((value) => {
      <Card>
        <CardTitle title={value.path} />

      </Card>
    });

  }
  handleSelect = (path) => {
    console.log('S3ObjectList.handleSelect:', path);
    if (path === this.state.selected) {
      this.setState({ selected: '' })
    } else {
      this.setState({ selected: path })
    }
  }

  render() {
    const {selected} = this.state;
    const {s3Objects, fetchingBuckets, fetchingPrefixes, fetchingObjects} = s3State;
    const {searchText} = appState;

    if (fetchingBuckets || fetchingPrefixes || fetchingObjects) {
      return <h2 className={theme.fetching}>Fetching your objects...</h2>;
    }
    if (s3Objects.length === 0 ){
      return null;
    }

    return (
      <section style={{ padding: 20 }}>
        <SearchInput />
        {
          s3Objects.keys().map((item) => {
            if (item.includes(searchText)) {
              return <S3Object
                key={item}
                path={item}
                active={selected === item}
                onClick={this.handleSelect.bind(this, item)} />
            }
          })
        }
      </section>
    );
  }
}
