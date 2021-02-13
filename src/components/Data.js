import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core/';

const useStyles = makeStyles({
  playlistPicture: {
    padding: '20px',
    maxWidth: '400px',
    maxHeight: '480px',
  },
});

function Data({ playlistName, img, username, tracks }) {
  const classes = useStyles();

  if (img === '' || img === undefined) {
    return <div></div>;
  } else {
    return (
      <div>
        <Typography variant="h6" style={{ padding: '0 50px 0 50px' }}>
          Owner: {username} — Playlist Name: {playlistName}
        </Typography>
        <br></br>
        <img className={classes.playlistPicture} src={img} alt="blank" />
        <br></br>
        <Typography>Total Tracks: {tracks.length}</Typography>
      </div>
    );
  }
}

export default Data;
