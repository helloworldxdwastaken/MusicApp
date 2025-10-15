import express from 'express';
import Transmission from 'transmission';
import path from 'path';

const router = express.Router();

// Initialize Transmission client
const transmission = new Transmission({
  host: process.env.TRANSMISSION_HOST || 'localhost',
  port: process.env.TRANSMISSION_PORT || 9091,
  username: process.env.TRANSMISSION_USERNAME,
  password: process.env.TRANSMISSION_PASSWORD
});

// Add torrent by magnet link or torrent URL
router.post('/add', async (req, res) => {
  try {
    const { magnetLink, torrentUrl, artist, album } = req.body;
    
    if (!magnetLink && !torrentUrl) {
      return res.status(400).json({ error: 'Magnet link or torrent URL is required' });
    }

    const downloadPath = process.env.DOWNLOAD_PATH || '/downloads/music';
    const subfolder = artist && album ? path.join(artist, album) : '';
    const fullPath = path.join(downloadPath, subfolder);

    const options = {
      'download-dir': fullPath
    };

    transmission.addUrl(magnetLink || torrentUrl, options, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to add torrent', message: err.message });
      }
      
      res.json({
        success: true,
        torrentId: result.id,
        name: result.name,
        downloadPath: fullPath
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add download', message: error.message });
  }
});

// Get all torrents
router.get('/list', async (req, res) => {
  try {
    transmission.get((err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to get torrents', message: err.message });
      }
      
      res.json(result.torrents);
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list downloads', message: error.message });
  }
});

// Get torrent status
router.get('/status/:torrentId', async (req, res) => {
  try {
    const { torrentId } = req.params;
    
    transmission.get(parseInt(torrentId), (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to get torrent status', message: err.message });
      }
      
      if (result.torrents.length === 0) {
        return res.status(404).json({ error: 'Torrent not found' });
      }
      
      const torrent = result.torrents[0];
      res.json({
        id: torrent.id,
        name: torrent.name,
        status: torrent.status,
        progress: torrent.percentDone * 100,
        downloadSpeed: torrent.rateDownload,
        uploadSpeed: torrent.rateUpload,
        eta: torrent.eta,
        downloadedBytes: torrent.downloadedEver,
        totalSize: torrent.totalSize
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get download status', message: error.message });
  }
});

// Remove torrent
router.delete('/remove/:torrentId', async (req, res) => {
  try {
    const { torrentId } = req.params;
    const { deleteData = false } = req.query;
    
    transmission.remove(parseInt(torrentId), deleteData === 'true', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to remove torrent', message: err.message });
      }
      
      res.json({ success: true, message: 'Torrent removed' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove download', message: error.message });
  }
});

// Pause torrent
router.post('/pause/:torrentId', async (req, res) => {
  try {
    const { torrentId } = req.params;
    
    transmission.stop(parseInt(torrentId), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to pause torrent', message: err.message });
      }
      
      res.json({ success: true, message: 'Torrent paused' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to pause download', message: error.message });
  }
});

// Resume torrent
router.post('/resume/:torrentId', async (req, res) => {
  try {
    const { torrentId } = req.params;
    
    transmission.start(parseInt(torrentId), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to resume torrent', message: err.message });
      }
      
      res.json({ success: true, message: 'Torrent resumed' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to resume download', message: error.message });
  }
});

export default router;


