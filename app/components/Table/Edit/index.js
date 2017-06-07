import React, { Component } from 'react';
import { cleanup } from 'utils/helpers';
import Layout from '../../Layout';
import Loading from '../../Loading';
import Header from './Header';
import Toolbar from './Toolbar';
import Container from './Container';
import GetStarted from '../GetStarted';
import Spreadsheet from './Spreadsheet';

const defaultMessage = (loading) => loading ? <Loading /> : <GetStarted>Add a field to get started ...</GetStarted>;

type TableEditProps = {
  loading: boolean,
  table: any,
  saving: boolean,
  showDialog: Function,
  hideDialog: Function,
  handleAddTableField: Function,
  handleSaveChanges: Function
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
      createdRecords: {
        ...createdRecords,
      },
      deletedRecords: [
        ...deletedRecords,
      ],
    });
  };

  resetChanges = () => this.setState({ changes: {}, createdRecords: {}, deletedRecords: [] });

  handleSaveChanges = () => {
    const { changes, createdRecords } = this.state;
    this.props.handleSaveChanges(changes, cleanup(createdRecords), this.resetChanges);
  }

  props: TableEditProps

  render() {
    const { loading, table, saving, showDialog, hideDialog, handleAddTableField } = this.props;

    return (
      <Layout>
        <Container>
          <Header>{table.get('name')}</Header>
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
              fields={table.get('fields')}
              records={table.get('records')}
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
