import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signInAnonymously,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInDemoParent: () => Promise<void>;
  logout: () => Promise<void>;
  updateSubscription: (tier: 'free' | 'plus' | 'family', billingCycle?: 'monthly' | 'yearly') => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const syncUserProfile = async (firebaseUser: User, customName?: string) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        const profile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || 'demo.parent@autismchildbridge.com',
          displayName: customName || firebaseUser.displayName || (firebaseUser.isAnonymous ? 'Demo Parent' : 'Caregiver'),
          role: 'parent',
          subscriptionTier: 'free',
          isPaid: false,
          billingCycle: 'monthly',
          subscriptionStatus: 'inactive',
          createdAt: new Date().toISOString(),
        };
        await setDoc(userRef, profile);
        setUserProfile(profile);
      } else {
        const data = snap.data();
        const profile: UserProfile = {
          uid: firebaseUser.uid,
          email: data.email || firebaseUser.email,
          displayName: data.displayName || customName || firebaseUser.displayName || 'Parent',
          role: data.role || 'parent',
          subscriptionTier: data.subscriptionTier || 'free',
          isPaid: data.isPaid ?? (data.subscriptionTier === 'plus' || data.subscriptionTier === 'family'),
          billingCycle: data.billingCycle || 'monthly',
          subscriptionStatus: data.subscriptionStatus || (data.isPaid ? 'active' : 'inactive'),
          createdAt: data.createdAt || new Date().toISOString(),
        };
        setUserProfile(profile);
      }
    } catch (err: any) {
      console.warn('Could not sync user profile to Firestore:', err);
      // Fallback local representation if network/firestore delay
      setUserProfile({
        uid: firebaseUser.uid,
        email: firebaseUser.email || 'parent@autismchildbridge.com',
        displayName: customName || firebaseUser.displayName || (firebaseUser.isAnonymous ? 'Demo Parent' : 'Caregiver'),
        role: 'parent',
        subscriptionTier: 'free',
        isPaid: false,
        billingCycle: 'monthly',
        subscriptionStatus: 'inactive',
        createdAt: new Date().toISOString(),
      });
    }
  };

  const updateSubscription = async (tier: 'free' | 'plus' | 'family', billingCycle: 'monthly' | 'yearly' = 'monthly') => {
    if (!user) return;
    const isPaid = tier !== 'free';
    const updatedData: Partial<UserProfile> = {
      subscriptionTier: tier,
      isPaid,
      billingCycle,
      subscriptionStatus: isPaid ? 'active' : 'inactive',
    };
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, updatedData, { merge: true });
    } catch (e) {
      console.warn('Could not update subscription in Firestore, updated locally:', e);
    }
    setUserProfile((prev) => prev ? ({ ...prev, ...updatedData }) : null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await syncUserProfile(currentUser);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    setError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      await syncUserProfile(cred.user);
    } catch (err: any) {
      console.error('Sign in error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password. Please check your credentials.');
      } else if (err.code === 'auth/too-many-requests') {
        throw new Error('Too many failed attempts. Please wait a moment and try again.');
      } else {
        throw new Error(err.message || 'Failed to sign in. Please try again.');
      }
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    setError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (name.trim()) {
        await updateProfile(cred.user, { displayName: name.trim() });
      }
      await syncUserProfile(cred.user, name.trim());
    } catch (err: any) {
      console.error('Sign up error:', err);
      if (err.code === 'auth/email-already-in-use') {
        throw new Error('This email is already registered. Please log in instead.');
      } else if (err.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters.');
      } else {
        throw new Error(err.message || 'Failed to create account.');
      }
    }
  };

  const signInWithGoogle = async () => {
    setError(null);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await syncUserProfile(cred.user);
    } catch (err: any) {
      console.error('Google sign in error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        throw new Error(err.message || 'Failed to sign in with Google.');
      }
    }
  };

  const signInDemoParent = async () => {
    setError(null);
    try {
      const cred = await signInAnonymously(auth);
      await updateProfile(cred.user, { displayName: 'Sarah Jenkins (Parent)' });
      await syncUserProfile(cred.user, 'Sarah Jenkins (Parent)');
    } catch (err: any) {
      console.error('Demo sign in error:', err);
      throw new Error('Failed to start demo session. Please try creating a free account.');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signInDemoParent,
      logout,
      updateSubscription,
      error,
      clearError
    }}>
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
