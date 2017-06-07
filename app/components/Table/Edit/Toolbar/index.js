import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import AddIcon from 'material-ui/svg-icons/content/add-circle';
import UpdateIcon from 'material-ui/svg-icons/action/update';
import SaveIcon from 'material-ui/svg-icons/file/cloud-upload';
import RaisedButton from 'material-ui/RaisedButton';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import Time from 'components/Time';

type TableEditToolbarProps = {
  showDialog: Function,
  handleSaveChanges: Function,
  updatedAt: string,
  disabled: boolean,
  saving: boolean
}

const TableEditToolbar = ({ showDialog, handleSaveChanges, updatedAt, disabled, saving }: TableEditToolbarProps) => (
  <div>
    <Toolbar
      style={{ paddingRight: 0, backgroundColor: 'none', marginBottom: '5px' }}
    >
      <ToolbarGroup firstChild>
        <FlatButton
          label="Add field"
          icon={<AddIcon />}
          style={{ margin: 0 }}
          onClick={showDialog('addField')}
          disabled={disabled}
        />
      </ToolbarGroup>
      <ToolbarGroup>
        <div>
          <UpdateIcon /> Last Update: <Time explicit>{updatedAt}</Time>
        </div>
        <RaisedButton
          label="Save"
          icon={<SaveIcon />}
          onClick={handleSaveChanges}
          disabled={saving || disabled}
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
