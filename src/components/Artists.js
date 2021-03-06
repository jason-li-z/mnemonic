import React from 'react';

function Artists({ artists, label }) {
  // Artists == array

  let artistName = '';
  for (let i = 0; i < artists.length; i++) {
    if (i === artists.length - 1) {
      artistName += artists[i].name;
    } else {
      artistName += artists[i].name + ', ';
    }
  }

  return (
    <span>
      {label}
      {artistName}
    </span>
  );
}

export default Artists;
