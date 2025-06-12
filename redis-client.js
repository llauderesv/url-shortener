import { createClient } from 'redis';

const host = '127.0.0.1';
const port = 6379;
const password = '';

const client = createClient({
  socket: {
    host: host,
    port: port,
  },
  password: password,
});

client.on('error', err => {
  console.log('Redis Client Error', err);
  process.exit(1);
});

(async function start() {
  try {
    await client.connect();
    console.log('Connected to Redis!');
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    process.exit(1);
  }
})();

export default client;
