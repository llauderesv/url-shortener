import redis from './redis-client.js';
import { RedisError } from './RedisError.js';

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

/**
 * Attempts to set a short code for a URL if it does not already exist.
 * @returns {Promise<boolean>} true if set, false if already exists
 * @throws {RedisError} if Redis operation fails
 */
export async function getAndSetShortCodeIfNotExist(shortCode, url) {
  try {
    const longUrl = await redis.hGet(appKey, shortCode);
    if (!longUrl) {
      await redis.hSet(appKey, shortCode, url);
      return true;
    }
    return false;
  } catch (err) {
    throw RedisError.fromError(err);
  }
}

/**
 * Generates a new short code for a long URL and stores it.
 * @returns {Promise<string>} the generated short code
 * @throws {RedisError} if Redis operation fails
 */
export async function shortenUrl(longUrl) {
  try {
    const id = await redis.incr(urlIdCounterKey);
    const shortCode = encodeBase62(id);
    await redis.hSet(appKey, shortCode, longUrl);
    return shortCode;
  } catch (err) {
    throw RedisError.fromError(err);
  }
}

/**
 * Retrieves the long URL for a given short code.
 * @param {string} shortCode - The short code to look up.
 * @returns {Promise<string|null>} The long URL or null if not found.
 * @throws {RedisError} If Redis operation fails.
 */
export async function getLongUrl(shortCode) {
  try {
    return await redis.hGet(appKey, shortCode);
  } catch (err) {
    throw RedisError.fromError(err);
  }
}

/**
 * Retrieves all short code to long URL mappings.
 * @returns {Promise<Object>} An object mapping short codes to long URLs.
 * @throws {RedisError} If Redis operation fails.
 */
export async function getAllUrls() {
  try {
    return await redis.hGetAll(appKey);
  } catch (err) {
    throw RedisError.fromError(err);
  }
}

/**
 * Increments the click count for a given short code.
 * @param {string} shortCode - The short code whose click count to increment.
 * @returns {Promise<number>} The new click count.
 * @throws {RedisError} If Redis operation fails.
 */
export async function incrClicks(shortCode) {
  try {
    return await redis.incr(`${appKey}_${shortCode}`);
  } catch (err) {
    throw RedisError.fromError(err);
  }
}

/**
 * Retrieves the click count for a given short code.
 * @param {string} shortCode - The short code whose click count to retrieve.
 * @returns {Promise<string|null>} The click count as a string, or null if not found.
 * @throws {RedisError} If Redis operation fails.
 */
export async function getClicks(shortCode) {
  try {
    return await redis.get(`${appKey}_${shortCode}`);
  } catch (err) {
    throw RedisError.fromError(err);
  }
}
