import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reset } from 'redux-form';
import AddFieldDialog from 'components/Table/Edit/AddFieldDialog';
import GetEndPointDialog from 'components/Table/Edit/GetEndPointDialog';
import TableEdit from 'components/Table/Edit';
import { APP_NAME } from '../../../configs';
import {
  showDialog as showDialogAction,
  hideDialog as hideDialogAction,
  loadTableRecords as loadTableRecordsAction,
  saveTableRecords as saveTableRecordsAction,
  addTableField as addTableFieldAction,
  issueToken as issueTokenAction,
  revokeToken as revokeTokenAction,
} from '../actions';
import { showNotification as showNotificationAction } from '../../Notification/actions';

type TableEditContainerProps = {
  dialog: any,
  table: any,
  loading: boolean,
  saving: boolean,
  params: any,
  showDialog: Function,
  hideDialog: Function,
  showNotification: Function,
  loadTableRecords: Function,
  saveTableRecords: Function,
  addTableField: Function,
  issueToken: Function,
  revokeToken: Function,
  resetForm: Function
}

class TableEditContainer extends Component {
  props: TableEditContainerProps

  handleAddTableField = (values) => {
    const { params: { id }, hideDialog, addTableField, resetForm } = this.props;
    const name = values.get('name');
    const type = values.get('type');
    const allowEmpty = !!values.get('allowEmpty');
    const data = values.get('data');

    return new Promise((resolve, reject) => {
      addTableField(id, name, type, allowEmpty, data, resolve, reject);
    })
    .then(() => {
      hideDialog('addField');
      resetForm('addField');
    });
  };

  handleSaveChanges = (changes, createdRecords, resetChanges) => {
    const { params: { id }, loadTableRecords, saveTableRecords, showNotification } = this.props;
    const hasChanges = !!(Object.keys(changes).length + Object.keys(createdRecords).length);

    if (hasChanges) {
      return new Promise((resolve, reject) => {
        saveTableRecords(id, changes, createdRecords, resolve, reject);
      })
      .then(() => {
        showNotification('Changes have been saved successfully!');
        resetChanges();
        loadTableRecords(id);
      })
      .catch(() => showNotification('Oops! Failed to save changes!'));
    }

    return showNotification('There are no unsaved changes.');
  }

  handleIssueToken = () => {
    const { params: { id }, issueToken, showNotification } = this.props;

    return new Promise((resolve, reject) => {
      issueToken(id, resolve, reject);
    })
    .then(() => showNotification('Token has been issued successfully!'))
    .catch(() => showNotification('Oops! Failed to issue token!'));
  }

  handleRevokeToken = (token) => () => {
    const { revokeToken, showNotification } = this.props;

    return new Promise((resolve, reject) => {
      revokeToken(token, resolve, reject);
    })
    .then(() => showNotification('Token has been revoked successfully!'))
    .catch(() => showNotification('Oops! Failed to revoke token!'));
  }

  showDialog = (name) => () => this.props.showDialog(name);
  hideDialog = (name) => () => this.props.hideDialog(name);

  render() {
    const { params: { id }, dialog, table, loading, saving } = this.props;

    return (
      <div>
        <AddFieldDialog
          show={dialog.get('addField')}
          handleClose={this.hideDialog('addField')}
          onSubmit={this.handleAddTableField}
        />

        {!loading && <GetEndPointDialog
          appName={APP_NAME}
          id={id}
          tokens={table.get('tokens')}
          show={dialog.get('getEndPoint')}
          handleClose={this.hideDialog('getEndPoint')}
          handleIssueToken={this.handleIssueToken}
          handleRevokeToken={this.handleRevokeToken}
        />}

        <TableEdit
          loading={loading}
          table={table}
          showDialog={this.showDialog}
          handleSaveChanges={this.handleSaveChanges}
          saving={saving}
        />
      </div>
    );
  }
}

export default connect(
  (state) => ({
    dialog: state.get('table').get('dialog'),
    table: state.get('table').get('data'),
    loading: state.get('table').get('loading'),
    saving: state.get('table').get('saving'),
  }),
  {
    showDialog: showDialogAction,
    hideDialog: hideDialogAction,
    showNotification: showNotificationAction,
    loadTableRecords: loadTableRecordsAction,
    saveTableRecords: saveTableRecordsAction,
    addTableField: addTableFieldAction,
    issueToken: issueTokenAction,
    revokeToken: revokeTokenAction,
    resetForm: reset,
  }
)(TableEditContainer);
