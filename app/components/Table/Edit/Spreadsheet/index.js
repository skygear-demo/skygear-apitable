/* eslint-disable no-unused-vars */

import React, { Component } from 'react';
import pikaday from 'expose-loader?Pikaday!pikaday';
import ZeroClipboard from 'expose-loader?ZeroClipboard!zeroclipboard';
import Handsontable from 'handsontable/dist/handsontable.full';
import HotTable from 'react-handsontable';
import 'handsontable/dist/handsontable.full.css';
import { getCellTypeName, getCellTypes } from 'utils/cellTypes';
import HotTableContainer from './HotTableContainer';

type SpreadsheetProps = {
  fields: any,
  records: any,
  contextMenu: mixed,
  handleChange: Function,
  handleCreateRow: Function,
  handleRemoveRow: Function,
}

class Spreadsheet extends Component {
  shouldComponentUpdate(nextProps) {
    return !this.props.fields.equals(nextProps.fields) || !this.props.records.equals(nextProps.records);
  }

  props: SpreadsheetProps

  render() {
    const { fields, records, contextMenu, handleChange, handleCreateRow, handleRemoveRow } = this.props;

    return (
      <HotTableContainer>
        <HotTable
          colHeaders={fields.toJS().map((field) => `${field.name} [${getCellTypeName(field.type)}]`)}
          columns={fields.toJS().map((field) => ({ data: field.data, ...getCellTypes(field.type), allowEmpty: field.allowEmpty }))}
          data={records.toJS()}
          rowHeaders
          contextMenu={contextMenu()}
          stretchH="all"
          minSpareRows={1}
          afterChange={handleChange}
          afterCreateRow={handleCreateRow}
          afterRemoveRow={handleRemoveRow}
        />
      </HotTableContainer>
    );
  }
}

export default Spreadsheet;
