import styled from 'styled-components';
import { grey500 } from 'material-ui/styles/colors';

const InputGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 15px;

  & > svg {
    fill: ${grey500} !important;
    flex-shrink: 0;
    margin: 35px 8px 0 0;
  }
`;

export default InputGroup;
