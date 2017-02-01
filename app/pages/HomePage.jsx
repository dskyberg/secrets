// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import S3ObjectList from '../components/S3ObjectList';
import PrefixChooser from '../components/PrefixChooser';
import ContextInput from '../components/ContextInput';
import FAB from '../components/FAB';
import AddObject from '../components/addObject/AddObject';
import appState from '../store/appState';
import theme from './HomePage.scss';

@observer
export default class HomePage extends Component {

  constructor(props, context) {
    super(props, context);

  }

  handleFabClick = () => {
    this.props.router.push('/add');
  }

  handleAddObjectSave = () => {
    appState.toggleAddObject();
  }

  handleAddObjectCancel = () => {
    appState.toggleAddObject();
  }

  render() {
    const active = appState.addObjectShow;

    return (
      <div>
        <section className={theme.section}>
          <PrefixChooser />
          <ContextInput />
        </section>
        <S3ObjectList />
        <AddObject
          active={active}
          onSave={this.handleAddObjectSave}
          onCancel={this.handleAddObjectCancel}
        />
        <FAB onClick={this.handleFabClick} />
      </div>
    );
  }
}
