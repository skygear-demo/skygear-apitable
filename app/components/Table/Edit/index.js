import React, { Component } from 'react';
import _ from 'lodash';
import FlatButton from 'material-ui/FlatButton';
import { cleanup } from 'utils/helpers';
import Layout from '../../Layout';
import Loading from '../../Loading';
import Toolbar from './Toolbar';
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
  handleAddTableField: Function,
  handleSaveChanges: Function,
  setFieldPendingRemove: Function
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
      const index = change[0][0];
      const record = this.stateRecords().get(index);
      const column = change[0][1];
      const oldValue = change[0][2];
      const newValue = change[0][3];

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
        newChanges[recordId] = { $delete: true };
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
    const hotInstance = this.hot.hotInstance;
    const lastRow = hotInstance.countRows() - 1;
    hotInstance.updateSettings({
      minSpareRows: 0,
    });
    const emptyRowCount = hotInstance.countEmptyRows(true);
    hotInstance.alter('remove_row', (lastRow - emptyRowCount) + 1, emptyRowCount);
    hotInstance.validateCells((isValid) => {
      const { changes, createdRecords } = this.state;
      const { handleSaveChanges } = this.props;
      if (isValid) {
        handleSaveChanges(changes, cleanup(createdRecords), this.resetChanges);
      }
    });
    hotInstance.updateSettings({
      minSpareRows: 1,
    });
  }

  props: TableEditProps

  render() {
    const { loading, table, saving, showDialog, hideDialog, handleAddTableField } = this.props;

    return (
      <Layout>
        <Container style={{ display: 'flex', flexDirection: 'column' }}>
          <div>
            <FlatButton
              label={table.get('name')}
              style={{ margin: 0 }}
              labelStyle={{ fontSize: '24px', textTransform: 'none' }}
              onClick={showDialog('renameTable')}
              disabled={loading}
            />
          </div>
          <Toolbar
            showDialog={showDialog}
            hideDialog={hideDialog}
            handleAddTableField={handleAddTableField}
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
              contextMenu={this.contextMenu}
              handleChange={this.handleChange}
              handleCreateRow={this.handleCreateRow}
              handleRemoveRow={this.handleRemoveRow}
            /> : defaultMessage(loading)}
        </Container>
      </Layout>
    );
  }
}

export default TableEdit;
