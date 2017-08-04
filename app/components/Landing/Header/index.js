import React from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import { Row, Col } from 'react-flexbox-grid';
import FlatButton from 'material-ui/FlatButton';
import LoginIcon from 'material-ui/svg-icons/social/person';
import APILogo from './APILogo.svg';

const Outer = styled.div`
  background: #00b14d;
  color: #FFF;
  padding: 2rem 0 3rem 0;
`;

const LogoContainer = styled.div`
  width: 200px;
  margin-left: 8%;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: row;
`;

const Brand = styled.h1`
  margin: 0 0 0 1rem;
  font-weight: 400;
`;

const LoginBtnContainer = styled.div`
  margin-right: 8%;
  text-align: right;
`;

type HeaderProps = {
  children: mixed
}

const Header = ({ children }: HeaderProps) => (
  <Outer>
    <Row between="xs">
      <Col xs={8}>
        <LogoContainer>
          <img src={APILogo} alt="APITable" />
          <Brand>APITable</Brand>
        </LogoContainer>
      </Col>
      <Col xs={4}>
        <LoginBtnContainer>
          <Link to="/account/login">
            <FlatButton
              label="Login"
              labelStyle={{ color: '#FFF' }}
              icon={<LoginIcon color="#FFF" />}
            />
          </Link>
        </LoginBtnContainer>
      </Col>
    </Row>
    <Row center="xs">
      {children}
    </Row>
  </Outer>
);

export default Header;
