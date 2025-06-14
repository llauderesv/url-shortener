export class RedisError extends Error {
  constructor(message, code, originalError) {
    super(message);
    this.name = 'RedisError';
    this.code = code;
    this.originalError = originalError;
  }
  toString() {
    return `${this.name}: ${this.message}`;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
    };
  }
  toResponse() {
    return {
      error: this.toJSON(),
    };
  }
  static fromError(err) {
    // Extract useful info from the original error
    return new RedisError(
      err.message || 'Unknown Redis error',
      err.code || 'REDIS_UNKNOWN',
      err
    );
  }
}
