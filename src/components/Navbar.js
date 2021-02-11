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

function Navbar() {
  const classes = useStyles();

  return (
    <div>
      <AppBar
        position="static"
        style={{
          background: 'linear-gradient(45deg, #e96443 30%, #904e95 90%)',
        }}
      >
        <Toolbar color="primary">
          <Container maxWidth="md" className={classes.navbarDisplay}>
            <Logo color={'#FCE4EC'} />
            <Typography color="inherit">Mnemonic</Typography>
          </Container>
          <Container maxWidth="xs" className={classes.navbarDisplay2}>
            <Button color="inherit">User Playlist Analysis</Button>
          </Container>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Navbar;
