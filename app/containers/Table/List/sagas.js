/* eslint-disable no-underscore-dangle */

import skygear from 'skygear';
import { takeEvery } from 'redux-saga';
import { take, call, put, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import {
  CREATE_TABLE,
  DELETE_TABLE,
  LOAD_TABLE_LIST,
} from '../constants';
import {
  createTableSuccess,
  deleteTableSuccess,
  loadTableListSuccess,
} from '../actions';

const Table = skygear.Record.extend('table');
const TableAccessToken = skygear.Record.extend('tableAccessToken');

export function* createTable({ payload: { name }, resolve, reject }) {
  try {
    const table = yield call([skygear.privateDB, skygear.privateDB.save], new Table({
      name,
      fields: [],
    }));
    yield put(createTableSuccess(table));
    resolve();
  } catch (error) {
    reject();
  }
}

export function* deleteTable({ payload: { id }, resolve, reject }) {
  if (id) {
    yield call([skygear.privateDB, skygear.privateDB.save], new Table({
      _id: `table/${id}`,
      deletedAt: new Date(),
    }));
    yield put(deleteTableSuccess(id));
    resolve();
  } else {
    reject();
  }
}

export function* loadTableList() {
  const tableListQuery = (new skygear.Query(Table))
    .equalTo('deletedAt', null)
    .addDescending('_updated_at');
  const tableListQueryResult = yield call([skygear.privateDB, skygear.privateDB.query], tableListQuery);
  const tableIds = tableListQueryResult.map((table) => table._id);

  const tokenListQuery = (new skygear.Query(TableAccessToken))
    .contains('table', tableIds);
  const tokenListQueryResult = yield call([skygear.privateDB, skygear.privateDB.query], tokenListQuery);

  const list = tableListQueryResult.map((table) => ({
    id: table._id,
    name: table.name,
    updatedAt: table.updatedAt,
    tokens: tokenListQueryResult
      .filter((token) => token.table._id === `table/${table._id}`)
      .map((token) => token._id),
  }));
  yield put(loadTableListSuccess(list));
}

export function* tableListData() {
  const loadTableListWatcher = yield takeEvery(LOAD_TABLE_LIST, loadTableList);
  const deleteTableWatcher = yield takeEvery(DELETE_TABLE, deleteTable);
  const createTableWatcher = yield takeEvery(CREATE_TABLE, createTable);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(
    loadTableListWatcher,
    deleteTableWatcher,
    createTableWatcher,
  );
}

// Bootstrap sagas
export default [
  tableListData,
];
