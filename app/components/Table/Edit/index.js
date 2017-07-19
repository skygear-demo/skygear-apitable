import React, { Component } from 'react';
import _ from 'lodash';
import { fromJS } from 'immutable';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { cleanup } from 'utils/helpers';
import Layout from '../../Layout';
import Loading from '../../Loading';
import Toolbar from './Toolbar';
import SummaryBar from './SummaryBar';
import Container from './Container';
import GetStarted from '../GetStarted';
import Spreadsheet from './Spreadsheet';

const defaultMessage = (loading) => loading ? <Loading /> : <GetStarted>Add a column to get started ...</GetStarted>;

type TableEditProps = {
  loading: boolean,
  table: any,
  saving: boolean,
  showDialog: Function,
  hideDialog: Function,
  showNotification: Function,
  handleAddTableField: Function,
  handleSaveChanges: Function,
  setFieldPendingRemove: Function,
  loadMoreTableRecords: Function,
  updateCache: Function
}

class TableEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changes: {},
      createdRecords: {},
      deletedRecords: [],
    };
  }

  shouldComponentUpdate(nextProps) {
    return !this.props.table.equals(nextProps.table) || (this.props.saving !== nextProps.saving) || (this.props.loading !== nextProps.loading);
  }

  stateRecords = () => this.props.table.get('records').filter((record) => !this.state.deletedRecords.includes(record.get('_recordId')));

  contextMenu = () => {
    const { table, setFieldPendingRemove, showDialog } = this.props;
    return {
      callback(key, options) {
        if (key === 'remove_field') {
          const startCol = options.start.col;
          const endCol = options.end.col;
          const colRange = _.range(startCol, endCol + 1);
          const fieldNames = colRange.map((col) => table.get('fields').get(col).get('data'));
          setFieldPendingRemove(fieldNames);
          showDialog('removeField')();
        }
      },
      items: {
        remove_row: {},
        remove_field: {
          name: 'Remove column',
        },
        hsep1: '---------',
        alignment: {},
      },
    };
  }

  handleChange = (change, source) => {
    if (source !== 'loadData') {
      for (let i = 0; i < change.length; i += 1) {
        const index = change[i][0];
        const record = this.stateRecords().get(index);
        const column = change[i][1];
        const oldValue = change[i][2];
        const newValue = change[i][3];

        if (oldValue !== newValue) {
          if (record) {
            /* This is an existing record */
            const oldChanges = this.state.changes;
            const recordId = record.get('_recordId');
            const newChanges = {
              [recordId]: {
                ...oldChanges[recordId],
                [column]: newValue,
              },
            };

            this.setState({
              changes: {
                ...oldChanges,
                ...newChanges,
              },
            });
          } else {
            /* This is a newly created record */
            const { createdRecords } = this.state;

            createdRecords[index] = {
              ...createdRecords[index],
              [column]: newValue,
            };

            this.setState({
              createdRecords: {
                ...createdRecords,
              },
            });
          }
        }
      }
    }
  }

  handleCreateRow = (index, amount) => {
    const { createdRecords } = this.state;

    for (let i = 0; i < amount; i += 1) {
      createdRecords[index + i] = {};
    }

    this.setState({
      createdRecords: {
        ...createdRecords,
      },
    });
  }

  handleRemoveRow = (index, amount) => {
    const oldChanges = this.state.changes;
    const newChanges = oldChanges;
    const { createdRecords, deletedRecords } = this.state;

    /* If it is an existing record
     * TODO: Push the recordId to deleteRecords array,
     * so that this.stateRecords() can filter out deleted existing records.
     * Otherwise, delete stored data of the new row */
    for (let i = 0; i < amount; i += 1) {
      const record = this.stateRecords().get(index);

      if (record) {
        const recordId = record.get('_recordId');
        deletedRecords.push(recordId);
      } else {
        delete createdRecords[index + i];
      }
    }

    /* TODO: Adjust keys of createdRecords */
    const createdRecordsKeys = Object.keys(createdRecords);
    for (let j = 0; j < createdRecordsKeys.length; j += 1) {
      if (createdRecordsKeys[j] > index) {
        const oldKey = createdRecordsKeys[j];
        const newKey = `${parseInt(oldKey, 10) - amount}`;
        createdRecords[newKey] = createdRecords[oldKey];
        delete createdRecords[oldKey];
      }
    }

    this.setState({
      changes: {
        ...oldChanges,
        ...newChanges,
      },
    });
  };

  resetChanges = () => this.setState({ changes: {}, createdRecords: {}, deletedRecords: [] });

  handleSaveChanges = () => {
    const { table, showNotification } = this.props;

    if (table.get('fields') && table.get('fields').size) {
      const hotInstance = this.hot.hotInstance;
      const lastRow = hotInstance.countRows() - 1;
      hotInstance.updateSettings({
        minSpareRows: 0,
      });
      const emptyRowCount = hotInstance.countEmptyRows(true);
      hotInstance.alter('remove_row', (lastRow - emptyRowCount) + 1, emptyRowCount);
      hotInstance.validateCells((isValid) => {
        const { changes, createdRecords, deletedRecords } = this.state;
        const { handleSaveChanges } = this.props;
        if (isValid) {
          handleSaveChanges(changes, cleanup(createdRecords), deletedRecords, this.resetChanges);
        } else {
          showNotification('You have entered invalid data, please edit or remove rows.');
        }
      });
      hotInstance.updateSettings({
        minSpareRows: 1,
      });
    } else {
      showNotification('There is no column.');
    }
  };

  handleScroll = () => {
    const { loading, table, loadMoreTableRecords } = this.props;

    if (!loading && table.get('hasMore')) {
      const page = table.get('page');
      const hotInstance = this.hot.hotInstance;
      const rowCount = hotInstance.countRows();
      const rowOffset = hotInstance.rowOffset();
      const visibleRows = hotInstance.countVisibleRows();
      const lastVisibleRow = rowOffset + visibleRows + (visibleRows / 2);
      const threshold = 15;

      if (lastVisibleRow > (rowCount - threshold)) {
        loadMoreTableRecords(table.get('id'), page + 1);
      }
    }
  };

  withChanges = (_records, changes, deletedRecords) => {
    const records = _records
      .filter((record) => !deletedRecords.includes(record.get('_recordId')))
      .map((record) => {
        const recordId = record.get('_recordId');
        if (changes[recordId]) {
          return record.mergeDeep(fromJS(changes[recordId]));
        }
        return record;
      });

    return records;
  };

  previewChanges = () => {
    const { showDialog, updateCache } = this.props;
    const { changes, createdRecords, deletedRecords } = this.state;
    updateCache(changes, cleanup(createdRecords), deletedRecords);
    showDialog('preview')();
  }

  props: TableEditProps

  render() {
    const { loading, table, saving, showDialog, hideDialog, handleAddTableField } = this.props;

    return (
      <Layout hideFooter>
        <Container style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <FlatButton
              label={table.get('name')}
              style={{ margin: 0 }}
              labelStyle={{ fontSize: '24px', textTransform: 'none' }}
              onClick={showDialog('renameTable')}
              disabled={loading}
            />
            <RaisedButton
              label="Feedback"
              secondary
              href="https://docs.google.com/forms/d/e/1FAIpQLSeHUPZRPhNPUgvrssIzJBjplHvjZa70K0_WzUzqw2cXu7anMg/viewform"
              target="_blank"
              style={{ marginRight: 24 }}
            />
          </div>
          <Toolbar
            showDialog={showDialog}
            hideDialog={hideDialog}
            handleAddTableField={handleAddTableField}
            previewChanges={this.previewChanges}
            handleSaveChanges={this.handleSaveChanges}
            updatedAt={table.get('updatedAt')}
            disabled={loading}
            saving={saving}
          />
          {table.get('fields') && table.get('fields').size ?
            <Spreadsheet
              hotRef={(hot) => { this.hot = hot; }}
              fields={table.get('fields')}
              records={table.get('records')}
              withChanges={this.withChanges}
              changes={this.state.changes}
              deletedRecords={this.state.deletedRecords}
              contextMenu={this.contextMenu}
              handleChange={this.handleChange}
              handleCreateRow={this.handleCreateRow}
              handleRemoveRow={this.handleRemoveRow}
              handleScroll={this.handleScroll}
            /> : defaultMessage(loading)}
        </Container>
        <SummaryBar recordCount={table.get('recordCount')} />
      </Layout>
    );
  }
}

export default TableEdit;
