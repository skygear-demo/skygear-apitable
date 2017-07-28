/* eslint-disable no-underscore-dangle */
/* @flow */

import React from 'react';
import styled from 'styled-components';
import reactStringReplace from 'react-string-replace';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import JSONPreview from './JSONPreview';

const LineAddition = styled.div`
  background: #e6ffed;
`;

const LineDeletion = styled.div`
  background: #ffeef0;
  text-decoration: line-through;
`;

const handleRecordId = (records) => records.map((_record) => {
  const record = _record;
  record.id = record._recordId;
  delete record._recordId;
  return record;
});

const formatDiff = (record, { changes, deletedRecords }) => {
  if (deletedRecords.includes(record.id)) {
    return <LineDeletion>{JSON.stringify(record, null, 2)}</LineDeletion>;
  }

  if (changes[record.id]) {
    let modifiedRecord = JSON.stringify(record, null, 2);
    const modifiedFields = Object.keys(changes[record.id]);
    modifiedFields.forEach((field) => {
      const oldKeyVal = `  "${field}": ${JSON.stringify(record[field])},\n`;
      const newKeyVal = `  "${field}": ${JSON.stringify(changes[record.id][field])},`;
      modifiedRecord = reactStringReplace(modifiedRecord, oldKeyVal, (match) => (
        <div key={`${record.id} ${field}`}>
          <LineDeletion>{match}</LineDeletion>
          <LineAddition>{newKeyVal}</LineAddition>
        </div>
      ));
    });
    return modifiedRecord;
  }

  return JSON.stringify(record, null, 2);
};

const formatCreatedRecords = (id, record) => <LineAddition key={id}>{JSON.stringify(record, null, 2)}</LineAddition>;

const displayDiff = (records, cache) => {
  const formattedDiff = [];
  const createdRecordIds = Object.keys(cache.createdRecords);
  records.forEach((record) => formattedDiff.push(formatDiff(record, cache)));
  createdRecordIds.forEach((id) => formattedDiff.push(formatCreatedRecords(id, cache.createdRecords[id])));
  return (formattedDiff.length > 0) ? formattedDiff.reduce((prev, curr) => [prev, ', ', curr]) : '';
};

const actions = (handleSave, handleClose) => [
  <FlatButton
    label="Cancel"
    onTouchTap={handleClose}
  />,
  <RaisedButton
    label="Save"
    primary
    onTouchTap={handleSave}
  />,
];

type PreviewDialogProps = {
  show: boolean,
  table: any,
  cache: any,
  handleClose: Function,
  saveBtn: any
}

const handleSave = (saveBtn, handleClose) => () => {
  saveBtn.props.onClick();
  handleClose();
};

const PreviewDialog = ({ show, table, cache, handleClose, saveBtn }: PreviewDialogProps) => (
  <Dialog
    title="Preview"
    actions={actions(handleSave(saveBtn, handleClose), handleClose)}
    modal
    open={show}
  >
    <JSONPreview>
      {displayDiff(handleRecordId(table.get('records').toJS()), cache.toJS())}
    </JSONPreview>
  </Dialog>
);

export default PreviewDialog;
