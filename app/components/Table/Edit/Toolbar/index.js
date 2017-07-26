import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import AddIcon from 'material-ui/svg-icons/content/add-circle';
import UpdateIcon from 'material-ui/svg-icons/action/update';
import PreviewIcon from 'material-ui/svg-icons/image/remove-red-eye';
import SaveIcon from 'material-ui/svg-icons/file/cloud-upload';
import ExportIcon from 'material-ui/svg-icons/file/file-download';
import RaisedButton from 'material-ui/RaisedButton';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import Time from 'components/Time';

type TableEditToolbarProps = {
  showDialog: Function,
  handleSaveChanges: Function,
  handleExportCSV: Function,
  previewChanges: Function,
  updatedAt: string,
  disabled: boolean,
  saving: boolean,
  saveBtnRef: any
}

const TableEditToolbar = ({ showDialog, handleSaveChanges, handleExportCSV, previewChanges, updatedAt, disabled, saving, saveBtnRef }: TableEditToolbarProps) => (
  <div>
    <Toolbar
      style={{ paddingRight: 0, backgroundColor: 'none', marginBottom: '5px' }}
    >
      <ToolbarGroup firstChild>
        <FlatButton
          label="Add column"
          icon={<AddIcon />}
          style={{ margin: 0 }}
          onClick={showDialog('addField')}
          disabled={disabled}
        />
        <FlatButton
          label="Export"
          icon={<ExportIcon />}
          onClick={handleExportCSV}
          disabled={saving || disabled}
          style={{ marginLeft: 0 }}
        />
      </ToolbarGroup>
      <ToolbarGroup>
        <div>
          <UpdateIcon /> <Time explicit>{updatedAt}</Time>
        </div>
        <RaisedButton
          label="Preview"
          icon={<PreviewIcon />}
          onClick={previewChanges}
          disabled={saving || disabled}
        />
        <RaisedButton
          ref={saveBtnRef}
          label="Save"
          icon={<SaveIcon />}
          onClick={handleSaveChanges}
          disabled={saving || disabled}
          style={{ marginLeft: 0 }}
        />
        <RaisedButton
          label="Get End Point"
          primary
          style={{ marginLeft: 0 }}
          onClick={showDialog('getEndPoint')}
          disabled={disabled}
        />
      </ToolbarGroup>
    </Toolbar>
  </div>
);

export default TableEditToolbar;
