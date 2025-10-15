import express from 'express';
import axios from 'axios';

const router = express.Router();

const jellyfinClient = axios.create({
  baseURL: process.env.JELLYFIN_URL,
  headers: {
    'X-Emby-Token': process.env.JELLYFIN_API_KEY
  }
});

// Get all music libraries
router.get('/libraries', async (req, res) => {
  try {
    const response = await jellyfinClient.get(`/Users/${process.env.JELLYFIN_USER_ID}/Views`);
    const musicLibraries = response.data.Items.filter(item => item.CollectionType === 'music');
    res.json(musicLibraries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch libraries', message: error.message });
  }
});

// Get all artists
router.get('/artists', async (req, res) => {
  try {
    const response = await jellyfinClient.get(`/Artists`, {
      params: {
        userId: process.env.JELLYFIN_USER_ID,
        recursive: true,
        sortBy: 'SortName',
        sortOrder: 'Ascending'
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch artists', message: error.message });
  }
});

// Get albums
router.get('/albums', async (req, res) => {
  try {
    const { artistId, limit = 50, startIndex = 0 } = req.query;
    const params = {
      userId: process.env.JELLYFIN_USER_ID,
      includeItemTypes: 'MusicAlbum',
      recursive: true,
      sortBy: 'SortName',
      sortOrder: 'Ascending',
      limit,
      startIndex
    };
    
    if (artistId) {
      params.artistIds = artistId;
    }
    
    const response = await jellyfinClient.get(`/Items`, { params });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch albums', message: error.message });
  }
});

// Get tracks from album
router.get('/albums/:albumId/tracks', async (req, res) => {
  try {
    const { albumId } = req.params;
    const response = await jellyfinClient.get(`/Items`, {
      params: {
        userId: process.env.JELLYFIN_USER_ID,
        parentId: albumId,
        sortBy: 'SortName'
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tracks', message: error.message });
  }
});

// Get recently added
router.get('/recent', async (req, res) => {
  try {
    const response = await jellyfinClient.get(`/Users/${process.env.JELLYFIN_USER_ID}/Items/Latest`, {
      params: {
        includeItemTypes: 'Audio',
        limit: 20
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recent items', message: error.message });
  }
});

// Search in Jellyfin library
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const response = await jellyfinClient.get(`/Items`, {
      params: {
        userId: process.env.JELLYFIN_USER_ID,
        searchTerm: query,
        recursive: true,
        includeItemTypes: 'Audio,MusicAlbum,MusicArtist'
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search', message: error.message });
  }
});

// Get stream URL for a track
router.get('/stream/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const streamUrl = `${process.env.JELLYFIN_URL}/Audio/${itemId}/stream?api_key=${process.env.JELLYFIN_API_KEY}`;
    res.json({ streamUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get stream URL', message: error.message });
  }
});

// Get item image
router.get('/image/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const { type = 'Primary', maxWidth = 400 } = req.query;
    const imageUrl = `${process.env.JELLYFIN_URL}/Items/${itemId}/Images/${type}?maxWidth=${maxWidth}&api_key=${process.env.JELLYFIN_API_KEY}`;
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get image URL', message: error.message });
  }
});

export default router;


