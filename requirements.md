# Requirements

In designing a URL shortener, the following requirements should be considered:

The primary goal of a URL shortener is to replace a long URL like: <https://example.com/articles/2025/06/12/designing-url-shortener> with something short like: <https://short.ly/aB3x9>

This short code `aB3x9` is an encoded form that maps to the original URL in your system's database.

The code should be simple enough but the tricky part is every code is unique...

## Short code mapping

- The generated short code can be map to the original URL can be stored in Redis cache database for fast retrieval.
- Retrieve the original long URL using that code.
- When using the base62 format, we need to pass an ID to the argument so that we can generate a unique code in a base62 format.
- Let's use redis like INCR BY command so that we can increment a number in atomicity and use the id and pass it to base62 function.
- The user should be able create their own url code / alias if they want to. It should checks whether the created alias is existing or not. If not we can use that alias and if yes return an error message.

## URL Clicks

- Tracks the clicks / redirects of the short code
- We can use the redis INCR operation to count the number of clicks by link

## URL Validation

- The system must validate the input long URL to ensure it is a legitimate and well-formed URL (e.g., starts with http:// or https://).

- The system should prevent the shortening of its own short URLs to avoid infinite loops.

## Scaling

- We can use the
