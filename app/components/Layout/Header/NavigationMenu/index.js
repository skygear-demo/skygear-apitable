import React from 'react';
import Drawer from 'material-ui/Drawer';
import Subheader from 'material-ui/Subheader';
import MenuItem from 'material-ui/MenuItem';
import { Link } from 'react-router';

const openTable = (id) => () => window.open(`/tables/${id}`);

type NavigationMenuProps = {
  open: boolean,
  handleToggle: Function,
  recentTables: mixed
}

const NavigationMenu = ({ open, handleToggle, recentTables }: NavigationMenuProps) => (
  <Drawer
    open={open}
    onRequestChange={handleToggle}
    docked={false}
  >
    <Subheader>APITable</Subheader>
    <MenuItem
      primaryText="All Tables"
      containerElement={<Link to="/tables" />}
      onClick={handleToggle}
    />
    <MenuItem
      primaryText="Documentation"
      containerElement={<Link to="/docs" />}
      onClick={handleToggle}
    />
    <MenuItem
      primaryText="Feedback"
      href="https://docs.google.com/forms/d/e/1FAIpQLSeHUPZRPhNPUgvrssIzJBjplHvjZa70K0_WzUzqw2cXu7anMg/viewform"
      target="_blank"
      onClick={handleToggle}
    />
    {recentTables && JSON.parse(recentTables).tables.length &&
      <div>
        <Subheader>Recent</Subheader>
        {JSON.parse(recentTables).tables.map((table) => (
          <MenuItem
            key={table.id}
            primaryText={table.name}
            onClick={openTable(table.id)}
          />)
        )}
      </div>
    }
  </Drawer>
);

export default NavigationMenu;
