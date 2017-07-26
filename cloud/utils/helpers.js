/* eslint-disable no-underscore-dangle */

export function formatFields(fields) {
  return fields.map((field) => field.data);
}

export function formatRecords(records, fields) {
  return records
    .map((_record) => {
      const record = {
        id: _record._id,
      };
      for (let i = 0; i < fields.length; i += 1) {
        const field = fields[i];
        record[field] = _record.data[field];
      }
      return record;
    });
}

export function sanitizeNewRecord(record, fields) {
  const newRecord = {};
  fields.forEach((field) => {
    if (record[field]) {
      newRecord[field] = record[field];
    }
  });
  return newRecord;
}

export function getDataType(type) {
  switch (type) {
    case 'numeric':
      return 'number';
    case 'checkbox':
      return 'boolean';
    default:
      return 'string';
  }
}
