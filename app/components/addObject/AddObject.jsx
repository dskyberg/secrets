// @flow
import React, { Component, PropTypes } from 'react';
import { Dialog } from 'react-toolbox/lib/dialog';
import Tooltip from 'react-toolbox/lib/tooltip';
import { Button, IconButton } from 'react-toolbox/lib/button';
import { Input } from 'react-toolbox/lib/input';
import { observer } from 'mobx-react';
import theme from './AddObject.scss';

import appState from '../../store/appState';
import awsState from '../../store/awsState';

const TooltipIconButton = Tooltip(Button);

@observer
export default class AddObject extends Component {

  static propTypes = {
    active: PropTypes.bool.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      path: '',
      obj: ''
    }
  }
  handleFolderOpen = () => {

  }

  handleChange = (name, value) => {
    switch (name) {
      case 'path':
        this.setState({ path: value });
        break;
      case 'obj':
        this.setState({ obj: value });
    }
  }

  actions = [
    { label: "Cancel", onClick: this.props.onCancel },
    { label: "Save", onClick: this.props.onSave }
  ];

  render() {
    const {active} = this.props;
    const path = appState.addObjectPath;
    const value = appState.addObjectValue;


    return (

      <Dialog
        theme={theme}
        title='Add Object'
        actions={this.actions}
        active={active}
      >
        <section>
          <TooltipIconButton
            primary
            onClick={this.FolderOpen}
            tooltip="You can select a file to preload the path and content"
            tooltipDelay={1000} >
            <i className="fa fa-folder-open-o"></i>
          </TooltipIconButton>
          <Input type='text'
            label="Path"
            onChange={this.handleChange.bind(this, 'path')}
            value={path}
          />
        </section>
        <section>
          <Input type='text'
            label="content"
            onChange={this.handleChange.bind(this, 'obj')}
            multiline={true}
            rows={4}
            value={value}
          />
        </section>
      </Dialog>
    );
  }
}
