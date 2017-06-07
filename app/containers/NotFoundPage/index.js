/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import { Link } from 'react-router';
import AlertIcon from 'material-ui/svg-icons/alert/error';
import CardLayout from 'components/CardLayout';
import Heading from './Heading';

export default class NotFound extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <CardLayout>
        <Heading>
          <AlertIcon />
          <div>The page you requested was not found.</div>
        </Heading>
        <ul>
          <li><Link to="/">Back to home</Link></li>
        </ul>
      </CardLayout>
    );
  }
}
