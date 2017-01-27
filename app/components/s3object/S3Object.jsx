// @flow
import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import Input from 'react-toolbox/lib/input';
import { Avatar } from 'react-toolbox/lib/avatar';
import {Button, IconButton} from 'react-toolbox/lib/button';
import ConfirmSaveDialog from './ConfirmSaveDialog';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import HoverIcon from '../HoverIcon';
import { observer } from 'mobx-react';
import theme from './S3Object.scss';
import appState from '../../store/appState';
import s3State from '../../store/s3State';
import awsState from '../../store/awsState';
import kmsState from '../../store/kmsState';
import aws from '../../aws/AWS';
import S3Vault from '../../utils/s3_vault';
import StringView from '../../utils/stringView';

const iconClasses = {
  cancel: 'fa fa-ban',
  decrypt: 'fa fa-eye',
  delete: 'fa fa-trash-o',
  edit: 'fa fa-pencil',
  s3Save: 'fa fa-cloud-upload'
};

@observer 
export default class S3Object extends Component {

  static propTypes = {
    path: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
  }

  constructor(props, context) {
    super(props, context);
    //this.handleOpen = this.handleOpen.bind(this);
    // For some reason, the autorun around render (provided by @observer)
    // Is not forcing re-render when the obj is updated.  Putting it in 
    // this.state is a hack to work around that.
    this.state = {
      obj: s3State.s3Objects.get(props.path),
      newValue: null,
      confirmSaveDialogActive: false,
      confirmDeleteDialogActive: false,
      fetching: false,
      deleting: false
    };
  }



  handleFetch = (e) => {
    if (e) {
      e.stopPropagation();
    }
    this.fetchObject();
  }

  handleDelete = (e) => {
    if (e) {
      e.stopPropagation();
    }
    if (this.state.deleting === true) {
      return;
    }
    this.setState({deleting:true, confirmDeleteDialogActive:true});
  }

  /**
    * Enable editing by loading the newValue element in the local state.  Clearing
    * the newValue element will disable editing.
    */
  handleEdit = (e) => {
    if (e) {
      e.stopPropagation();
    }
    this.setState({newValue: this.state.obj.text()});
  }
  handleChange = (value, e) => {
    if (e) {
      e.stopPropagation();
    }
    this.setState({newValue: value});
  }
  handleSaveEdit = (e) => {
    if (e) {
      e.stopPropagation();
    }
    this.setState({confirmSaveDialogActive: true});
  }
  handleCancelEdit = (e) => {
    if (e) {
      e.stopPropagation();
    }
    this.setState({newValue: null});
  }


  /**
   * The user has opted to save the updated value
   */
  handleSaveDialog = (name, value, e) => {
    if (e) {
      e.stopPropagation();
    }
    switch (name) {
      case 'save':
        this.saveObject();
        this.setState({confirmSaveDialogActive: false, newValue: null});
        break;
      case 'delete':
        this.deleteObject();
        this.setState({confirmDeleteDialogActive: false});
       break;
      default:
        console.log('Oops!  handleSaveDialog got a weird name:', name);
    }
  }

  handleCancelDialog = (name, e) => {
    if (e) {
      e.stopPropagation();
    }
    switch (name) {
      case 'save':
        this.setState({newValue:null, confirmSaveDialogActive: false});
        break;
      case 'delete':
        this.setState({confirmDeleteDialogActive: false});
        break;
      default:
         console.log('Oops!  handleCancelDialog got a weird name:', name);
    }
  }
  

  renderFetchIcon = (obj) => {
    if (obj.value !== null) {
      return null;
    }

    const fetchDisabled = this.state.fetching === true;
    const eyeButton = (obj && obj.open) && null || 
     <IconButton theme={theme} accent disabled={fetchDisabled} onClick={this.handleFetch}>
        <i className="fa fa-eye"></i>
      </IconButton>;
    return eyeButton;
  }

 renderEditIcon = (obj) => {
    if (!this.props.active || obj.value === null || this.state.newValue !== null) {
      return null;
    }
    return  <HoverIcon accent onClick={this.handleEdit}>
        <i className={iconClasses.edit}></i>
      </HoverIcon>;

  }

  renderS3SaveIcon = (obj) => {
    if (!this.props.active || this.state.newValue === null) {
      return null;
    }
    return  <HoverIcon accent onClick={this.handleSaveEdit}>
        <i className={iconClasses.s3Save}></i>
      </HoverIcon>;

  }
  renderCancelIcon = (obj) => {
    if (!this.props.active || this.state.newValue === null) {
      return null;
    }
    return  <HoverIcon  accent onClick={this.handleCancelEdit}>
        <i className={iconClasses.cancel}></i>
      </HoverIcon>;

  }

  renderDeleteIcon = (obj) => {
    if (this.state.newValue !== null) {
      return null;
    }
    const fetchDisabled = this.state.fetching === true;
    return  <HoverIcon primary  onClick={this.handleDelete}>
        <i className={iconClasses.delete}></i>
      </HoverIcon>;

  }

  renderAvatar = (obj) => {
    const clz = obj.value !== null && 'fa fa-unlock' || 'fa fa-lock';
    return <Avatar><i className={clz} style={{paddingTop:'7px'}}></i></Avatar>;
  }

  renderCardTitle = (obj) => {
    const {onClick} = this.props;
    let subtitle;
    if (this.props.active) {
      subtitle = '';
    } else {
      if (obj.value !== null) {
        subtitle = obj.text();
       }
    }

    return <CardTitle theme={theme} onClick={onClick}>
        <div className={theme.titleBox} >
          <div className={theme.titleText}>{obj.path}</div>
          <div className={theme.subtitleText}>{subtitle}</div>
          {this.renderCardActions(obj)}
        </div>
      </CardTitle>
  }

  renderCardText = (obj) => {
    if (!this.props.active) {
      return null;
    }

    const {newValue} = this.state;
    if (newValue !== null) {
      return <Input type='text' theme={theme} multiline={true}
        onChange={this.handleChange}
        value={newValue}
      />;

    }
    const value = (obj && obj.value !== null) && obj.text() || null;
    return <CardText theme={theme}>
              {value}
          </CardText>;
  }

  renderCardActions = (obj) => {
    const clz = classNames(theme.titleIcons, {[theme.cardTitle__hover]: !this.props.active});
    return <div className={clz}>
            {this.renderEditIcon(obj)}
            {this.renderDeleteIcon(obj)}
            {this.renderS3SaveIcon(obj)}
            {this.renderCancelIcon(obj)}
          </div>
  }

  renderConfirmSaveDialog = () => {
    const {newValue} = this.state;
    return <ConfirmSaveDialog 
      obj={this.state.obj} 
      onCancel={this.handleCancelDialog.bind(this,'save')}
      onSave={this.handleSaveDialog.bind(this,'save')}
      active={this.state.confirmSaveDialogActive}
      />;
  }

  renderConfirmDeleteDialog = () => {
    return <ConfirmDeleteDialog
      obj={this.state.obj} 
      onCancel={this.handleCancelDialog.bind(this,'delete')}
      onSave={this.handleSaveDialog.bind(this,'delete')}
      active={this.state.confirmDeleteDialogActive}
      />;    
  }

  render() {
    const {obj} = this.state;
    return (
      <div>
      <Card theme={theme} raised>
          {this.renderCardTitle(obj)}
          {this.renderCardText(obj)}
       </Card>
      {this.renderConfirmSaveDialog()}
      {this.renderConfirmDeleteDialog()}
      </div>
    );
  }
  componentWillReceiveProps(nextProps) {
    // Opening for the first time
    if (nextProps.active === true && this.props.active === false) {
      if (this.state.obj !== null && this.state.obj.value === null) {
        this.fetchObject();
      }
    }
  }

  fetchObject = () => {
    if (this.state.fetching === true) {
      return;
    }
    this.setState({fetching:true});
     try {
      const {path} = this.props;
      const {s3Objects} = s3State;
      const obj = s3Objects.get(path);
      obj.open(kmsState.key, awsState.context)
      .then((ok) => {
        s3State.s3Objects.set(path, obj);
        this.setState({obj:obj, fetching:false});
      })
      .catch((e) => {
        //appState.setFetching(false);
        this.setState({fetching:false});
        console.log('S3Object.handleOpen failed:', e);
      });
    } catch (e) {
      //appState.setFetching(false);
      this.setState({fetching:false});
      console.log('S3Object.handleOpen - error:', e);
    }
  }
    
  saveObject = () => {
    const {obj, newValue} = this.state;
    obj.save(kmsState.key, awsState.context, newValue)
    .then((ok) => {
      this.setState({confirmSaveDialogActive: false, newValue: null, obj: obj});
      appState.setSnackLabel('Object saved: ' + obj.path);
      appState.toggleSnack();
    })
    .catch((e) => {
      appState.setSnackLabel('Save failed: ' + err);
      appState.toggleSnack();
    });
  } 

  deleteObject = () => {
    const {obj} = this.state;
    obj.delete()
    .then((ok) => {
      appState.setSnackLabel('Object deleted: ' + obj.path);
      appState.toggleSnack();
      s3State.deleteS3Object(obj.path);
    })
    .catch((err) => {
      appState.setSnackLabel('Delete failed: ' + err);
      appState.toggleSnack();
    });    
  }
}
