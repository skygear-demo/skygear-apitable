/* @flow */

import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Outer from './Outer';
import Container from '../Container';
import Title from './Title';
import NavigationMenu from './NavigationMenu';
import UserMenu from './UserMenu';

type HeaderState = {
  open: boolean
}

type HeaderProps = {
  title: string
}

class Header extends Component {
  constructor(props: HeaderProps) {
    super(props);
    this.state = { open: false };
    this.handleToggle = this.handleToggle.bind(this);
  }

  state: HeaderState
  props: HeaderProps
  handleToggle: () => void

  handleToggle() {
    this.setState({ open: !this.state.open });
  }

  render() {
    const { title } = this.props;

    return (
      <div>
        <NavigationMenu
          open={this.state.open}
          handleToggle={this.handleToggle}
        />
        <AppBar
          title="APITable"
          style={{ boxShadow: 'none' }}
          iconElementRight={<UserMenu />}
          onLeftIconButtonTouchTap={this.handleToggle}
        />
        {title && (
          <Outer>
            <Container>
              <Title>{title}</Title>
            </Container>
          </Outer>
        )}
      </div>
    );
  }
}

export default Header;
