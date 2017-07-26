/* eslint-disable no-unused-vars */

import React, { Component } from 'react';
import pikaday from 'expose-loader?Pikaday!pikaday';
import ZeroClipboard from 'expose-loader?ZeroClipboard!zeroclipboard';
import Handsontable from 'handsontable/dist/handsontable.full';
import HotTable from 'react-handsontable';
import 'handsontable/dist/handsontable.full.css';
import { getCellTypeName, getCellTypes } from 'utils/cellTypes';
import { getCellValidators } from 'utils/cellValidators';
import HotTableContainer from './HotTableContainer';

type SpreadsheetProps = {
  hotRef: mixed,
  fields: any,
  records: any,
  withChanges: Function,
  changes: mixed,
  deletedRecords: mixed,
  contextMenu: mixed,
  handleChange: Function,
  handleCreateRow: Function,
  handleRemoveRow: Function,
  handleScroll: Function
}

class Spreadsheet extends Component {
  shouldComponentUpdate(nextProps) {
    return !this.props.fields.equals(nextProps.fields) || !this.props.records.equals(nextProps.records);
  }

  props: SpreadsheetProps

  render() {
    const { hotRef, fields, records, withChanges, changes, deletedRecords, contextMenu, handleChange, handleCreateRow, handleRemoveRow, handleScroll } = this.props;

    return (
      <HotTableContainer>
        <HotTable
          root="hot"
          ref={hotRef}
          colHeaders={fields.toJS().map((field) => `${field.name} [${getCellTypeName(field.type)}${field.allowEmpty ? '?' : ''}]`)}
          columns={fields.toJS().map((field) => ({ data: field.data, ...getCellTypes(field.type, field.allowEmpty), ...getCellValidators(field.type, field.allowEmpty), allowEmpty: field.allowEmpty }))}
          data={withChanges(records, changes, deletedRecords).toJS()}
          rowHeaders
          contextMenu={contextMenu()}
          stretchH="all"
          minSpareRows={1}
          afterChange={handleChange}
          afterCreateRow={handleCreateRow}
          afterRemoveRow={handleRemoveRow}
          afterScrollVertically={handleScroll}
        />
      </HotTableContainer>
    );
  }
}

export default Spreadsheet;
