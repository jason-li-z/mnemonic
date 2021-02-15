import React from 'react';
import { Typography } from '@material-ui/core';
import Artists from './Artists';

function AnalysisTable({ showResult, analysis }) {
  const keys = {
    0: 'C',
    1: 'D♭',
    2: 'D',
    3: 'E♭',
    4: 'E',
    5: 'F',
    6: 'F♯',
    7: 'G',
    8: 'A♭',
    9: 'A',
    10: 'B♭',
    11: 'B',
  };

  const mode = {
    0: 'Minor',
    1: 'Major',
  };

  if (!showResult) {
    return <div></div>;
  }
  if (analysis.length > 0) {
    console.log(analysis);
    return (
      <div>
        {analysis.map((item) => {
          return (
            <Typography style={{ padding: '8px' }}>
              {<Artists artists={item.album.artists}></Artists>} — Track:{' '}
              {item.name} — Key: {keys[item.key]} {mode[item.mode]}
            </Typography>
          );
        })}
      </div>
    );
  }
  return <div>Error</div>;
}

export default AnalysisTable;
