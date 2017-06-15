/* @flow */

import React from 'react';

import Notification from 'containers/Notification';
import Wrapper from './Wrapper';
import Header from './Header';
import Footer from './Footer';

type LayoutProps = {
  title: string,
  children: mixed
}

const Layout = ({ title, children }: LayoutProps) => (
  <Wrapper>
    <Header title={title} />
    {children}
    <Footer />
    <Notification />
  </Wrapper>
);

export default Layout;
