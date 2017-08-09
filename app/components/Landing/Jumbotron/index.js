import React from 'react';
import styled from 'styled-components';
import Wrapper from './Wrapper';
import TopImage from './TopImage.svg';
import Button from '../Button';

const Title = styled.h1`
  letter-spacing: 1px;
  font-weight: 400;
  margin: 0;
`;

const SubTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 100;

  & > a {
    color: #FFF;
    font-weight: 200;
  }
`;

const TopImageContainer = styled.div`
  margin: 1.5rem 0;
`;

type JumbotronProps = {
  trackTryBtnClick: Function
}

const Jumbotron = ({ trackTryBtnClick }: JumbotronProps) => (
  <Wrapper>
    <Title>The Next Generation API.</Title>
    <SubTitle>Create, edit and organize all data in tables.</SubTitle>
    <SubTitle>powered by <a href="https://skygear.io/" target="_blank">Skygear</a></SubTitle>
    <TopImageContainer>
      <img src={TopImage} alt="APITable" />
    </TopImageContainer>
    <SubTitle>From Table → JSON</SubTitle>
    <br />
    <Button to="/account/register" onClick={trackTryBtnClick}>TRY IT FOR FREE!</Button>
  </Wrapper>
);

export default Jumbotron;
