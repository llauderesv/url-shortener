import redis from './redis-client.js';

const appKey = 'url_shortener';
const urlIdCounterKey = 'url_id_counter';

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

    return await redis.hSet(appKey, shortCode, longUrl);
  } catch (err) {
    console.log('RedisError:', err);
  }
}

export async function getLongUrl(shortCode) {
  try {
    return await redis.hGet(appKey, shortCode);
  } catch (err) {
    console.log('RedisError:', err);
  }
}

export async function getAllUrls() {
  try {
    return await redis.hGetAll(appKey);
  } catch (err) {
    console.log('RedisError:', err);
  }
}

export async function incrClicks(shortCode) {
  try {
    return await redis.incr(`${appKey}_${shortCode}`);
  } catch (err) {
    console.log('RedisError:', err);
  }
}

export async function getClicks(shortCode) {
  try {
    return await redis.get(`${appKey}_${shortCode}`);
  } catch (err) {
    console.log('RedisError:', err);
  }
}
