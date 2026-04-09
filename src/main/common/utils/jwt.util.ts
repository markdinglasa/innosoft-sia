import { TokenPayload } from '@shared/types/auth.types'
import jwt from 'jsonwebtoken'

// In production, move this to an environment variable
const JWT_SECRET = 'nutshell-jwt-secret-key-2026'
const ACCESS_TOKEN_EXPIRY = '8h' // 8 hours
const REFRESH_TOKEN_EXPIRY = '7d' // 7 days

/**
 * Generates a short-lived access token.
 */
export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY })
}

/**
 * Generates a long-lived refresh token.
 */
export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY })
}

/**
 * Verifies a token and returns the decoded payload.
 * Throws if the token is expired or invalid.
 */
export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload
}

