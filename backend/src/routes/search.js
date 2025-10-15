import express from 'express';
import axios from 'axios';

const router = express.Router();

// Search music using Last.fm API
router.get('/music', async (req, res) => {
  try {
    const { query, type = 'track', limit = 30 } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const lastfmApiKey = process.env.LASTFM_API_KEY;
    
    if (!lastfmApiKey) {
      return res.status(500).json({ error: 'Last.fm API key not configured' });
    }

    let method;
    switch (type) {
      case 'artist':
        method = 'artist.search';
        break;
      case 'album':
        method = 'album.search';
        break;
      case 'track':
      default:
        method = 'track.search';
    }

    const response = await axios.get('http://ws.audioscrobbler.com/2.0/', {
      params: {
        method,
        [type]: query,
        api_key: lastfmApiKey,
        format: 'json',
        limit
      }
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search music', message: error.message });
  }
});

// Get track info
router.get('/track/:artist/:track', async (req, res) => {
  try {
    const { artist, track } = req.params;
    const lastfmApiKey = process.env.LASTFM_API_KEY;

    const response = await axios.get('http://ws.audioscrobbler.com/2.0/', {
      params: {
        method: 'track.getInfo',
        artist,
        track,
        api_key: lastfmApiKey,
        format: 'json'
      }
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get track info', message: error.message });
  }
});

// Get album info
router.get('/album/:artist/:album', async (req, res) => {
  try {
    const { artist, album } = req.params;
    const lastfmApiKey = process.env.LASTFM_API_KEY;

    const response = await axios.get('http://ws.audioscrobbler.com/2.0/', {
      params: {
        method: 'album.getInfo',
        artist,
        album,
        api_key: lastfmApiKey,
        format: 'json'
      }
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get album info', message: error.message });
  }
});

// Get artist info
router.get('/artist/:artist', async (req, res) => {
  try {
    const { artist } = req.params;
    const lastfmApiKey = process.env.LASTFM_API_KEY;

    const response = await axios.get('http://ws.audioscrobbler.com/2.0/', {
      params: {
        method: 'artist.getInfo',
        artist,
        api_key: lastfmApiKey,
        format: 'json'
      }
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get artist info', message: error.message });
  }
});

// Get top tracks
router.get('/top/tracks', async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const lastfmApiKey = process.env.LASTFM_API_KEY;

    const response = await axios.get('http://ws.audioscrobbler.com/2.0/', {
      params: {
        method: 'chart.getTopTracks',
        api_key: lastfmApiKey,
        format: 'json',
        limit
      }
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get top tracks', message: error.message });
  }
});

export default router;


