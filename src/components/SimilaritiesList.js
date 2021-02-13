import React from 'react';

import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
} from '@material-ui/core';

import Artists from './Artists';

function renderItem(item) {
  return item.map((dups) => (
    <ListItem key={dups.track.id}>
      <ListItemAvatar>
        <Avatar
          style={{ width: '100px', height: '100px', padding: '30px' }}
          src={dups.track.album.images[1].url}
          alt=""
        ></Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={dups.track.name}
        secondary={<Artists artists={dups.track.artists}></Artists>}
      ></ListItemText>
    </ListItem>
  ));
}

function SimilaritiesList({ tracks, duplicate, showResult }) {
  if (!showResult) {
    return <div></div>;
  }

  if (tracks.length === 0) {
    return <div>No duplicates were found</div>;
  }

  return (
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
  );
}

export default SimilaritiesList;
