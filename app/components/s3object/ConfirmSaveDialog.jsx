import React, { Component, PropTypes } from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import kmsState from '../../store/kmsState';
import appState from '../../store/appState';


export default class ConfirmSaveDialog extends Component {
  static propTypes = {
    obj: PropTypes.any.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    active: PropTypes.bool.isRequired,
  }

  handleCancel = () => {
    this.props.onCancel();
  }

  /**
   * The user has opted to save the updated value
   */
  handleSave = () => {
    this.props.onSave();
  }

  render() {
    const {active} = this.props;
    const actions = [
      { label: "Cancel", onClick: this.handleCancel },
      { label: "Save", onClick: this.handleSave }
    ];

    return (
      <Dialog
        actions={actions}
        active={active}
        title={'Upload Object'}
      >
        {'Are you sure you want to upload to S3?'}
      </Dialog>
    );
  }
}
