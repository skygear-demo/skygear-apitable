/* @flow */

import React from 'react';
import skygear from 'skygear';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import PersonIcon from 'material-ui/svg-icons/social/person';
import { Link } from 'react-router';

const { currentUser } = skygear;

const UserMenu = () => (
  <div>
    <IconMenu
      iconButtonElement={<IconButton><PersonIcon color="white" /></IconButton>}
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      targetOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
      {currentUser ? (
        <Link to="/account/logout">
          <MenuItem primaryText="Logout" />
        </Link>
      ) : ([
        <Link to="/account/login">
          <MenuItem primaryText="Login" />
        </Link>,
        <Link to="/account/register">
          <MenuItem primaryText="Register" />
        </Link>,
      ])}
    </IconMenu>
  </div>
);

export default UserMenu;
