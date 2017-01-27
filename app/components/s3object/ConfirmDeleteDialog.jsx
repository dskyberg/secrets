import React, { Component, PropTypes } from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import appState from '../../store/appState';
import s3State from '../../store/s3State';


export default class ConfirmDeleteS3ObjectDialog extends Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    obj: PropTypes.any.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
  }

  handleCancel = (e) => {
    this.props.onCancel(e);
  }

  handleDelete = (e) => {
    this.props.onSave(e);
  }

  render() {
    const {active} = this.props;
    const actions = [
      { label: "Cancel", onClick: this.handleCancel },
      { label: "Delete", onClick: this.handleDelete }
    ];

    return (
      <Dialog
        actions={actions}
        active={active}
        title="Confirm Delete"
      >
        {'Are you sure you want to delete this object?'}
      </Dialog>
    );
  }
}
