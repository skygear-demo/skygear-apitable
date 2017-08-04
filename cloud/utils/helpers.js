/* eslint-disable no-underscore-dangle */

import got from 'got';
import queryString from 'query-string';
import moment from 'moment';
const skygearCloud = require('skygear/cloud');

export function parseJSON(json) {
  try {
    return JSON.parse(json);
  } catch (error) {
    throw new skygearCloud.SkygearError('Input data is invalid!', 422);
  }
}

export function checkDate(date) {
  return moment(date, 'DD/MM/YYYY', true).isValid();
}

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
    if (record[field] !== undefined) {
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

export async function trackEvent(category, action, label) {
  const data = {
    // API Version.
    v: '1',
    // Tracking ID / Property ID.
    tid: process.env.GA_TRACKING_ID,
    // Anonymous Client Identifier.
    cid: '555',
    // Event hit type.
    t: 'event',
    // Event category.
    ec: category,
    // Event action.
    ea: action,
    // Event label.
    el: label,
  };

  return await got.post(`http://www.google-analytics.com/collect?${queryString.stringify(data)}`);
}
