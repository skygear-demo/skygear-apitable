/* eslint-disable no-underscore-dangle */

import {
  parseJSON,
  checkDate,
  formatFields,
  formatRecords,
  sanitizeNewRecord,
  getDataType,
  trackEvent,
} from './utils/helpers';
import {
  TableNotFoundError,
  RecordNotFoundError,
  TokenInvalidError,
  TokenNotWritableError,
} from './utils/errors';
const skygear = require('skygear');
const skygearCloud = require('skygear/cloud');

function getContainer(userId) {
  const container = new skygearCloud.CloudCodeContainer({
    asUserId: userId,
  });
  container.apiKey = skygearCloud.settings.masterKey;
  container.endPoint = `${skygearCloud.settings.skygearEndpoint}/`;
  return container;
}

const Table = skygear.Record.extend('table');
const TableRecord = skygear.Record.extend('tableRecord');
const TableAccessToken = skygear.Record.extend('tableAccessToken');
const globalContainer = getContainer();
const skygearDB = new skygear.Database('_union', globalContainer);

async function checkToken(tableId, token, writableRequired) {
  if (!token || token === '') {
    throw new TokenInvalidError();
  }

  const tokenQuery = (new skygear.Query(TableAccessToken))
    .equalTo('_id', token)
    .equalTo('table', tableId);
  const tokenQueryResult = await skygearDB.query(tokenQuery);

  if (tokenQueryResult.length === 0) {
    throw new TokenInvalidError();
  }

  if (writableRequired && !tokenQueryResult[0].writable) {
    throw new TokenNotWritableError();
  }
}

async function fetchTable(tableId) {
  const tableQuery = (new skygear.Query(Table))
    .equalTo('_id', tableId);
  const tableQueryResult = await skygearDB.query(tableQuery);

  if (!tableQueryResult[0]) {
    throw new TableNotFoundError();
  }

  return tableQueryResult[0];
}

async function fetchRecords(tableId, limit, offset, sort) {
  const tableRecordQuery = (new skygear.Query(TableRecord))
    .equalTo('table', tableId);

  if (sort === 'desc') {
    tableRecordQuery.addDescending('_created_at');
  } else {
    tableRecordQuery.addAscending('_created_at');
  }

  tableRecordQuery.limit = limit;
  tableRecordQuery.offset = offset;
  tableRecordQuery.overallCount = true;
  const tableRecordQueryResult = await skygearDB.query(tableRecordQuery);

  return {
    items: tableRecordQueryResult,
    count: tableRecordQueryResult.overallCount,
  };
}

async function fetchRecord(tableId, recordId) {
  if (!recordId) {
    throw new RecordNotFoundError();
  }

  const tableRecordQuery = (new skygear.Query(TableRecord))
    .equalTo('table', tableId)
    .equalTo('_id', recordId);

  tableRecordQuery.limit = 1;

  const tableRecordQueryResult = await skygearDB.query(tableRecordQuery);

  if (!tableRecordQueryResult[0]) {
    throw new RecordNotFoundError();
  }

  return tableRecordQueryResult;
}

async function checkOwner(tableId, ownerId) {
  const tableQuery = (new skygear.Query(Table))
    .equalTo('_id', tableId)
    .equalTo('_owner_id', ownerId);
  const tableQueryResult = await skygearDB.query(tableQuery);
  return (tableQueryResult.length !== 0);
}

skygearCloud.afterSave('table', async (record, originalRecord, pool) => {
  /* If this is not a new table */
  if (originalRecord !== null) {
    const fields = record.fields;
    const oldFields = originalRecord.fields;

    /* Delete all records if the user deleted all fields */
    const hasField = !!(fields.length);
    if (!hasField) {
      await pool.query('DELETE FROM "app_apitable"."tableRecord" WHERE "table" = $1::text', [record._id]);
    }

    /* If the user deleted fields */
    if (hasField && (fields.length < oldFields.length)) {
      const jsonBuildObject = fields.map((field) => `'${field.data}', "data"->'${field.data}'`).join(', ');
      await pool.query(`UPDATE "app_apitable"."tableRecord" SET "data" = json_build_object(${jsonBuildObject}) WHERE "table" = $1::text`, [record._id]);
    }
  }
}, {
  async: false,
});

skygearCloud.beforeSave('tableRecord', async (_record) => {
  const record = _record;
  const tableId = record.table;
  const table = await fetchTable(tableId);
  const data = record.data;
  table.fields.forEach((field) => {
    if (data[field.data] === undefined && field.type === 'checkbox') {
      record.data[field.data] = false;
    }
    if ((data[field.data] === undefined && !field.allowEmpty) || (data[field.data] !== undefined && typeof data[field.data] !== getDataType(field.type)) || (data[field.data] && field.type === 'date' && !checkDate(data[field.data]))) { // eslint-disable-line valid-typeof
      throw new skygearCloud.SkygearError('Input data is invalid!', 422);
    }
  });
  return record;
}, {
  async: false,
});

skygearCloud.beforeSave('tableAccessToken', async (record) => {
  const valid = await checkOwner(record.table, record.ownerID);
  if (!valid) {
    throw new skygearCloud.SkygearError('You are not authrozied to issue a new Table Access Token for this table!', 401);
  }
  return record;
}, {
  async: false,
});

async function fetchTableHandler(tableId, token, _recordLimit, _recordOffset, _recordSort) {
  const recordLimit = parseInt(_recordLimit, 10) || 50;
  const recordOffset = parseInt(_recordOffset, 10) || 0;
  const recordSort = (_recordSort === 'desc') ? _recordSort : 'asc';

  await checkToken(tableId, token);
  const table = await fetchTable(tableId);
  const fields = formatFields(table.fields);
  const records = await fetchRecords(tableId, recordLimit, recordOffset, recordSort);
  const recordItems = formatRecords(records.items, fields);

  await trackEvent('APICall', 'Fetch records from the table', tableId);

  return {
    ok: true,
    table: {
      name: table.name,
      records: recordItems,
      recordCount: records.count,
      updatedAt: table.updatedAt,
    },
    limit: recordLimit,
    offset: recordOffset,
    sort: recordSort,
  };
}

async function fetchRecordHandler(tableId, recordId, token) {
  await checkToken(tableId, token);
  const table = await fetchTable(tableId);
  const fields = formatFields(table.fields);
  const record = await fetchRecord(tableId, recordId);
  const formattedRecord = formatRecords(record, fields);

  await trackEvent('APICall', 'Fetch a single record from the table', tableId);

  return {
    ok: true,
    table: {
      name: table.name,
      records: formattedRecord,
      updatedAt: table.updatedAt,
    },
  };
}

async function createRecord(table, body) {
  const newRecord = new TableRecord({
    table: new skygear.Reference(`table/${table._id}`),
    data: body,
  });

  return await saveRecord(table, newRecord);
}

async function createRecordHandler(tableId, token, body) {
  await checkToken(tableId, token, true);
  const table = await fetchTable(tableId);
  const fields = formatFields(table.fields);
  const saveResult = await createRecord(table, sanitizeNewRecord(parseJSON(body), fields));
  const savedRecords = saveResult.savedRecords;

  await trackEvent('APICall', 'Create a record for the table', tableId);

  return {
    ok: true,
    table: {
      name: table.name,
      records: [{
        id: savedRecords[1]._id,
        ...savedRecords[1].data,
      }],
      updatedAt: savedRecords[0].updatedAt,
    },
  };
}

async function deleteRecord(record) {
  const localContainer = getContainer(record.ownerID);
  const privateDB = new skygear.Database('_private', localContainer);

  return await privateDB.delete({
    id: `tableRecord/${record._id}`,
  });
}

async function saveRecord(table, record) {
  const localContainer = getContainer(table.ownerID);
  const privateDB = new skygear.Database('_private', localContainer);
  const savedRecord = await privateDB.save(record);
  // Save the table once to update updateAt timestamp.
  const savedTable = await privateDB.save(table);

  return {
    savedRecords: [
      savedTable,
      savedRecord,
    ],
  };
}

async function putRecordHandler(tableId, recordId, token, body) {
  await checkToken(tableId, token, true);
  const table = await fetchTable(tableId);
  const record = (await fetchRecord(tableId, recordId))[0];
  const fields = formatFields(table.fields);
  record.data = sanitizeNewRecord(parseJSON(body), fields);
  const saveResult = await saveRecord(table, record);
  const savedRecords = saveResult.savedRecords;

  await trackEvent('APICall', 'Update a record of the table', tableId);

  return {
    ok: true,
    message: 'The record has been successfully updated.',
    table: {
      name: table.name,
      records: [{
        id: savedRecords[1]._id,
        ...savedRecords[1].data,
      }],
      updatedAt: savedRecords[0].updatedAt,
    },
  };
}

async function deleteRecordHandler(tableId, recordId, token) {
  await checkToken(tableId, token, true);
  const record = await fetchRecord(tableId, recordId);
  await deleteRecord(record[0]);

  await trackEvent('APICall', 'Delete a record of the table', tableId);

  return {
    ok: true,
    message: 'The record has been deleted!',
  };
}

async function getTableResponse(req) {
  const { id, record, token, limit, offset, sort } = req.url.query;

  if (record) {
    return await fetchRecordHandler(id, record, token);
  }

  return await fetchTableHandler(id, token, limit, offset, sort);
}

async function postTableResponse(req) {
  const { url: { query: { id, token } }, body, headers } = req;
  const accessToken = (headers.Authorization) ? headers.Authorization[0] : token;

  return await createRecordHandler(id, accessToken, body);
}

async function putTableResponse(req) {
  const { url: { query: { id, record, token } }, body, headers } = req;
  const accessToken = (headers.Authorization) ? headers.Authorization[0] : token;

  return await putRecordHandler(id, record, accessToken, body);
}

async function deleteRecordResponse(req) {
  const { url: { query: { id, record, token } }, headers } = req;
  const accessToken = (headers.Authorization) ? headers.Authorization[0] : token;

  return await deleteRecordHandler(id, record, accessToken);
}

async function getResponse(req) {
  try {
    let response = {};

    switch (req.method) {
      case 'POST':
        response = await postTableResponse(req);
        break;
      case 'PUT':
        response = await putTableResponse(req);
        break;
      case 'DELETE':
        response = await deleteRecordResponse(req);
        break;
      default:
        response = await getTableResponse(req);
        break;
    }

    return response;
  } catch (error) {
    return {
      ok: false,
      error: {
        name: error.name,
        code: error.code || 500,
        message: error.message,
      },
    };
  }
}

skygearCloud.handler('api/tables', async (req) => {
  const response = await getResponse(req);
  const statusCode = response.error ? response.error.code : 200;

  return new skygearCloud.SkygearResponse({
    statusCode,
    body: JSON.stringify(response),
    headers: {
      'Content-Type': ['application/json; charset=utf-8'],
    },
  });
}, {
  method: ['GET', 'POST', 'PUT', 'DELETE'],
  userRequired: false,
});
