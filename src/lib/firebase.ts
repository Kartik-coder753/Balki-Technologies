import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  setPersistence, 
  browserLocalPersistence, 
  Auth 
} from 'firebase/auth';
import { getFirestore, Firestore, doc, getDocFromServer } from 'firebase/firestore';
import rawConfig from '../../firebase-applet-config.json';

// Configuration resolution:
// Read from environment variables if present (for CI/CD or Vercel deployments),
// falling back safely to firebase-applet-config.json.
// CRITICAL: authDomain must always be the Firebase project domain (e.g. gen-lang-client-0184886612.firebaseapp.com)
// and NEVER changed to the production Vercel domain.
const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || rawConfig.projectId || 'gen-lang-client-0184886612',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || rawConfig.appId || '1:254491030700:web:9e4c7b78763bcb0e715b09',
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || rawConfig.apiKey || 'AIzaSyB6uelBnRYjo_daB843k-fEei7PiMLdiy8',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || rawConfig.authDomain || 'gen-lang-client-0184886612.firebaseapp.com',
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || rawConfig.firestoreDatabaseId || 'ai-studio-balkitechnologie-18d8f381-5363-412d-b9cb-53b6b6bbba92',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || rawConfig.storageBucket || 'gen-lang-client-0184886612.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || rawConfig.messagingSenderId || '254491030700',
  measurementId: rawConfig.measurementId || '',
  oAuthClientId: rawConfig.oAuthClientId || '254491030700-3jhmhul66j4vmhoe5bfl4s58ue98joo2.apps.googleusercontent.com',
  recaptchaSiteKey: rawConfig.recaptchaSiteKey || ''
};

// Initialize Firebase only once across re-renders and HMR cycles
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore specifying the databaseId
export const db: Firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Test connection on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      setTimeout(async () => {
        try {
          await getDocFromServer(doc(db, 'test', 'connection'));
        } catch {
          console.warn("Firestore connection: running in resilient client mode.");
        }
      }, 1500);
    }
  }
}
testConnection();

// Initialize Firebase Auth
export const auth: Auth = getAuth(app);

// Explicitly configure browserLocalPersistence so client sessions persist across refreshes and tabs
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('Firebase setPersistence notice:', err);
});

// Configure Google Auth Provider
export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({
  prompt: 'select_account'
});

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
  READ = 'read',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType | string;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType | 'read' | 'create' | 'update' | 'delete' | 'list' | 'get' | 'write', path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Standardized Firebase Auth Error Parser
 * Returns a human-friendly message and identifies unauthorized-domain issues
 */
export function parseAuthError(err: any): { message: string; isUnauthorizedDomain: boolean } {
  const code = err?.code || '';
  const rawMsg = err?.message || String(err);
  const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'balki-technologies.vercel.app';

  if (code === 'auth/unauthorized-domain' || rawMsg.includes('auth/unauthorized-domain')) {
    return {
      isUnauthorizedDomain: true,
      message: `Domain '${currentHost}' is not authorized in Firebase Authentication. Please add '${currentHost}' to Authorized Domains in your Firebase Console.`
    };
  }

  if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
    return {
      isUnauthorizedDomain: false,
      message: 'Invalid email or password. Please verify your credentials or register a new account.'
    };
  }

  if (code === 'auth/email-already-in-use') {
    return {
      isUnauthorizedDomain: false,
      message: 'An account with this email address already exists. Please switch to the Sign In tab.'
    };
  }

  if (code === 'auth/invalid-email') {
    return {
      isUnauthorizedDomain: false,
      message: 'Please provide a valid institutional or personal email address.'
    };
  }

  if (code === 'auth/weak-password') {
    return {
      isUnauthorizedDomain: false,
      message: 'Password must be at least 6 characters long.'
    };
  }

  if (code === 'auth/operation-not-allowed') {
    return {
      isUnauthorizedDomain: false,
      message: 'This authentication provider is not enabled in Firebase Console. Please enable Email/Password or Google provider under Authentication > Sign-in method.'
    };
  }

  if (code === 'auth/popup-blocked') {
    return {
      isUnauthorizedDomain: false,
      message: 'Authentication popup was blocked by your browser. Please allow popups for this site and try again.'
    };
  }

  if (code === 'auth/popup-closed-by-user') {
    return {
      isUnauthorizedDomain: false,
      message: 'Google sign-in window was closed before completing authentication.'
    };
  }

  if (code === 'auth/cancelled-popup-request') {
    return {
      isUnauthorizedDomain: false,
      message: 'Previous sign-in request was cancelled. Please try again.'
    };
  }

  if (code === 'auth/too-many-requests') {
    return {
      isUnauthorizedDomain: false,
      message: 'Access temporarily disabled due to multiple failed login attempts. Please wait a few minutes or reset your password.'
    };
  }

  if (code === 'auth/network-request-failed') {
    return {
      isUnauthorizedDomain: false,
      message: 'Network connection failed. Please check your internet connectivity and try again.'
    };
  }

  return {
    isUnauthorizedDomain: false,
    message: rawMsg || 'Authentication failed. Please verify your details and try again.'
  };
}
