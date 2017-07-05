import styled from 'styled-components';

const Left = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;

  & > a > img {
    width: 100px;
  }

  & > small {
    color: #EFEFEF;
    height: 34px;
    line-height: 34px;
  }
`;

export default Left;
