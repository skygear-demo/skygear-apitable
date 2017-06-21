/* eslint-disable no-underscore-dangle */

import skygear from 'skygear';
import { takeEvery } from 'redux-saga';
import { take, call, put, cancel } from 'redux-saga/effects';
import { push, LOCATION_CHANGE } from 'react-router-redux';
import { NotFoundError } from 'utils/errors';
import {
  LOAD_TABLE_RECORDS,
  LOAD_MORE_TABLE_RECORDS,
  SAVE_TABLE_RECORDS,
  ADD_TABLE_FIELD,
  REMOVE_TABLE_FIELD,
  ISSUE_TOKEN,
  REVOKE_TOKEN,
  RENAME_TABLE,
} from '../constants';
import {
  loadTableRecords as loadTableRecordsAction,
  loadTableRecordsSuccess,
  loadMoreTableRecordsSuccess,
  saveTableRecordsSuccess,
  issueTokenSuccess,
  revokeTokenSuccess,
} from '../actions';

const Table = skygear.Record.extend('table');
const TableRecord = skygear.Record.extend('tableRecord');
const TableAccessToken = skygear.Record.extend('tableAccessToken');

export function* loadTableRecords({ payload: { id } }) {
  try {
    const tableQuery = (new skygear.Query(Table))
      .equalTo('_id', id);
    const tableQueryResult = yield call([skygear.privateDB, skygear.privateDB.query], tableQuery);

    if (tableQueryResult.length === 0) {
      throw new NotFoundError();
    }

    const tableRecordQuery = (new skygear.Query(TableRecord))
      .equalTo('table', id)
      .addAscending('_created_at');
    tableRecordQuery.overallCount = true;
    const tableRecordQueryResult = yield call([skygear.privateDB, skygear.privateDB.query], tableRecordQuery);
    const records = tableRecordQueryResult.map((record) => ({ _recordId: record._id, ...record.data }));

    const tokenQuery = (new skygear.Query(TableAccessToken))
      .equalTo('table', id)
      .addDescending('_created_at');
    const tokenQueryResult = yield call([skygear.privateDB, skygear.privateDB.query], tokenQuery);
    const tokens = tokenQueryResult.map((tokenRecord) => tokenRecord._id);

    const table = {
      id: tableQueryResult[0]._id,
      name: tableQueryResult[0].name,
      fields: tableQueryResult[0].fields,
      records,
      tokens,
      updatedAt: tableQueryResult[0].updatedAt,
    };

    const hasMore = tableRecordQueryResult.overallCount > 50;

    yield put(loadTableRecordsSuccess(table, hasMore));
  } catch (error) {
    if (error instanceof NotFoundError) {
      yield put(push('/errors/404'));
    }
  }
}

export function* loadMoreTableRecords({ payload: { id, page } }) {
  const tableRecordQuery = (new skygear.Query(TableRecord))
    .equalTo('table', id)
    .addAscending('_created_at');
  tableRecordQuery.overallCount = true;
  tableRecordQuery.page = page;
  const tableRecordQueryResult = yield call([skygear.privateDB, skygear.privateDB.query], tableRecordQuery);
  const records = tableRecordQueryResult.map((record) => ({ _recordId: record._id, ...record.data }));
  const hasMore = tableRecordQueryResult.overallCount > (page * 50);

  yield put(loadMoreTableRecordsSuccess(records, hasMore));
}

export function* saveTableRecords({ payload: { id, changes, createdRecords }, resolve, reject }) {
  const rowIds = Object.keys(changes);
  const createdRecordsIds = Object.keys(createdRecords);
  const recordsToSave = [];
  const recordsToDelete = [];
  const tableReocrdsQuery = (new skygear.Query(TableRecord))
    .equalTo('table', id)
    .contains('_id', rowIds);
  tableReocrdsQuery.limit = 1000;
  const tableReocrdsQueryResult = yield call([skygear.privateDB, skygear.privateDB.query], tableReocrdsQuery);

  try {
    /* Process changes for existing records */
    for (let i = 0; i < rowIds.length; i += 1) {
      const rowId = rowIds[i];
      const isDeleteRequest = changes[rowId].$delete;

      const rowData = tableReocrdsQueryResult
        .filter((row) => row._id === rowId)[0];

      if (rowData) {
        if (isDeleteRequest) {
          // User requested to delete a row
          recordsToDelete.push(rowData);
        } else {
          // User requested to edit a row
          const tableRecord = rowData;
          tableRecord.data = {
            ...tableRecord.data,
            ...changes[rowId],
          };
          recordsToSave.push(tableRecord);
        }
      }
    }

    /* Process newly created records */
    for (let i = 0; i < createdRecordsIds.length; i += 1) {
      const rowId = createdRecordsIds[i];
      const tableRecord = new TableRecord({
        table: new skygear.Reference(`table/${id}`),
        data: createdRecords[rowId],
      });
      recordsToSave.push(tableRecord);
    }

    if (recordsToSave.length > 0) {
      /* Save the table once to update updateAt */
      const table = new Table({
        _id: `table/${id}`,
      });

      yield call([skygear.privateDB, skygear.privateDB.save], [table, ...recordsToSave]);
    }

    if (recordsToDelete.length > 0) {
      yield call([skygear.privateDB, skygear.privateDB.delete], recordsToDelete);
    }

    yield put(saveTableRecordsSuccess());
    resolve();
  } catch (error) {
    reject();
  }
}

export function* addTableField({ payload: { id, name, type, allowEmpty, data }, resolve, reject }) {
  try {
    const query = (new skygear.Query(Table))
      .equalTo('_id', id);
    const queryResult = yield call([skygear.privateDB, skygear.privateDB.query], query);
    const table = queryResult[0];
    table.fields.push({
      name,
      type,
      allowEmpty,
      data,
    });
    yield call([skygear.privateDB, skygear.privateDB.save], table);
    resolve();
  } catch (error) {
    reject();
  }
}

export function* removeTableField({ payload: { id, fieldNames }, resolve, reject }) {
  try {
    const tableQuery = (new skygear.Query(Table))
      .equalTo('_id', id);
    const tableQueryResult = yield call([skygear.privateDB, skygear.privateDB.query], tableQuery);
    const table = tableQueryResult[0];
    table.fields = table.fields.filter((field) => !fieldNames.includes(field.data));
    yield call([skygear.privateDB, skygear.privateDB.save], table);
    yield put(loadTableRecordsAction(id));
    resolve();
  } catch (error) {
    reject();
  }
}

export function* issueToken({ payload: { id }, resolve, reject }) {
  try {
    const token = new TableAccessToken({
      table: new skygear.Reference(`table/${id}`),
    });
    const savedToken = yield call([skygear.privateDB, skygear.privateDB.save], token);
    yield put(issueTokenSuccess(savedToken._id));
    resolve();
  } catch (error) {
    reject();
  }
}

export function* revokeToken({ payload: { token }, resolve, reject }) {
  try {
    yield call([skygear.privateDB, skygear.privateDB.delete], {
      id: `tableAccessToken/${token}`,
    });
    yield put(revokeTokenSuccess(token));
    resolve();
  } catch (error) {
    reject();
  }
}

export function* renameTable({ payload: { id, name }, resolve, reject }) {
  try {
    const tableQuery = (new skygear.Query(Table))
      .equalTo('_id', id);
    const tableQueryResult = yield call([skygear.privateDB, skygear.privateDB.query], tableQuery);
    const table = tableQueryResult[0];
    table.name = name;
    yield call([skygear.privateDB, skygear.privateDB.save], table);
    resolve();
  } catch (error) {
    reject();
  }
}

export function* tableEditData() {
  const loadTableRecordsWatcher = yield takeEvery(LOAD_TABLE_RECORDS, loadTableRecords);
  const loadMoreTableRecordsWatcher = yield takeEvery(LOAD_MORE_TABLE_RECORDS, loadMoreTableRecords);
  const saveTableRecordsWatcher = yield takeEvery(SAVE_TABLE_RECORDS, saveTableRecords);
  const addTableFieldWatcher = yield takeEvery(ADD_TABLE_FIELD, addTableField);
  const removeTableFieldWatcher = yield takeEvery(REMOVE_TABLE_FIELD, removeTableField);
  const issueTokenWatcher = yield takeEvery(ISSUE_TOKEN, issueToken);
  const revokeTokenWatcher = yield takeEvery(REVOKE_TOKEN, revokeToken);
  const renameTableWatcher = yield takeEvery(RENAME_TABLE, renameTable);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(
    loadTableRecordsWatcher,
    loadMoreTableRecordsWatcher,
    saveTableRecordsWatcher,
    addTableFieldWatcher,
    removeTableFieldWatcher,
    issueTokenWatcher,
    revokeTokenWatcher,
    renameTableWatcher,
  );
}

// Bootstrap sagas
export default [
  tableEditData,
];
