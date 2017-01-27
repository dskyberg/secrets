// @flow
import React, { Component, PropTypes } from 'react';
import Input from 'react-toolbox/lib/input';
import { observer } from 'mobx-react';
import theme from './SearchInput.scss';
import appState from '../store/appState';

@observer
export default class SearchInput extends Component {

  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
  }


  handleChange = (value) => {
    appState.setSearchText(value);
  };

  render() {
    const {searchText} = appState;
    const icon = <i className="fa fa-search"></i>;
    return (
      <div>
        <Input type='text' theme={theme}
          label="Search"
          onChange={this.handleChange}
          value={searchText}
          icon={icon}
        />
      </div>
    );
  }
}
