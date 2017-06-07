import styled from 'styled-components';
import { red500 } from 'material-ui/styles/colors';

const Heading = styled.div`
  background: ${red500};
  text-align: center;
  padding: 20px;
  color: #FFF;
  display: flex;
  align-items: center;

  & > div {
    font-size: 22px;
  }

  & svg {
    fill: #FFF !important;
  }

  & > svg {
    width: 60px !important;
    height: 60px !important;
    margin-right: 10px;
  }
`;

export default Heading;
