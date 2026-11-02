import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleAuthProvider, OperationType, handleFirestoreError } from '../lib/firebase';
import { UserProfile } from '../types';

interface SignUpDetails {
  displayName: string;
  institution?: string;
  institutionType?: string;
  phone?: string;
  role?: string;
}

interface AuthContextType {
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

  // Sync user profile from Firestore
  const syncProfile = async (fUser: FirebaseUser) => {
    try {
      const userRef = doc(db, 'users', fUser.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        setUserProfile(data);
        // update lastLoginAt
        try {
          await setDoc(userRef, { lastLoginAt: new Date().toISOString() }, { merge: true });
        } catch (e) {
          // ignore
        }
      } else {
        // Create initial profile in Firestore
        const newProfile: UserProfile = {
          uid: fUser.uid,
          email: fUser.email || '',
          displayName: fUser.displayName || fUser.email?.split('@')[0] || 'Client Partner',
          institution: 'Atal Tinkering Lab / STEM Partner School',
          institutionType: 'Kendriya Vidyalaya',
          phone: fUser.phoneNumber || '',
          role: 'ATL In-Charge',
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
      console.error('Error fetching or creating user profile in Firestore:', err);
      // Fallback in-memory profile so the app remains functional
      setUserProfile({
        uid: fUser.uid,
        email: fUser.email || '',
        displayName: fUser.displayName || 'Client Partner',
        institution: 'Atal Tinkering Lab',
        institutionType: 'Kendriya Vidyalaya',
        role: 'ATL In-Charge',
        hasPurchased: false,
        totalOrdersCount: 0,
        totalSpent: 0,
        createdAt: new Date().toISOString()
      });
    }
  };

  useEffect(() => {
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
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    await syncProfile(cred.user);
  };

  const signUpWithEmail = async (email: string, pass: string, details: SignUpDetails) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateFirebaseProfile(cred.user, {
      displayName: details.displayName
    });

    const profileData: UserProfile = {
      uid: cred.user.uid,
      email: cred.user.email || email,
      displayName: details.displayName,
      institution: details.institution || 'Atal Tinkering Lab Partner',
      institutionType: details.institutionType || 'Kendriya Vidyalaya',
      phone: details.phone || '',
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
