import styled from 'styled-components';
import { Link } from 'react-router';

const Button = styled(Link)`
  display: inline-block;
  background: #ff7a00;
  color: #FFF;
  border-radius: 5px;
  padding: 10px 60px;
  font-size: 20px;
  text-align: center;
  font-weight: 500;
`;

export default Button;
