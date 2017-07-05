import React from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-flexbox-grid';
import APILogo from './APILogo.svg';

const Outer = styled.div`
  background: #00b14d;
  color: #FFF;
  padding: 2rem 0 3rem 0;
`;

const LogoContainer = styled.div`
  width: 200px;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: row;
`;

const Brand = styled.h1`
  margin: 0 0 0 1rem;
  font-weight: 400;
`;

type HeaderProps = {
  children: mixed
}

const Header = ({ children }: HeaderProps) => (
  <Outer>
    <Row between="xs">
      <Col xs={11} xsOffset={1}>
        <LogoContainer>
          <img src={APILogo} alt="APITable" />
          <Brand>APITable</Brand>
        </LogoContainer>
      </Col>
    </Row>
    <Row center="xs">
      {children}
    </Row>
  </Outer>
);

export default Header;
