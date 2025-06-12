import redis from './redis-client.js';

const urlIdCounterKey = 'url_id_counter';
const hashKeyUrlId = 'url_shortener';

function encodeBase62(num) {
  const charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let str = '';
  while (num > 0) {
    str = charset[num % 62] + str;
    num = Math.floor(num / 62);
  }
  return str.padStart(6, '0');
}

export async function shortenUrl(longUrl) {
  try {
    let id = await redis.incr(urlIdCounterKey);
    let shortCode = encodeBase62(id);

    return await redis.hSet(hashKeyUrlId, shortCode, longUrl);
  } catch (err) {
    console.log('RedisError:', err);
  }
}

export async function getLongUrl(shortCode) {
  try {
    return await redis.hGet(hashKeyUrlId, shortCode);
  } catch (err) {
    console.log('RedisError:', err);
  }
}

export async function getAllUrls() {
  try {
    return await redis.hGetAll(hashKeyUrlId);
  } catch (err) {
    console.log('RedisError:', err);
  }
}
