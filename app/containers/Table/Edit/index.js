import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reset } from 'redux-form';
import AddFieldDialog from 'components/Table/Edit/AddFieldDialog';
import RemoveFieldDialog from 'components/Table/Edit/RemoveFieldDialog';
import GetEndPointDialog from 'components/Table/Edit/GetEndPointDialog';
import RenameTableDialog from 'components/Table/Edit/RenameTableDialog';
import TableEdit from 'components/Table/Edit';
import { APP_NAME } from '../../../configs';
import {
  showDialog as showDialogAction,
  hideDialog as hideDialogAction,
  loadMoreTableRecords as loadMoreTableRecordsAction,
  saveTableRecords as saveTableRecordsAction,
  addTableField as addTableFieldAction,
  removeTableField as removeTableFieldAction,
  setFieldPendingRemove as setFieldPendingRemoveAction,
  issueToken as issueTokenAction,
  revokeToken as revokeTokenAction,
  renameTable as renameTableAction,
} from '../actions';
import { showNotification as showNotificationAction } from '../../Notification/actions';

type TableEditContainerProps = {
  dialog: any,
  table: any,
  loading: boolean,
  saving: boolean,
  pendingRemoveField: mixed,
  params: any,
  showDialog: Function,
  hideDialog: Function,
  showNotification: Function,
  loadMoreTableRecords: Function,
  saveTableRecords: Function,
  addTableField: Function,
  setFieldPendingRemove: Function,
  removeTableField: Function,
  issueToken: Function,
  revokeToken: Function,
  renameTable: Function,
  resetForm: Function
}

class TableEditContainer extends Component {
  props: TableEditContainerProps

  handleAddTableField = (values) => {
    const { params: { id }, table, hideDialog, addTableField, showNotification, resetForm } = this.props;
    const name = values.get('name');
    const type = values.get('type');
    const allowEmpty = !!values.get('allowEmpty');
    const data = values.get('data');

    const fieldExists = !!(table.get('fields').filter((field) => field.get('data') === data).size);

    if (!fieldExists) {
      return new Promise((resolve, reject) => {
        addTableField(id, name, type, allowEmpty, data, resolve, reject);
      })
      .then(() => {
        hideDialog('addField');
        resetForm('addField');
      });
    }

    return showNotification(`Columns with data name '${data}' already exists!`);
  };

  handleRemoveFields = () => {
    const { params: { id }, hideDialog, removeTableField, pendingRemoveField, showNotification } = this.props;
    hideDialog('removeField');
    return new Promise((resolve, reject) => {
      removeTableField(id, pendingRemoveField, resolve, reject);
    })
    .then(() => showNotification('Columns have been removed successfully!'));
  }

  handleSaveChanges = (changes, createdRecords, resetChanges) => {
    const { params: { id }, saveTableRecords, showNotification } = this.props;
    const hasChanges = !!(Object.keys(changes).length + Object.keys(createdRecords).length);

    if (hasChanges) {
      return new Promise((resolve, reject) => {
        saveTableRecords(id, changes, createdRecords, resolve, reject);
      })
      .then(() => {
        showNotification('Changes have been saved successfully!');
        resetChanges();
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

  handleRenameTable = (values) => {
    const { params: { id }, hideDialog, renameTable, showNotification, resetForm } = this.props;
    const name = values.get('name');

    return new Promise((resolve, reject) => {
      renameTable(id, name, resolve, reject);
    })
    .then(() => {
      showNotification('Table has been renamed successfully!');
      hideDialog('renameTable');
      resetForm('renameTable');
    })
    .catch(() => showNotification('Oops! Failed to revoke token!'));
  }

  showDialog = (name) => () => this.props.showDialog(name);
  hideDialog = (name) => () => this.props.hideDialog(name);

  render() {
    const { params: { id }, dialog, table, loading, saving, setFieldPendingRemove, pendingRemoveField, showNotification, loadMoreTableRecords } = this.props;

    return (
      <div>
        <AddFieldDialog
          show={dialog.get('addField')}
          handleClose={this.hideDialog('addField')}
          onSubmit={this.handleAddTableField}
        />

        <RemoveFieldDialog
          show={dialog.get('removeField')}
          fields={pendingRemoveField}
          handleClose={this.hideDialog('removeField')}
          handleRemoveFields={this.handleRemoveFields}
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

        <RenameTableDialog
          show={dialog.get('renameTable')}
          handleClose={this.hideDialog('renameTable')}
          onSubmit={this.handleRenameTable}
        />

        <TableEdit
          loading={loading}
          table={table}
          showDialog={this.showDialog}
          handleSaveChanges={this.handleSaveChanges}
          setFieldPendingRemove={setFieldPendingRemove}
          showNotification={showNotification}
          loadMoreTableRecords={loadMoreTableRecords}
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
    pendingRemoveField: state.get('table').get('pendingRemoveField'),
  }),
  {
    showDialog: showDialogAction,
    hideDialog: hideDialogAction,
    showNotification: showNotificationAction,
    loadMoreTableRecords: loadMoreTableRecordsAction,
    saveTableRecords: saveTableRecordsAction,
    addTableField: addTableFieldAction,
    setFieldPendingRemove: setFieldPendingRemoveAction,
    removeTableField: removeTableFieldAction,
    issueToken: issueTokenAction,
    revokeToken: revokeTokenAction,
    renameTable: renameTableAction,
    resetForm: reset,
  }
)(TableEditContainer);
