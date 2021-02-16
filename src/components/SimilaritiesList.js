import React from 'react';

import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Zoom,
} from '@material-ui/core';

import Artists from './Artists';

//<Artists artists={dups.track.artists}></Artists>

function renderItem(item) {
  return item.map((dups) => (
    <Zoom in={true} timeout={1500}>
      <ListItem key={dups.track.id}>
        <ListItemAvatar>
          <Avatar
            style={{ width: '100px', height: '100px', padding: '30px' }}
            src={dups.track.album.images[1].url}
            alt=""
          ></Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={'Track Name: ' + dups.track.name}
          secondary={
            <Artists artists={dups.track.artists} label={'Artist: '}></Artists>
          }
        ></ListItemText>
      </ListItem>
    </Zoom>
  ));
}

function SimilaritiesList({ tracks, duplicate, showResult, fade }) {
  if (!showResult) {
    return <div></div>;
  }

  if (tracks.length === 0) {
    return (
      <Zoom in={fade} timeout={400}>
        <div style={{ padding: '40px' }}>No duplicates were found</div>
      </Zoom>
    );
  }

  return (
    <Zoom in={fade} timeout={400}>
      <div>
        <Typography variant="h5" style={{ paddingTop: '40px' }}>
          found {tracks.length} similar tracks
        </Typography>
        <List
          style={{
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {renderItem(tracks)}
        </List>
      </div>
    </Zoom>
  );
}

export default SimilaritiesList;
