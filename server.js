import express from 'express';
import { getAllUrls, getLongUrl, shortenUrl } from './utils.js';

const app = express();

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || '127.0.0.1';

const domain = `http://${BASE_URL}:${PORT}`;

app.use(express.json());

app.get('/:code', async (req, res) => {
  let originalUrl = await getLongUrl(req.params.code);
  if (originalUrl) {
    return res.redirect(301, originalUrl);
  }
  res.status(404).send('URL not found');
});

app.post('/shorten', async (req, res) => {
  let url = req.body.url;
  if (!url) {
    res.status(400).send('Invalid long URL format');
    return;
  }

  let id = await shortenUrl(url);
  if (!id || id < 1) {
    res.send("Something wen't wrong in the server");
    return;
  }

  // Logic to shorten the URL and store it in Redis can be added here
  res.send(`URL shortened successfully`).status(200);
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

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
