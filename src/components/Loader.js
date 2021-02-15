import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

function Loader({ loading }) {
  if (loading) {
    return (
      <CircularProgress style={{ padding: '30px' }}>
        Fetching data...
      </CircularProgress>
    );
  }
  return <div></div>;
}

export default Loader;
