import React from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-flexbox-grid';
import Layout from '../Layout';
import Header from './Header';
import Jumbotron from './Jumbotron';
import Button from './Button';
import NoLearnDatabase from './NoLearnDatabase.svg';
import InstantAPI from './InstantAPI.svg';
import NoSDK from './NoSDK.svg';
import EditData from './EditData.svg';
import Developers from './Developers.svg';
import StartUpMVP from './StartUpMVP.svg';
import QATesters from './QATesters.svg';
import NewsFeed from './NewsFeed.png';
import AnyPrototype from './AnyPrototype.png';
import ReadingList from './ReadingList.png';

const Heading = styled.h1`
  font-weight: 400;
  margin: 0;
`;

const Description = styled.div`
  max-width: 280px;
  margin: 1rem auto;
`;

const Landing = () => (
  <Layout hideHeader>
    <Header>
      <Jumbotron />
    </Header>

    <Row center="xs" style={{ background: '#FFF', padding: '3rem 0' }}>
      <Col xs={12} style={{ marginBottom: '2rem' }}>
        <Heading>Why is it good?</Heading>
      </Col>
      <Col md={4} mdOffset={2} xs={12}>
        <img src={NoLearnDatabase} alt="No need to learn about anything about database" />
        <Description>No need to learn about anything about database</Description>
      </Col>
      <Col md={4} xs={12}>
        <img src={InstantAPI} alt="Instant API for use" />
        <Description>Instant API for use</Description>
      </Col>
      <Col md={2} xs={0}></Col>
      <Col md={4} mdOffset={2} xs={12}>
        <img src={NoSDK} alt="No SDK required" />
        <Description>No SDK required</Description>
      </Col>
      <Col md={4} xs={12}>
        <img src={EditData} alt="Edit data directly in tables" />
        <Description>Edit data directly in tables</Description>
      </Col>
      <Col md={2} xs={0}></Col>
    </Row>

    <Row center="xs" style={{ padding: '3rem 0' }}>
      <Col xs={12} style={{ marginBottom: '2rem' }}>
        <Heading>Who&#39;s APITable for?</Heading>
      </Col>
      <Col md={3} mdOffset={1}>
        <img src={Developers} alt="Indie developers" />
        <Description>Indie developers</Description>
      </Col>
      <Col md={4}>
        <img src={StartUpMVP} alt="Startup MVPs" />
        <Description>Startup MVPs</Description>
      </Col>
      <Col md={3}>
        <img src={QATesters} alt="QA Testers" />
        <Description>QA Testers</Description>
      </Col>
      <Col md={1} xs={0}></Col>
    </Row>

    <Row center="xs" style={{ background: '#FFF', padding: '3rem 0', marginBottom: '-2rem' }}>
      <Col xs={12} style={{ marginBottom: '2rem' }}>
        <Heading>Use Cases</Heading>
      </Col>
      <Col md={3} mdOffset={1}>
        <img src={NewsFeed} alt="News Feed" />
        <Description>News Feed</Description>
      </Col>
      <Col md={4}>
        <img src={AnyPrototype} alt="Any Prototype" />
        <Description>Any Prototype</Description>
      </Col>
      <Col md={3}>
        <img src={ReadingList} alt="Reading List" />
        <Description>Reading List</Description>
      </Col>
      <Col md={1} xs={0}></Col>
      <Col xs={12} style={{ marginTop: '2rem' }}>
        <Button to="/tables">TRY IT NOW</Button>
      </Col>
    </Row>
  </Layout>
);

export default Landing;
