import React from 'react';
import Drawer from 'material-ui/Drawer';
import Subheader from 'material-ui/Subheader';
import MenuItem from 'material-ui/MenuItem';
import { Link } from 'react-router';

type NavigationMenuProps = {
  open: boolean,
  handleToggle: Function
}

const NavigationMenu = ({ open, handleToggle }: NavigationMenuProps) => (
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
  </Drawer>
);

export default NavigationMenu;
