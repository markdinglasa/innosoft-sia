import { session } from 'electron'

const COOKIE_URL = 'http://pos.local'

/**
 * Utility class for managing cookies in the Electron Main process session.
 */
export class CookieUtil {
  /**
   * Sets a secure, HttpOnly cookie in the default session.
   */
  static async set(name: string, value: string, maxAgeInSeconds: number): Promise<void> {
    const expirationDate = Math.floor(Date.now() / 1000) + maxAgeInSeconds

    await session.defaultSession.cookies.set({
      url: COOKIE_URL,
      name,
      value: encodeURIComponent(value),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expirationDate,
      path: '/'
    })
  }

  /**
   * Retrieves a cookie value by name.
   */
  static async get(name: string): Promise<string | null> {
    const cookies = await session.defaultSession.cookies.get({
      url: COOKIE_URL,
      name
    })

    if (cookies.length > 0) {
      return decodeURIComponent(cookies[0].value)
    }

    return null
  }

  /**
   * Removes a cookie by name.
   */
  static async remove(name: string): Promise<void> {
    await session.defaultSession.cookies.remove(COOKIE_URL, name)
  }

  /**
   * Clears all session cookies.
   */
  static async clearAll(): Promise<void> {
    const cookies = await session.defaultSession.cookies.get({ url: COOKIE_URL })
    for (const cookie of cookies) {
      await session.defaultSession.cookies.remove(COOKIE_URL, cookie.name)
    }
  }
}

