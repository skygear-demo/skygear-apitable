import styled from 'styled-components';

const FooterContainer = styled.div`
  padding: 2rem 24px;
  margin: 0 auto;
  background: #3b3f50;
  color: #FFF;
  display: flex;

  & a {
    color: #FFF;
  }

  & ul {
    margin: 0 0 0 1rem;
    padding-left: 1rem;
    list-style: none;
    border-left: 1px solid #FFF;
  }
`;

export default FooterContainer;
