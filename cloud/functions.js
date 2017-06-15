/* eslint-disable no-underscore-dangle */

const skygear = require('skygear');
const skygearCloud = require('skygear/cloud');

function getContainer() {
  const container = new skygearCloud.CloudCodeContainer();
  container.apiKey = skygearCloud.settings.masterKey;
  container.endPoint = `${skygearCloud.settings.skygearEndpoint}/`;
  return container;
}

const Table = skygear.Record.extend('table');
const TableRecord = skygear.Record.extend('tableRecord');
const TableAccessToken = skygear.Record.extend('tableAccessToken');
const skygearContainer = getContainer();
const skygearDB = new skygear.Database('_union', skygearContainer);

async function fetchTable(id, token) {
  if (!token || token === '') {
    throw new Error('You must provide a Table Access Token!');
  }

  const tokenQuery = (new skygear.Query(TableAccessToken))
    .equalTo('_id', token)
    .equalTo('table', id);
  const tokenQueryResult = await skygearDB.query(tokenQuery);

  if (tokenQueryResult.length === 0) {
    throw new Error('The Table Access Token is invalid for this table.');
  }

  const tableQuery = (new skygear.Query(Table))
    .equalTo('_id', id);
  const tableQueryResult = await skygearDB.query(tableQuery);

  if (!tableQueryResult[0]) {
    throw new Error('Table is not found!');
  }

  const tableRecordQuery = (new skygear.Query(TableRecord))
    .equalTo('table', id)
    .addAscending('_created_at');
  const tableRecordQueryResult = await skygearDB.query(tableRecordQuery);

  const fields = tableQueryResult[0].fields.map((field) => field.data);

  const records = tableRecordQueryResult
    .map((_record) => {
      const record = {};
      for (let i = 0; i < fields.length; i += 1) {
        const field = fields[i];
        record[field] = _record.data[field];
      }
      return record;
    });

  const table = {
    name: tableQueryResult[0].name,
    records,
    updatedAt: tableQueryResult[0].updatedAt,
  };

  return table;
}

async function checkOwner(tableId, ownerId) {
  const tableQuery = (new skygear.Query(Table))
    .equalTo('_id', tableId)
    .equalTo('_owner_id', ownerId);
  const tableQueryResult = await skygearDB.query(tableQuery);
  return (tableQueryResult.length !== 0);
}

skygearCloud.afterSave('table', async (record, originalRecord, pool) => {
  const hasField = !!(record.fields.length);
  if (!hasField) {
    await pool.query('DELETE FROM "app_apitable"."tableRecord" WHERE "table" = $1::text', [record._id]);
  }
}, {
  async: false,
});

skygearCloud.beforeSave('tableAccessToken', async (record) => {
  const valid = await checkOwner(record.table, record.ownerID);
  if (!valid) {
    throw new Error('Only the owner can issue a new token!');
  }
  return record;
}, {
  async: false,
});

skygearCloud.handler('api/tables', async (req) => {
  try {
    const table = await fetchTable(req.url.query.id, req.url.query.token);
    return {
      ok: true,
      table,
    };
  } catch (error) {
    return {
      ok: false,
      error: {
        name: error.name,
        code: error.code,
        message: error.message,
      },
    };
  }
}, {
  method: ['GET'],
  userRequired: false,
});
