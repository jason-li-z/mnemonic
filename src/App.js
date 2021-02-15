import Home from '../src/pages/Home';
import Analysis from '../src/pages/Analysis';

import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import {
  BrowserRouter as Router,
  Link,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

const theme = createMuiTheme({
  typography: {
    fontFamily: ['Poppins'].join(','),
  },

  palette: {
    type: 'light',
  },
});
function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route path="/" exact component={Home}></Route>
          <Route path="/analysis" component={Analysis}></Route>
          <Route render={() => <Redirect to={{ pathname: '/' }} />} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
