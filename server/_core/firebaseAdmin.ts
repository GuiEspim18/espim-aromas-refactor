import admin from "firebase-admin";

let adminApp: admin.app.App | null = null;

export function initializeFirebaseAdmin() {
  if (adminApp) {
    return adminApp;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId) {
    throw new Error("FIREBASE_PROJECT_ID is not configured");
  }

  if (!clientEmail) {
    throw new Error("FIREBASE_CLIENT_EMAIL is not configured");
  }

  if (!privateKey) {
    throw new Error("FIREBASE_PRIVATE_KEY is not configured");
  }

  adminApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

  console.log("[Firebase Admin] Initialized successfully");

  return adminApp;
}

export function getFirebaseAdmin() {
  if (!adminApp) {
    return initializeFirebaseAdmin();
  }
  return adminApp;
}

export async function verifyFirebaseToken(token: string) {
  const app = getFirebaseAdmin();
  return app.auth().verifyIdToken(token);
}

export async function createSessionCookie(
  idToken: string,
  expiresIn: number = 60 * 60 * 24 * 5 // 5 dias
) {
  const app = getFirebaseAdmin();
  return app.auth().createSessionCookie(idToken, {
    expiresIn: expiresIn * 1000,
  });
}

export async function verifySessionCookie(sessionCookie: string) {
  const app = getFirebaseAdmin();
  return app.auth().verifySessionCookie(sessionCookie, true);
}

export async function revokeRefreshTokens(uid: string) {
  const app = getFirebaseAdmin();
  return app.auth().revokeRefreshTokens(uid);
}