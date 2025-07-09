import { useState, useEffect, useCallback, useRef } from "react";
import { User } from "firebase/auth";
import { onAuthStateChange, signInWithGoogle, signOutUser } from "../lib/firebase";

// Cache for storing the auth check result
let authCheckPromise: Promise<{ user: User | null; error: string | null }> | null = null;

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    // onAuthStateChange returns an unsubscribe function
    const unsubscribe = onAuthStateChange((user) => {
      console.log("🔥 Firebase auth state changed:", user ? "User signed in" : "User signed out");
      if (user) {
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      await signInWithGoogle();
      // onAuthStateChanged will handle the rest
    } catch (error: any) {
      console.error("❌ Sign in process failed:", error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'An unknown error occurred during sign in.',
      }));
    }
  };

  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      await signOutUser();
      // onAuthStateChanged will handle the user state update

      // Also, clear the session on the server
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include' 
      });

      // Redirect to home page after sign out
      window.location.href = '/';
    } catch (error) {
      console.error("❌ Error signing out:", error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to sign out properly',
      }));
    }
  };

  return {
    user: authState.user,
    isLoading: authState.isLoading,
    error: authState.error,
    isAuthenticated: authState.isAuthenticated,
    signIn,
    signOut,
  };
}
