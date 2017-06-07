import styled from 'styled-components';

const Heading = styled.div`
  background: #00B756;
  text-align: center;
  padding: 20px 0;
  color: #FFF;

  & > div {
    position: relative;
  }

  & > div > a {
    position: absolute;
    left: 1rem;
  }

  & svg {
    fill: #FFF !important;
  }

  & > svg {
    width: 60px !important;
    height: 60px !important;
  }
`;

export default Heading;
