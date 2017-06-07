import React from 'react';
import { Card } from 'material-ui/Card';
import Notification from 'containers/Notification';
import Wrapper from './Wrapper';

const Layout = ({ children }) => (
  <Wrapper>
    <Card style={{ minWidth: 350 }}>
      {children}
    </Card>
    <Notification />
  </Wrapper>
);

Layout.propTypes = {
  children: React.PropTypes.any.isRequired,
};

export default Layout;
