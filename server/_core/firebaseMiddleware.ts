import type { Request, Response, NextFunction } from 'express';
import { verifySessionCookie, verifyFirebaseToken } from './firebaseAdmin';
import { COOKIE_NAME } from '@shared/const';

export const FIREBASE_SESSION_COOKIE = 'firebase_session';

export async function firebaseAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // Try to get session cookie first
    const sessionCookie = req.cookies[FIREBASE_SESSION_COOKIE];
    
    if (sessionCookie) {
      try {
        const decodedClaims = await verifySessionCookie(sessionCookie);
        (req as any).firebaseUser = decodedClaims;
        return next();
      } catch (error) {
        console.warn('[Firebase Auth] Session cookie verification failed, trying token...');
        // Fall through to try token
      }
    }

    // Try to get ID token from Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const idToken = authHeader.substring(7);
      try {
        const decodedToken = await verifyFirebaseToken(idToken);
        (req as any).firebaseUser = decodedToken;
        return next();
      } catch (error) {
        console.warn('[Firebase Auth] ID token verification failed');
      }
    }

    // No valid authentication found
    (req as any).firebaseUser = null;
    next();
  } catch (error) {
    console.error('[Firebase Auth] Middleware error:', error);
    (req as any).firebaseUser = null;
    next();
  }
}

export function requireFirebaseAuth(req: Request, res: Response, next: NextFunction) {
  if (!(req as any).firebaseUser) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}
