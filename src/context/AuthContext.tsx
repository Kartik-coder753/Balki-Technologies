import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile as updateFirebaseProfile,
  getRedirectResult
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleAuthProvider, OperationType, handleFirestoreError } from '../lib/firebase';
import { UserProfile } from '../types';

export interface SignUpDetails {
  displayName: string;
  institution?: string;
  institutionType?: string;
  phone?: string;
  role?: string;
}

export interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, details: SignUpDetails) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfileData: (details: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Synchronize or bootstrap user profile document in Firestore
  const syncProfile = async (fUser: FirebaseUser, fallbackDetails?: Partial<UserProfile>) => {
    try {
      const userRef = doc(db, 'users', fUser.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        setUserProfile(data);
        // Update last login timestamp quietly
        setDoc(userRef, { lastLoginAt: new Date().toISOString() }, { merge: true }).catch(() => {});
      } else {
        // Create initial profile in Firestore
        const newProfile: UserProfile = {
          uid: fUser.uid,
          email: fUser.email || '',
          displayName: fallbackDetails?.displayName || fUser.displayName || fUser.email?.split('@')[0] || 'Client Partner',
          institution: fallbackDetails?.institution || 'Atal Tinkering Lab / STEM Partner School',
          institutionType: fallbackDetails?.institutionType || 'Kendriya Vidyalaya',
          phone: fallbackDetails?.phone || fUser.phoneNumber || '',
          role: fallbackDetails?.role || 'ATL In-Charge',
          hasPurchased: false,
          totalOrdersCount: 0,
          totalSpent: 0,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        };
        await setDoc(userRef, newProfile);
        setUserProfile(newProfile);
      }
    } catch (err) {
      console.warn('Profile synchronization notice (using resilient client state):', err);
      // Fallback in-memory profile so the client is never locked out of the UI
      setUserProfile({
        uid: fUser.uid,
        email: fUser.email || '',
        displayName: fallbackDetails?.displayName || fUser.displayName || 'Client Partner',
        institution: fallbackDetails?.institution || 'Atal Tinkering Lab',
        institutionType: fallbackDetails?.institutionType || 'Kendriya Vidyalaya',
        role: fallbackDetails?.role || 'ATL In-Charge',
        hasPurchased: false,
        totalOrdersCount: 0,
        totalSpent: 0,
        createdAt: new Date().toISOString()
      });
    }
  };

  useEffect(() => {
    // Process redirect result if any redirect auth flow was used
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          await syncProfile(result.user);
        }
      })
      .catch((err) => {
        // Ignore normal no-redirect status
        if (err.code !== 'auth/popup-closed-by-user') {
          console.warn('Firebase redirect authentication status:', err);
        }
      });

    // Subscribe to auth state changes with persistent session tracking
    const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
      setCurrentUser(fUser);
      if (fUser) {
        await syncProfile(fUser);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    const trimmedEmail = email.trim();
    const cred = await signInWithEmailAndPassword(auth, trimmedEmail, pass);
    await syncProfile(cred.user);
  };

  const signUpWithEmail = async (email: string, pass: string, details: SignUpDetails) => {
    const trimmedEmail = email.trim();
    const cred = await createUserWithEmailAndPassword(auth, trimmedEmail, pass);
    
    // Update display name in Firebase Auth user record
    if (details.displayName) {
      await updateFirebaseProfile(cred.user, {
        displayName: details.displayName.trim()
      }).catch((e) => console.warn('Could not update Auth displayName:', e));
    }

    const profileData: UserProfile = {
      uid: cred.user.uid,
      email: cred.user.email || trimmedEmail,
      displayName: details.displayName.trim() || 'Client Partner',
      institution: details.institution?.trim() || 'Atal Tinkering Lab Partner',
      institutionType: details.institutionType || 'Kendriya Vidyalaya',
      phone: details.phone?.trim() || '',
      role: details.role || 'ATL In-Charge',
      hasPurchased: false,
      totalOrdersCount: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'users', cred.user.uid), profileData);
      setUserProfile(profileData);
    } catch (e) {
      console.warn('Initial profile doc set error:', e);
      setUserProfile(profileData);
      handleFirestoreError(e, OperationType.WRITE, `users/${cred.user.uid}`);
    }
  };

  const signInWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleAuthProvider);
    await syncProfile(cred.user);
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    setUserProfile(null);
    setCurrentUser(null);
  };

  const updateProfileData = async (details: Partial<UserProfile>) => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const updated = {
        ...(userProfile || {}),
        ...details,
        uid: currentUser.uid,
        email: currentUser.email || userProfile?.email || ''
      } as UserProfile;

      await setDoc(userRef, updated, { merge: true });
      setUserProfile(updated);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${currentUser.uid}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        logout,
        updateProfileData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
