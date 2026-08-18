import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { initializeFirestore, getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const configAny = firebaseConfig as any;
export const isRemixed = configAny?.apiKey?.includes('remixed') || !configAny?.apiKey;

export let app: any = null;
export let db: any = null;
export let auth: any = null;

if (!isRemixed) {
  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
    if (configAny.firestoreDatabaseId) {
      db = initializeFirestore(app, { experimentalForceLongPolling: true }, configAny.firestoreDatabaseId);
    } else {
      db = initializeFirestore(app, { experimentalForceLongPolling: true });
    }
    auth = getAuth(app);
  } catch (e) {
    console.warn("Firebase Init Error", e);
  }
}

// Ensure auth is at least a valid dummy if not initialized
if (!auth) {
  auth = {
    isDummy: true,
    currentUser: null,
    onAuthStateChanged: (cb: any) => {
      cb(null);
      return () => {};
    }
  };
}

export const googleProvider = !isRemixed ? new GoogleAuthProvider() : null;
if (googleProvider) {
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });
  googleProvider.addScope('https://www.googleapis.com/auth/gmail.readonly');
  googleProvider.addScope('https://www.googleapis.com/auth/gmail.send');
}

export let cachedAccessToken: string | null = null;
export const setCachedAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};
export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

// clear token on sign out
if (!isRemixed && auth && !auth.isDummy) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      cachedAccessToken = null;
    }
  });
}


export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  if (!isRemixed) {
    throw new Error(JSON.stringify(errInfo));
  }
}

