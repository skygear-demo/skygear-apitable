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

  .docs-pre,
  .docs-code {
    font-family: Menlo,Monaco,"Courier New",Courier,monospace;
    background: #EFEFEF;
    padding: 0.1rem 0.3rem;
    max-width: 800px;
  }

  .docs-table,
  .docs-th,
  .docs-td {
    border: 1px solid #CCC;
  }

  .docs-th,
  .docs-td {
    padding: 0.2rem 0.5rem;
    max-width: 400px;
  }
`;
