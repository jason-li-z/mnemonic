import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Fade } from '@material-ui/core/';

const useStyles = makeStyles({
  playlistPicture: {
    padding: '20px',
    maxWidth: '400px',
    maxHeight: '480px',
  },
});

function Data({
  playlistName,
  img,
  username,
  tracks,
  fade,
  timeout,
  showResult,
}) {
  const classes = useStyles();

  if (!showResult) {
    return <div></div>;
  } else {
    return (
      <Fade in={fade} timeout={timeout}>
        <div>
          <Typography variant="h6" style={{ padding: '0 50px 0 50px' }}>
            Owner: {username} — Playlist Name: {playlistName}
          </Typography>
          <br></br>
          <img className={classes.playlistPicture} src={img} alt="" />
          <br></br>
          <Typography>Total Tracks: {tracks.length}</Typography>
        </div>
      </Fade>
    );
  }
}

export default Data;
