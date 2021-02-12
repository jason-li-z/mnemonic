import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  playlistPicture: {
    padding: '50px',
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
        Owner: {username} — Playlist Name: {playlistName}
        <br></br>
        <img className={classes.playlistPicture} src={img} alt="blank" />
        <br></br>
        Total Tracks: {tracks.length}
        <br></br>
      </div>
    );
  }
}

export default Data;
