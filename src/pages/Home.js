import './Home.css';
import Navbar from '../components/Navbar';
import Search from '../components/Search';
import Data from '../components/Data';
import SimilaritiesList from '../components/SimilaritiesList';
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

function Home() {
  const classes = useStyles();

  const [playlistsUri, setPlaylistsUri] = useState({
    playlistOne: {
      link: '',
    },
    playlistTwo: {
      link: '',
    },
  });

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

  const [similarTracks, setSimilarTracks] = useState([]);
  const [updatedPlaylist, setUpdatedPlaylist] = useState(false);
  const [duplicateFound, setDuplicateFound] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [fade, setFade] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeOne = (event) => {
    setPlaylistsUri((currentLink) => ({
      ...currentLink,
      playlistOne: { link: event.target.value },
    }));
    if (fade) {
      setFade(false);
    }
  };

  const handleChangeTwo = (event) => {
    setPlaylistsUri((curr) => ({
      ...curr,
      playlistTwo: { link: event.target.value },
    }));
    if (fade) {
      setFade(false);
    }
  };

  const handleButtonClick = async (event) => {
    if (!isLoading) {
      setIsLoading(true);
    }
    const token = await getToken();
    for (let playlist in playlistsUri) {
      const { link } = playlistsUri[playlist];
      const playlistInfo = await getPlaylist(token, link);
      if (playlistInfo !== undefined) {
        const { name, avatar, username, tracks } = playlistInfo;
        setPlaylists((curr) => ({
          ...curr, // When updating current obj, don't forget to bring in the others
          [playlist]: {
            name: name,
            avatar: avatar,
            username: username,
            tracks: tracks,
          },
        }));
      }
    }
    setFade(true);
    setUpdatedPlaylist(!updatedPlaylist);
    setShowResult(true);
    setIsLoading(false);
  };

  useEffect(() => {
    if (
      playlistsUri.playlistOne.link !== '' &&
      playlistsUri.playlistTwo.link !== ''
    ) {
      let result = getSimilarities();
      setSimilarTracks(result);
    }
  }, [updatedPlaylist]);

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
        if (data.items[i].track.album.uri !== null) {
          tracks.push(data.items[i]);
        }
      }
      await getTracks(token, data.next, tracks);
    }
  };

  const getPlaylist = async (token, playlistUri) => {
    let parsedUrl = '';
    let playlistId = '';
    if (playlistUri.startsWith('https://open.spotify.com/')) {
      parsedUrl = playlistUri.substring(34, 56);
      playlistId = parsedUrl;
    } else if (playlistUri.startsWith('spotify:playlist:')) {
      playlistId = playlistUri.split(':')[2];
    } else {
      return;
    }

    // TODO: Validate playlistId

    if (playlistId.length < 22) {
      // Toast Message
      return;
    }

    const result = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        method: 'GET',
        headers: { Authorization: 'Bearer ' + token },
      }
    );

    if (result.status === 200) {
      let tracks = [];
      const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?market=NA&limit=100&offset=0`;

      await getTracks(token, url, tracks);

      const data = await result.json();
      if (data.images.length > 1) {
        return {
          name: data.name,
          avatar: data.images[1].url,
          username: data.owner.display_name,
          tracks: tracks, // process tracks manually skip track.album.uri === null
        };
      }
      return {
        name: data.name,
        avatar: data.images[0].url,
        username: data.owner.display_name,
        tracks: tracks,
      };
    }
    // Maybe a toast message?
    return undefined;
  };

  const getSimilarities = () => {
    let result = [];
    const playlistOneTracks = playlists.playlistOne.tracks;
    const playlistTwoTracks = playlists.playlistTwo.tracks;

    let playlistTwoTrackIds = {};

    for (let i = 0; i < playlistTwoTracks.length; i++) {
      const {
        track: { id },
      } = playlistTwoTracks[i];
      playlistTwoTrackIds[id] = 1;
    }

    for (let i = 0; i < playlistOneTracks.length; i++) {
      const {
        track: { id },
      } = playlistOneTracks[i];
      if (playlistTwoTrackIds[id] === 1) {
        result.push(playlistOneTracks[i]);
      }
    }
    return result;
  };

  return (
    <Fade in={true} timeout={400}>
      <div className="Home">
        <Navbar />
        <Container maxWidth="md">
          <Typography variant="h2" className={classes.tagline}>
            mnemonic.
          </Typography>
          <Typography variant="h5" className={classes.bodyline}>
            find similarities between two playlists
          </Typography>
        </Container>
        <Container style={{ paddingTop: '40px', paddingBottom: '20px' }}>
          <Search label={'Playlist One'} handleChange={handleChangeOne} />
        </Container>
        <Container style={{ padding: '10px' }}>
          <Search label={'Playlist Two'} handleChange={handleChangeTwo} />
        </Container>
        <Container style={{ paddingTop: '40px' }}>
          <Button className={classes.mainButton} onClick={handleButtonClick}>
            compare
          </Button>
        </Container>
        <Loader loading={isLoading}></Loader>
        <Container className={classes.playlistInfo}>
          <Data
            username={playlists.playlistOne.username}
            playlistName={playlists.playlistOne.name}
            img={playlists.playlistOne.avatar}
            tracks={playlists.playlistOne.tracks}
            fade={fade}
            timeout={500}
          ></Data>
          <Data
            username={playlists.playlistTwo.username}
            playlistName={playlists.playlistTwo.name}
            img={playlists.playlistTwo.avatar}
            tracks={playlists.playlistTwo.tracks}
            fade={fade}
            timeout={1000}
          ></Data>
        </Container>
        <Container
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <SimilaritiesList
            tracks={similarTracks}
            showResult={showResult}
            fade={fade}
          ></SimilaritiesList>
        </Container>
      </div>
    </Fade>
  );
}

export default Home;
