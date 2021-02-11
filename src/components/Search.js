import React from 'react';
import { Input, InputAdornment } from '@material-ui/core';
import QueueMusicIcon from '@material-ui/icons/QueueMusic';

function Search({ label, handleChange }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Input
        startAdornment={
          <InputAdornment position="start">
            <QueueMusicIcon />
          </InputAdornment>
        }
        placeholder={label}
        onChange={handleChange}
      ></Input>
    </div>
  );
}

export default Search;
