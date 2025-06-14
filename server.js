import express from 'express';
import {
  getAllUrls,
  getAndSetShortCodeIfNotExist,
  getClicks,
  getLongUrl,
  incrClicks,
  shortenUrl,
} from './utils.js';

const app = express();

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || '127.0.0.1';

const domain = `http://${BASE_URL}:${PORT}`;

app.use(express.json());

app.get('/:code', async (req, res) => {
  let shortCode = req.params.code;
  console.log('HIT', shortCode);
  let originalUrl = await getLongUrl(shortCode);
  if (originalUrl) {
    await incrClicks(shortCode);
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
      'Surrogate-Control': 'no-store',
    });

    return res.redirect(302, originalUrl);
  }
  res.status(404).send('URL not found');
});

app.post('/shorten', async (req, res) => {
  let { url, shortCode } = req.body;
  if (!url) {
    res.status(400).send('Invalid long URL format');
    return;
  }

  if (!shortCode) {
    const success = await shortenUrl(url);
    if (!success) {
      res.status(500).json({ message: 'Something went wrong in the server' });
      return;
    }
  } else {
    const success = await getAndSetShortCodeIfNotExist(shortCode, url);
    if (!success) {
      const message = `The short code '${shortCode}' provided is already used. Please use another short code.`;
      res.status(400).json({ message });
      return;
    }
  }

  // Logic to shorten the URL and store it in Redis can be added here
  res.status(200).json({ message: 'URL shortened successfully' });
});

app.get('/', async (req, res) => {
  let urls = await getAllUrls();

  if (!urls) {
    res.json({ message: 'No available urls yet', data: [] });
    return;
  }

  let entries = Object.entries(urls);
  console.log('DEBUG', entries);
  let data = entries.map(item => `${domain}/${item[0]}`);

  res.json({ data: data });
});

app.get('/clicks/:code', async (req, res) => {
  let shortCode = req.params.code;

  let count = await getClicks(shortCode);
  let clickCount = count ? parseInt(count, 10) : 0;
  res.json({ shortCode, count: clickCount }).status(200);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
