import styled from 'styled-components';

const Container = styled.div`
  width: ${(props) => props.fluid ? '90%' : '1152px'};
  margin: 0 auto;
`;

export default Container;
