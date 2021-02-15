import React from 'react';
import './Analysis.css';

import Navbar from '../components/Navbar';

import {
  Container,
  Typography,
  makeStyles,
  Button,
  Fade,
} from '@material-ui/core';
import { useState, useEffect } from 'react';

const useStyles = makeStyles({
  tagline: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '50px',
    paddingBottom: '25px',
  },
  bodyline: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: '25px',
  },
  mainButton: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
  },

  playlistInfo: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '50px',
  },
  logo: {
    marginTop: '50px',
  },
});

function Analysis() {
  const classes = useStyles();

  return (
    <Fade in={true} timeout={500}>
      <div className="Analysis">
        <Navbar></Navbar>
        <Container maxWidth="md">
          <Typography variant="h2" className={classes.tagline}>
            mnemonic.
          </Typography>
          <Typography variant="h5" className={classes.bodyline}>
            individual playlist analysis
          </Typography>
        </Container>
      </div>
    </Fade>
  );
}

export default Analysis;
