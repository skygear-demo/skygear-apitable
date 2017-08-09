import React from 'react';
import { Row, Col } from 'react-flexbox-grid';
import Outer from './Outer';
import Left from './Left';
import Heading from './Heading';
import Links from './Links';
import LinksItem from './LinksItem';
import OurskyLogo from './oursky.svg';

const Footer = () => (
  <Outer>
    <Row between="sm">
      <Col>
        <Left>
          <a href="https://oursky.com/" target="_blank"><img src={OurskyLogo} alt="Oursky" /></a>
          <small>DEVELOP WITH PASSION</small>
        </Left>
      </Col>
      <Col>
        <Row between="sm" style={{ padding: '0 8px' }}>
          <Col>
            <Heading>APITable</Heading>
            <Links style={{ minWidth: 150 }}>
              <LinksItem><a href="https://github.com/skygear-demo/skygear-apitable">Github Repo</a></LinksItem>
              <LinksItem><a href="mailto:support+apitable@oursky.com">Contact</a></LinksItem>
            </Links>
          </Col>
          <Col>
            <Heading>Other Tools and Products</Heading>
            <Links>
              <LinksItem><a href="https://skygear.io/" target="_blank">Skygear</a></LinksItem>
              <LinksItem><a href="https://makeappicon.com/" target="_blank">Makeappicon</a></LinksItem>
              <LinksItem><a href="https://appsite.skygear.io/" target="_blank">Appsite</a></LinksItem>
              <LinksItem><a href="https://mockuphone.com/" target="_blank">MockUPhone</a></LinksItem>
            </Links>
          </Col>
        </Row>
      </Col>
    </Row>
    <Row between="sm" style={{ margin: '1rem -8px' }}>
      <small>&copy; 2008-2017 All rights reserved <a href="https://oursky.com/" target="_blank">Oursky Ltd.</a></small>
    </Row>
  </Outer>
);

export default Footer;
