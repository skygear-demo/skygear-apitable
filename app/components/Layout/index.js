/* @flow */

import React from 'react';

import Notification from 'containers/Notification';
import Wrapper from './Wrapper';
import Header from './Header';
import Footer from './Footer';

type LayoutProps = {
  title: string,
  hideHeader?: boolean,
  hideFooter?: boolean,
  children: mixed
}

const Layout = ({ title, hideHeader = false, hideFooter = false, children }: LayoutProps) => (
  <Wrapper>
    {!hideHeader && <Header title={title} />}
    {children}
    {!hideFooter && <Footer />}
    <Notification />
  </Wrapper>
);

export default Layout;
