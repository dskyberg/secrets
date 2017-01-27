import React, { Component } from 'react';
import { observer } from 'mobx-react';
import fs from 'fs';
import Tooltip from 'react-toolbox/lib/tooltip';
import { Button, IconButton } from 'react-toolbox/lib/button';
import { Input } from 'react-toolbox/lib/input';
import RegionChooser from '../components/RegionChooser';
import BucketChooser from '../components/BucketChooser';
import KeyChooser from '../components/KeyChooser';
import S3Vault from '../utils/s3_vault';

import appState from '../store/appState';
import awsState from '../store/awsState';
import s3State from '../store/s3State';
import kmsState from '../store/kmsState';

import theme from './AddObjectPage.scss';

const TooltipIconButton = Tooltip(Button);
const TooltipInput = Tooltip(Input);

@observer
export default class AddObjectPage extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      path: null,
      content: null
    }
  }

  handleFolderOpen = () => {
    const {dialog} = require('electron').remote
    dialog.showOpenDialog({ properties: ['openFile'] }, (fileNames) => {
      if (!fileNames) {
        console.log('handleFolderOpen: cancelled');
        return;
      }
      const path = fileNames[0].startsWith('/') && fileNames[0].substr(1) || fileNames[0];
      fs.readFile(fileNames[0], (err, content) => {
        if (err) {
          alert("An error ocurred reading the file :" + err.message);
          return;
        }
        this.setState({path: path, content: content});
      });
    });
  }

  handleUpload = () => {
    if (this.state.path === null || this.state.content === null) {
      return;
    }
    this.saveObject();
  }

  handleCancel = () => {
    this.props.router.push('/');
  }

  handleChange = (name, value) => {
    //console.log('handleChange', name, value);
    switch (name) {
      case 'path':
        this.setState({ path: value });
        break;
      case 'content':
        this.setState({ content: value });
    }
  }

  actions = [
    { label: "Cancel", onClick: this.props.onCancel },
    { label: "Save", onClick: this.props.onSave }
  ];

  render() {
    let path = this.state.path;
    if (path === null) path = '';
    let content = this.state.content;
    if (content  === null ) content = '';

    const {prefix, bucket} = s3State;
  
    return (
      <div>
        <section className={theme.section}>
          <TooltipIconButton
            theme={theme}
            primary
            floating
            ripple
            onClick={this.handleFolderOpen}
            tooltip="You can select a file to preload the path and content"
            tooltipDelay={500}
            tooltipPosition='right' >
            <i className="fa fa-folder-open-o"></i>
          </TooltipIconButton>

        </section>
        <section className={theme.section}>
          <TooltipInput type='text'
            theme={theme}
            label="Path"
            onChange={this.handleChange.bind(this, 'path')}
            value={path}
            tooltip={`The path will be appended to s3://${bucket}/${prefix}/`}
            tooltipDelay={1000}
            tooltipPosition='top'
          />
          <TooltipInput type='text'
            theme={theme}
            label="Content"
            onChange={this.handleChange.bind(this, 'content')}
            multiline={true}
            value={content}
            tooltip='Add or edit the object content'
            tooltipDelay={1000}
            tooltipPosition='top'
          />
        </section>
        <section className={theme.section} >
          <TooltipIconButton
            theme={theme}
            primary
            floating
            ripple
            onClick={this.handleUpload}
            tooltip="Send this object to S3"
            tooltipDelay={1000}
            tooltipPosition='right' >
            <i className="fa fa-cloud-upload"></i>
          </TooltipIconButton>
          <TooltipIconButton
            theme={theme}
            className={theme.banButton}
            accent
            floating
            ripple
            onClick={this.handleCancel}
            tooltip="Cancel, and return to the list of items"
            tooltipDelay={1000}
            tooltipPosition='right' >
            <i className="fa fa-ban"></i>
          </TooltipIconButton>
        </section>
      </div>
    );
  }

  saveObject = () => {
    const {path, content} = this.state;
    const obj = new S3Vault(s3State.bucket, s3State.prefix, path, null);
    obj.save(kmsState.key, awsState.context, content)
    .then((ok) => {
      s3State.setS3Object(path, obj);
      appState.setSnackLabel('Object added: ' + path);
      appState.toggleSnack();
      this.props.router.push('/');
    })
    .catch((e) => {
      appState.setSnackLabel('Add Object failed: ' + e);
      appState.toggleSnack();
    });
  } 

}
