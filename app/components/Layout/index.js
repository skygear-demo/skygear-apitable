/* @flow */

import React from 'react';

import Notification from 'containers/Notification';
import Header from './Header';
import Footer from './Footer';

type LayoutProps = {
  title: string,
  children: mixed
}

const Layout = ({ title, children }: LayoutProps) => (
  <div>
    <Header title={title} />
    {children}
    <Footer />
    <Notification />
  </div>
);

export default Layout;
