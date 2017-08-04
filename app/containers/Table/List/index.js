import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reset } from 'redux-form';
import CreateTableDialog from 'components/Table/List/CreateTableDialog';
import DeleteTableDialog from 'components/Table/List/DeleteTableDialog';
import TableList from 'components/Table/List';
import {
  loadTableList as loadTableListAction,
  showDialog as showDialogAction,
  hideDialog as hideDialogAction,
  createTable as createTableAction,
  setTablePendingDelete as setTablePendingDeleteAction,
  deleteTable as deleteTableAction,
} from '../actions';
import { showNotification as showNotificationAction } from '../../Notification/actions';

type TableListContainerProps = {
  dialog: any,
  loadTableList: Function,
  showDialog: Function,
  hideDialog: Function,
  createTable: Function,
  setTablePendingDelete: Function,
  deleteTable: Function,
  resetForm: Function,
  showNotification: Function,
  loading: boolean,
  page: number,
  hasMore: boolean,
  list: any,
  pendingDeleteTable: any
}

class TableListContainer extends Component {
  props: TableListContainerProps

  handleLoadMoreTables = () => {
    const { page, loadTableList } = this.props;
    loadTableList(page + 1);
  }

  handleCreateTable = (values) => {
    const name = values.get('name');
    const { createTable, showNotification, resetForm, hideDialog } = this.props;

    return new Promise((resolve, reject) => {
      createTable(name, resolve, reject);
    })
    .then(() => {
      showNotification(`Table ${name} has been created successfully!`);
      resetForm('createTable');
      hideDialog('createTable');
    })
    .catch(() => showNotification('Oops! Failed to create!'));
  };

  handleDeleteTable = () => {
    const { deleteTable, pendingDeleteTable, showNotification, hideDialog } = this.props;

    return new Promise((resolve, reject) => {
      deleteTable(pendingDeleteTable.get('id'), resolve, reject);
    })
    .then(() => {
      showNotification('Table has been deleted successfully!');
      hideDialog('deleteTable');
    })
    .catch(() => showNotification('Oops! Failed to delete!'));
  };

  showDialog = (name) => () => this.props.showDialog(name);
  hideDialog = (name) => () => this.props.hideDialog(name);

  render() {
    const { dialog, loading, page, list, pendingDeleteTable, setTablePendingDelete, hasMore } = this.props;

    return (
      <div>
        <CreateTableDialog
          show={dialog.get('createTable')}
          handleClose={this.hideDialog('createTable')}
          onSubmit={this.handleCreateTable}
        />
        <DeleteTableDialog
          show={dialog.get('deleteTable')}
          pendingDeleteTable={pendingDeleteTable}
          handleClose={this.hideDialog('deleteTable')}
          handleSubmit={this.handleDeleteTable}
        />
        <TableList
          loading={loading}
          hasMore={hasMore}
          page={page}
          list={list}
          handleLoadMoreTables={this.handleLoadMoreTables}
          showDialog={this.showDialog}
          setTablePendingDelete={setTablePendingDelete}
        />
      </div>
    );
  }
}

export default connect(
  (state) => ({
    dialog: state.get('table').get('dialog'),
    loading: state.get('table').get('loading'),
    page: state.get('table').get('page'),
    hasMore: state.get('table').get('hasMore'),
    list: state.get('table').get('list'),
    pendingDeleteTable: state.get('table').get('pendingDeleteTable'),
  }),
  {
    loadTableList: loadTableListAction,
    showDialog: showDialogAction,
    hideDialog: hideDialogAction,
    resetForm: reset,
    showNotification: showNotificationAction,
    createTable: createTableAction,
    setTablePendingDelete: setTablePendingDeleteAction,
    deleteTable: deleteTableAction,
  }
)(TableListContainer);
