import React from 'react';
import './Analysis.css';

import Navbar from '../components/Navbar';
import Search from '../components/Search';
import AnalysisTable from '../components/AnalysisTable';
import Data from '../components/Data';
import Loader from '../components/Loader';

import {
  Container,
  Typography,
  makeStyles,
  Button,
  Fade,
} from '@material-ui/core';
import { useState, useEffect } from 'react';

const clientId = process.env.REACT_APP_ID;
const clientSecret = process.env.REACT_APP_SECRET;

const useStyles = makeStyles({
  tagline: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '50px',
    paddingBottom: '25px',
  },
  bodyline: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: '25px',
  },
  mainButton: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 20,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
  },

  playlistInfo: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '50px',
  },
  logo: {
    marginTop: '50px',
  },
});

function Analysis() {
  const classes = useStyles();

  const [playlistUri, setPlaylistUri] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [analysis, setAnalysis] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [fade, setFade] = useState(false);
  const [playlist, setPlaylist] = useState({
    playlistName: '',
    img: '',
    username: '',
    tracks: '',
  });

  const handleChange = (event) => {
    setPlaylistUri(event.target.value);
    if (fade) {
      setFade(false);
    }
  };

  const getToken = async () => {
    const result = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa(`${clientId}:${clientSecret}`),
      },
      body: 'grant_type=client_credentials',
    });
    const data = await result.json();
    return data.access_token;
  };

  const handleClick = async (event) => {
    let playlistId = '';
    if (playlistUri.startsWith('https://open.spotify.com/')) {
      playlistId = playlistUri.substring(34, 56);
    } else if (playlistUri.startsWith('spotify:playlist:')) {
      playlistId = playlistUri.split(':')[2];
    } else {
      return;
    }

    setLoading(true);
    setFade(false);
    setAnalysis([]);

    const token = await getToken();

    const result = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        method: 'GET',
        headers: { Authorization: 'Bearer ' + token },
      }
    );

    if (result.status === 200) {
      const data = await result.json();
      const playlistInfo = {
        playlistName: data.name,
        img: data.images[0].url,
        username: data.owner.display_name,
        tracks: data.tracks.items,
      };
      setPlaylist(playlistInfo);
    }

    let tracks = [];
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100&offset=0`;
    await getTracks(token, url, tracks);

    let analysisResults = [];

    let counter = 0;

    while (counter < tracks.length) {
      const trackIds = concatTrackIds(counter, tracks);
      const analysisUrl = `https://api.spotify.com/v1/audio-features?ids=${trackIds}`;

      const analysisResponse = await fetch(analysisUrl, {
        method: 'GET',
        headers: { Authorization: 'Bearer ' + token },
      });

      if (analysisResponse.status === 200) {
        let data = await analysisResponse.json();

        for (let i = counter; i < counter + 100; i++) {
          if (i >= tracks.length) {
            break;
          }

          let currentResult = {
            ...data.audio_features[i - counter], // result index starts from 0, max size 100
            id: tracks[i].track.id,
            name: tracks[i].track.name,
            album: tracks[i].track.album,
          };
          analysisResults.push(currentResult);
        }
      }
      counter += 100;
    }

    setShowResult(true);
    setAnalysis(analysisResults);
    setFade(true);
    setLoading(false);
  };

  const concatTrackIds = (counter, tracks) => {
    let trackIds = '';

    for (let i = counter; i < counter + 100; i++) {
      if (i >= tracks.length) {
        break;
      }
      if (i === tracks.length - 1 || i === counter + 100 - 1) {
        trackIds += tracks[i].track.id;
      } else {
        trackIds += tracks[i].track.id + ',';
      }
    }
    return trackIds;
  };

  const getTracks = async (token, url, tracks) => {
    if (url === null) {
      return;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + token },
    });

    if (response.status === 200) {
      const data = await response.json();
      for (let i = 0; i < data.items.length; ++i) {
        if (data.items[i].track === null) {
          continue;
        }

        if (!data.items[i].track.uri.startsWith('spotify:local')) {
          tracks.push(data.items[i]);
        }
      }
      await getTracks(token, data.next, tracks);
    }
  };

  return (
    <Fade in={true} timeout={500}>
      <div className="Analysis">
        <Navbar></Navbar>
        <Container maxWidth="md">
          <Typography variant="h2" className={classes.tagline}>
            mnemonic.
          </Typography>
          <Typography variant="h5" className={classes.bodyline}>
            individual playlist analysis
          </Typography>
        </Container>
        <Container style={{ paddingTop: '40px', paddingBottom: '20px' }}>
          <Search handleChange={handleChange} label="Playlist Link"></Search>
        </Container>
        <Container style={{ paddingTop: '30px' }}>
          <Button className={classes.mainButton} onClick={handleClick}>
            analyze
          </Button>
        </Container>
        <Loader loading={isLoading}></Loader>

        <Container style={{ marginTop: '40px' }}>
          <Data
            playlistName={playlist.playlistName}
            img={playlist.img}
            username={playlist.username}
            tracks={analysis}
            showResult={showResult}
            fade={fade}
            timeout={400}
          ></Data>
        </Container>
        <Container
          style={{
            padding: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            //minWidth: '1000px',
          }}
        >
          <AnalysisTable
            style={{
              border: 0,
              borderRadius: 20,
              boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
            }}
            showResult={showResult}
            analysis={analysis}
            fade={fade}
          ></AnalysisTable>
        </Container>
      </div>
    </Fade>
  );
}

export default Analysis;
