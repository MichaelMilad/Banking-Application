import rateLimit from 'express-rate-limit';

const ONE_MINUTE_MS = 60 * 1000;
const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

// Burst protection — applied globally
export const shortRateLimiter = rateLimit({
  windowMs: ONE_MINUTE_MS,
  limit: 60,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many requests, slow down.' },
});

// Sustained-use protection — applied globally
export const longRateLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES_MS,
  limit: 1000,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Request quota exceeded, try again later.' },
});

// Stricter limits for sensitive auth endpoints
export const loginRateLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES_MS,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Try again in 15 minutes.' },
});

export const otpRateLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES_MS,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many OTP attempts. Try again in 15 minutes.' },
});
