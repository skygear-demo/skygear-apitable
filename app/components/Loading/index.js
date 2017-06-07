import React from 'react';
import styled from 'styled-components';
import CircularProgress from 'material-ui/CircularProgress';

const Wrapper = styled.div`
  text-align: center;
  padding: 20px 0;
`;

const Loading = () => (
  <Wrapper>
    <CircularProgress />
  </Wrapper>
);

export default Loading;
