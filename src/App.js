import './App.css';
import Navbar from '../src/components/Navbar';
import Search from '../src/components/Search';
import Data from '../src/components/Data';

import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Container, Typography, makeStyles, Button } from '@material-ui/core';
import { useState } from 'react';

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
    borderRadius: 3,
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
});

function App() {
  const theme = createMuiTheme({
    typography: {
      fontFamily: ['Poppins'].join(','),
    },

    palette: {
      type: 'light',
    },
  });

  const classes = useStyles();

  const [playlists, setPlaylists] = useState({
    playlistOne: {
      link: '',
      username: '',
      name: '',
      avatar: '',
      tracks: [],
    },
    playlistTwo: {
      link: '',
      username: '',
      name: '',
      avatar: '',
      tracks: [],
    },
  });

  const handleChangeOne = (event) => {
    setPlaylists((curr) => ({
      ...curr,
      playlistOne: { link: event.target.value },
    }));
  };

  const handleChangeTwo = (event) => {
    setPlaylists((curr) => ({
      ...curr,
      playlistTwo: { link: event.target.value },
    }));
  };

  const handleButtonClick = async (event) => {
    const token = await getToken();
    for (let playlist in playlists) {
      const { link } = playlists[playlist];
      const { name, avatar, username, tracks } = await getPlaylist(token, link);
      setPlaylists((curr) => ({
        ...curr, // When updating current obj, don't forget to bring in the others
        [playlist]: {
          name: name,
          avatar: avatar,
          username: username,
          tracks: tracks,
        },
      }));
      console.log(tracks);
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
        tracks.push(data.items[i]);
      }
      await getTracks(token, data.next, tracks);
    }
  };

  const getPlaylist = async (token, playlistUri) => {
    const parsedUrl = playlistUri.split(':');
    const playlistId = parsedUrl[2];
    const result = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        method: 'GET',
        headers: { Authorization: 'Bearer ' + token },
      }
    );

    let tracks = [];
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?market=NA&limit=100&offset=0`;

    await getTracks(token, url, tracks);

    if (result.status === 200) {
      const data = await result.json();
      if (data.images.length > 1) {
        return {
          name: data.name,
          avatar: data.images[1].url,
          username: data.owner.display_name,
          tracks: tracks,
        };
      }
      return {
        name: data.name,
        avatar: data.images[0].url,
        username: data.owner.display_name,
        tracks: tracks,
      };
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Navbar />
        <Container maxWidth="md">
          <Typography variant="h3" className={classes.tagline}>
            mnemonic.
          </Typography>
          <Typography variant="h6" className={classes.bodyline}>
            find differences between two playlists
          </Typography>
        </Container>
        <Container style={{ paddingTop: '40px', paddingBottom: '20px' }}>
          <Search label={'Playlist one'} handleChange={handleChangeOne} />
        </Container>
        <Container style={{ padding: '10px' }}>
          <Search label={'Playlist Two'} handleChange={handleChangeTwo} />
        </Container>
        <Container style={{ paddingTop: '40px' }}>
          <Button className={classes.mainButton} onClick={handleButtonClick}>
            compare
          </Button>
        </Container>
        <Container className={classes.playlistInfo}>
          <Data
            username={playlists.playlistOne.username}
            playlistName={playlists.playlistOne.name}
            img={playlists.playlistOne.avatar}
            tracks={playlists.playlistOne.tracks}
          ></Data>
          <Data
            username={playlists.playlistTwo.username}
            playlistName={playlists.playlistTwo.name}
            img={playlists.playlistTwo.avatar}
            tracks={playlists.playlistTwo.tracks}
          ></Data>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
