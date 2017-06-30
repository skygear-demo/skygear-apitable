/* @flow */

import React from 'react';

import Notification from 'containers/Notification';
import Wrapper from './Wrapper';
import Header from './Header';
import Footer from './Footer';

type LayoutProps = {
  title: string,
  hideFooter?: boolean,
  children: mixed
}

const Layout = ({ title, hideFooter = false, children }: LayoutProps) => (
  <Wrapper>
    <Header title={title} />
    {children}
    {!hideFooter && <Footer />}
    <Notification />
  </Wrapper>
);

export default Layout;
