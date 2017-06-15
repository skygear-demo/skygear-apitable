import { injectGlobal } from 'styled-components';
import { grey200 } from 'material-ui/styles/colors';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  body {
    font-family: Open Sans,sans-serif;
    background: ${grey200};
  }

  html,
  body,
  #app {
    min-height: 100vh;
  }

  a {
    text-decoration: none;
  }
`;
