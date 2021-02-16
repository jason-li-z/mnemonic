import React from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableHead,
  TableContainer,
  TableCell,
  Paper,
  TableRow,
  Avatar,
  Zoom,
  withStyles,
} from '@material-ui/core';
import Artists from './Artists';
import Length from './Length';

const StyledTableCell = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

function AnalysisTable({ showResult, analysis, fade }) {
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

  console.log(analysis);

  if (analysis.length > 0) {
    return (
      <Zoom in={fade}>
        <TableContainer
          component={Paper}
          style={{
            marginTop: '40px',
            justifyContent: 'center',
            maxWidth: 'auto',
          }}
        >
          <TableHead>
            <StyledTableCell align="center">Track</StyledTableCell>
            <StyledTableCell align="center">Artist</StyledTableCell>
            <StyledTableCell align="center">Key</StyledTableCell>
            <StyledTableCell align="center">BPM/Tempo</StyledTableCell>
            <StyledTableCell align="center">Length</StyledTableCell>
          </TableHead>
          <TableBody>
            {analysis.map((item) => (
              <TableRow key={item.name}>
                <TableCell
                  align="left"
                  component="th"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Avatar
                    style={{ width: '100px', height: '100px', padding: '30px' }}
                    src={item.album.images[0].url}
                    alt=""
                  ></Avatar>
                  <Typography>{item.name}</Typography>
                </TableCell>
                <TableCell align="center" component="th">
                  <Artists artists={item.album.artists}></Artists>
                </TableCell>
                <TableCell align="center" component="th">
                  {keys[item.key]} {mode[item.mode]}
                </TableCell>
                <TableCell align="center" component="th">
                  {Math.round(item.tempo)}
                </TableCell>
                <TableCell align="center" component="th">
                  <Length length={item.duration_ms}></Length>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableContainer>
      </Zoom>
    );
  }
  return <div>Error</div>;
}

export default AnalysisTable;