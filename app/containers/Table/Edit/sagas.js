/* eslint-disable no-underscore-dangle */

import skygear from 'skygear';
import { takeEvery } from 'redux-saga';
import { take, call, put, cancel } from 'redux-saga/effects';
import { push, LOCATION_CHANGE } from 'react-router-redux';
import { NotFoundError } from 'utils/errors';
import {
  LOAD_TABLE_RECORDS,
  SAVE_TABLE_RECORDS,
  ADD_TABLE_FIELD,
  ISSUE_TOKEN,
  REVOKE_TOKEN,
} from '../constants';
import {
  loadTableRecords as loadTableRecordsAction,
  loadTableRecordsSuccess,
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

    yield put(loadTableRecordsSuccess(table));
  } catch (error) {
    if (error instanceof NotFoundError) {
      yield put(push('/errors/404'));
    }
  }
}

export function* saveTableRecords({ payload: { id, changes, createdRecords }, resolve, reject }) {
  const rowIds = Object.keys(changes);
  const createdRecordsIds = Object.keys(createdRecords);
  const recordsToSave = [];
  const recordsToDelete = [];

  try {
    /* Process changes for existing records */
    for (let i = 0; i < rowIds.length; i += 1) {
      const rowId = rowIds[i];
      const isDeleteRequest = changes[rowId].$delete;

      const tableRecordQuery = (new skygear.Query(TableRecord))
        .equalTo('table', id)
        .equalTo('_id', rowId);
      const tableRecordQueryResult = yield call([skygear.privateDB, skygear.privateDB.query], tableRecordQuery);
      if (tableRecordQueryResult[0]) {
        if (isDeleteRequest) {
          // User requested to delete a row
          recordsToDelete.push(tableRecordQueryResult[0]);
        } else {
          // User requested to edit a row
          const tableRecord = tableRecordQueryResult[0];
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
      // Fetch the table, and save it to update updatedAt
      const tableQuery = (new skygear.Query(Table))
        .equalTo('_id', id);
      const tableQueryResult = yield call([skygear.privateDB, skygear.privateDB.query], tableQuery);
      const table = tableQueryResult[0];

      yield call([skygear.privateDB, skygear.privateDB.save], [table, ...recordsToSave]);
    }

    if (recordsToDelete.length > 0) {
      yield call([skygear.privateDB, skygear.privateDB.delete], recordsToDelete);
    }

    yield put(saveTableRecordsSuccess());
    yield put(loadTableRecordsAction(id));
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

export function* tableEditData() {
  const loadTableRecordsWatcher = yield takeEvery(LOAD_TABLE_RECORDS, loadTableRecords);
  const saveTableRecordsWatcher = yield takeEvery(SAVE_TABLE_RECORDS, saveTableRecords);
  const addTableFieldWatcher = yield takeEvery(ADD_TABLE_FIELD, addTableField);
  const issueTokenWatcher = yield takeEvery(ISSUE_TOKEN, issueToken);
  const revokeTokenWatcher = yield takeEvery(REVOKE_TOKEN, revokeToken);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel([
    loadTableRecordsWatcher,
    saveTableRecordsWatcher,
    addTableFieldWatcher,
    issueTokenWatcher,
    revokeTokenWatcher,
  ]);
}

// Bootstrap sagas
export default [
  tableEditData,
];
