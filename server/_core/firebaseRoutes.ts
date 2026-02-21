import type { Express, Request, Response } from 'express';
import { createSessionCookie, revokeRefreshTokens } from './firebaseAdmin';
import { FIREBASE_SESSION_COOKIE } from './firebaseMiddleware';

export function registerFirebaseRoutes(app: Express) {
  // Create session cookie from ID token
  app.post('/api/firebase/signin', async (req: Request, res: Response) => {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        return res.status(400).json({ error: 'ID token is required' });
      }

      // Create session cookie (5 days expiration)
      const sessionCookie = await createSessionCookie(idToken, 60 * 60 * 24 * 5);

      // Set secure cookie
      res.cookie(FIREBASE_SESSION_COOKIE, sessionCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 5 * 1000, // 5 days in milliseconds
        path: '/',
      });

      res.json({ success: true });
    } catch (error) {
      console.error('[Firebase] Session creation failed:', error);
      res.status(401).json({ error: 'Failed to create session' });
    }
  });

  // Logout - clear session cookie
  app.post('/api/firebase/signout', async (req: Request, res: Response) => {
    try {
      const firebaseUser = (req as any).firebaseUser;

      if (firebaseUser && firebaseUser.uid) {
        // Revoke refresh tokens
        await revokeRefreshTokens(firebaseUser.uid);
      }

      // Clear session cookie
      res.clearCookie(FIREBASE_SESSION_COOKIE, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });

      res.json({ success: true });
    } catch (error) {
      console.error('[Firebase] Logout failed:', error);
      res.status(500).json({ error: 'Logout failed' });
    }
  });

  // Get current user
  app.get('/api/firebase/user', (req: Request, res: Response) => {
    const firebaseUser = (req as any).firebaseUser;

    if (!firebaseUser) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    res.json({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.name || null,
      emailVerified: firebaseUser.email_verified || false,
    });
  });
}
