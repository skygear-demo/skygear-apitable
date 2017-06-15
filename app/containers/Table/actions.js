import {
  SHOW_DIALOG,
  HIDE_DIALOG,
  CREATE_TABLE,
  CREATE_TABLE_SUCCESS,
  SET_TABLE_PENDING_DELETE,
  DELETE_TABLE,
  DELETE_TABLE_SUCCESS,
  LOAD_TABLE_LIST,
  LOAD_TABLE_LIST_SUCCESS,
  LOAD_TABLE_RECORDS,
  LOAD_TABLE_RECORDS_SUCCESS,
  SAVE_TABLE_RECORDS,
  SAVE_TABLE_RECORDS_SUCCESS,
  ADD_TABLE_FIELD,
  SET_FIELD_PENDING_REMOVE,
  REMOVE_TABLE_FIELD,
  ISSUE_TOKEN,
  ISSUE_TOKEN_SUCCESS,
  REVOKE_TOKEN,
  REVOKE_TOKEN_SUCCESS,
  RENAME_TABLE,
} from './constants';

export function showDialog(name) {
  return {
    type: SHOW_DIALOG,
    payload: {
      name,
    },
  };
}

export function hideDialog(name) {
  return {
    type: HIDE_DIALOG,
    payload: {
      name,
    },
  };
}

export function createTable(name, resolve, reject) {
  return {
    type: CREATE_TABLE,
    payload: {
      name,
    },
    resolve,
    reject,
  };
}

export function createTableSuccess({ _id, name, updatedAt }) {
  return {
    type: CREATE_TABLE_SUCCESS,
    payload: {
      table: {
        id: _id,
        name,
        updatedAt,
        tokens: [],
      },
    },
  };
}

export function setTablePendingDelete(id, name) {
  return {
    type: SET_TABLE_PENDING_DELETE,
    payload: {
      id,
      name,
    },
  };
}

export function deleteTable(id, resolve, reject) {
  return {
    type: DELETE_TABLE,
    payload: {
      id,
    },
    resolve,
    reject,
  };
}

export function deleteTableSuccess(id) {
  return {
    type: DELETE_TABLE_SUCCESS,
    payload: {
      id,
    },
  };
}

export function loadTableList() {
  return {
    type: LOAD_TABLE_LIST,
  };
}

export function loadTableListSuccess(list) {
  return {
    type: LOAD_TABLE_LIST_SUCCESS,
    payload: {
      list,
    },
  };
}

export function loadTableRecords(id) {
  return {
    type: LOAD_TABLE_RECORDS,
    payload: {
      id,
    },
  };
}

export function loadTableRecordsSuccess({ id, name, fields, records, tokens, updatedAt }) {
  return {
    type: LOAD_TABLE_RECORDS_SUCCESS,
    payload: {
      id,
      name,
      fields,
      records,
      tokens,
      updatedAt,
    },
  };
}

export function saveTableRecords(id, changes, createdRecords, resolve, reject) {
  return {
    type: SAVE_TABLE_RECORDS,
    payload: {
      id,
      changes,
      createdRecords,
    },
    resolve,
    reject,
  };
}

export function saveTableRecordsSuccess() {
  return {
    type: SAVE_TABLE_RECORDS_SUCCESS,
  };
}

export function addTableField(id, name, type, allowEmpty, data, resolve, reject) {
  return {
    type: ADD_TABLE_FIELD,
    payload: {
      id,
      name,
      type,
      allowEmpty,
      data,
    },
    resolve,
    reject,
  };
}

export function setFieldPendingRemove(fieldNames) {
  return {
    type: SET_FIELD_PENDING_REMOVE,
    payload: {
      fieldNames,
    },
  };
}

export function removeTableField(id, fieldNames, resolve, reject) {
  return {
    type: REMOVE_TABLE_FIELD,
    payload: {
      id,
      fieldNames,
    },
    resolve,
    reject,
  };
}

export function issueToken(id, resolve, reject) {
  return {
    type: ISSUE_TOKEN,
    payload: {
      id,
    },
    resolve,
    reject,
  };
}

export function issueTokenSuccess(token) {
  return {
    type: ISSUE_TOKEN_SUCCESS,
    payload: {
      token,
    },
  };
}

export function revokeToken(token, resolve, reject) {
  return {
    type: REVOKE_TOKEN,
    payload: {
      token,
    },
    resolve,
    reject,
  };
}

export function revokeTokenSuccess(token) {
  return {
    type: REVOKE_TOKEN_SUCCESS,
    payload: {
      token,
    },
  };
}

export function renameTable(id, name, resolve, reject) {
  return {
    type: RENAME_TABLE,
    payload: {
      id,
      name,
    },
    resolve,
    reject,
  };
}
