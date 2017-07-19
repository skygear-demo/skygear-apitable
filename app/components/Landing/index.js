import React from 'react';
import ReactGA from 'react-ga';
import styled from 'styled-components';
import { Row, Col } from 'react-flexbox-grid';
import Paper from 'material-ui/Paper';
import ArrowIcon from 'material-ui/svg-icons/hardware/keyboard-backspace';
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
import Preview1 from './Preview1.png';
import Preview2 from './Preview2.png';

const trackTryBtnClick = () => {
  ReactGA.event({
    category: 'User',
    action: 'Click Try Button',
  });
};

const Heading = styled.h1`
  font-weight: 400;
  margin: 0;
`;

const Description = styled.div`
  max-width: 280px;
  margin: 1rem auto;
`;

const Arrow = styled(ArrowIcon)`
  transform: rotate(180deg);
  @media (max-width: 1023px) {
    transform: rotate(-90deg);
  }
`;

const Window = styled.div`
  border-radius: 6px 6px 0 0;
  padding-top: 26px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 8px 32px rgba(0, 0, 0, 0.12);

  &::before {
    background: linear-gradient(#f0f0f0, #dedede);
    border-radius: 6px 6px 0 0;
    content: ' ';
    height: 25px;
    position: absolute;
    top: 0;
    width: 100%;
  }
`;

const Landing = () => (
  <Layout hideHeader>
    <Header>
      <Jumbotron trackTryBtnClick={trackTryBtnClick} />
    </Header>

    <Row center="xs" middle="xs" style={{ background: '#FFF', padding: '3rem 0' }}>
      <Col xs={12} md={5}>
        <Paper zDepth={3} style={{ maxWidth: 500, margin: '1rem auto' }}>
          <img src={Preview1} alt="" style={{ width: '100%', maxWidth: 500 }} />
        </Paper>
      </Col>
      <Col xs={0} md={1}>
        <Arrow />
      </Col>
      <Col xs={12} md={5}>
        <div style={{ maxWidth: 500, margin: '1rem auto', textAlign: 'left', position: 'relative' }}>
          <Window>
            <img src={Preview2} alt="" style={{ maxWidth: '100%' }} />
          </Window>
        </div>
      </Col>
    </Row>

    <Row center="xs" style={{ padding: '3rem 0' }}>
      <Col xs={12} style={{ marginBottom: '2rem' }}>
        <Heading>How does it help?</Heading>
      </Col>
      <Col md={4} mdOffset={2} xs={12}>
        <img src={NoLearnDatabase} alt="No need to learn about anything about database" />
        <Description>No need to learn about databases</Description>
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

    <Row center="xs" style={{ background: '#FFF', padding: '3rem 0' }}>
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

    <Row center="xs" style={{ padding: '3rem 0' }}>
      <Col xs={12} style={{ marginBottom: '2rem' }}>
        <Heading>Use cases</Heading>
      </Col>
      <Col md={3} mdOffset={1}>
        <img src={NewsFeed} alt="News Feed" />
        <Description>News feeds</Description>
      </Col>
      <Col md={4}>
        <img src={AnyPrototype} alt="Any Prototype" />
        <Description>Prototypes</Description>
      </Col>
      <Col md={3}>
        <img src={ReadingList} alt="Reading List" />
        <Description>Reading lists</Description>
      </Col>
      <Col md={1} xs={0}></Col>
      <Col xs={12} style={{ marginTop: '2rem' }}>
        <Button to="/tables" onClick={trackTryBtnClick}>TRY IT NOW</Button>
      </Col>
    </Row>
  </Layout>
);

export default Landing;
