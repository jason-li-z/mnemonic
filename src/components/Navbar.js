import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  makeStyles,
  Button,
} from '@material-ui/core';
import Logo from '../components/Logo';

import { Link, Route } from 'react-router-dom';

const useStyles = makeStyles({
  navbarDisplay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  navbarDisplay2: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

function Analysis() {
  return <div></div>;
}

function Navbar() {
  const classes = useStyles();

  return (
    <div>
      <Route path="/analysis" exact component={Analysis}></Route>
      <AppBar
        position="static"
        style={{
          background: 'linear-gradient(45deg, #e96443 30%, #904e95 90%)',
        }}
      >
        <Toolbar color="primary">
          <Container maxWidth="md" className={classes.navbarDisplay}>
            <Link
              to="/"
              style={{ color: 'inherit', textDecoration: 'inherit' }}
            >
              {' '}
              <Logo color={'#FCE4EC'} />
            </Link>
            <Typography color="inherit">Mnemonic</Typography>
          </Container>
          <Container maxWidth="xs" className={classes.navbarDisplay2}>
            <Link
              to="/analysis"
              style={{ color: 'inherit', textDecoration: 'inherit' }}
            >
              <Button color="inherit">Individual Playlist Analysis</Button>
            </Link>
          </Container>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Navbar;
