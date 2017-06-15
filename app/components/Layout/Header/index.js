/* @flow */

import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router';
import AppBar from 'material-ui/AppBar';
import Wrapper from './Wrapper';
import Outer from './Outer';
import Container from '../Container';
import Title from './Title';
import NavigationMenu from './NavigationMenu';
import UserMenu from './UserMenu';

const SanitizedLink = styled(Link)`
  color: white;
`;

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
      <Wrapper>
        <NavigationMenu
          open={this.state.open}
          handleToggle={this.handleToggle}
        />
        <AppBar
          title={<SanitizedLink to="/">APITable</SanitizedLink>}
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
      </Wrapper>
    );
  }
}

export default Header;
