import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { blue300, grey400 } from 'material-ui/styles/colors';

const muiTheme = getMuiTheme({
  fontFamily: 'Open Sans, sans-serif',
  appBar: {
    height: 56,
  },
  palette: {
    primary1Color: '#00B756',
    primary2Color: blue300,
    primary3Color: grey400,
  },
});

export default muiTheme;
