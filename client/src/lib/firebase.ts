import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { apiRequest } from './queryClient';

const firebaseConfig = {
  apiKey: "AIzaSyBdqd-bW3JuUDa5GYp4SRCWNBYksp0zQB4",
  authDomain: "omnisaas.firebaseapp.com",
  projectId: "omnisaas",
  storageBucket: "omnisaas.firebasestorage.app",
  messagingSenderId: "141507414503",
  appId: "1:141507414503:web:4c6a56543ff8cf41d75542",
  measurementId: "G-F77T9XFGYH"
};

// Initialize Firebase
let app: any = null;
let auth: any = null;
let firebaseAvailable = false;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  firebaseAvailable = true;
  console.log("✅ Firebase client initialized successfully");
} catch (error) {
  console.log("⚠️ Firebase client not available, using development mode");
}

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Sign in with Google
export const signInWithGoogle = async () => {
  console.log("🔐 Starting Google Sign In process...");
  
  // Check if Firebase is available
  if (!firebaseAvailable || !auth) {
    console.log("⚠️ Firebase not available, using development authentication fallback");
    try {
      console.log("🔐 Attempting development authentication...");
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for session cookies
        body: JSON.stringify({ development: true }) // Indicate this is a development mode request
      });

      console.log("📡 Development auth response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Development authentication failed:", errorText);
        throw new Error(`Development authentication failed: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log("✅ Development authentication successful:", result);
      return result;
    } catch (error) {
      console.error('❌ Development sign in error:', error);
      throw new Error(`Development authentication failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  try {
    console.log("🔑 Starting Firebase Google Sign In...");
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log("👤 Firebase user authenticated:", { 
      uid: user.uid, 
      email: user.email,
      emailVerified: user.emailVerified,
      providerData: user.providerData.map(p => ({
        providerId: p?.providerId,
        email: p?.email,
        displayName: p?.displayName
      }))
    });
    
    // Get the ID token
    console.log("🔄 Getting ID token...");
    const idToken = await user.getIdToken();
    console.log("✅ ID token obtained, length:", idToken.length);
    
    // Ensure we have a CSRF token first (GET request sets it via response header)
    await apiRequest('/api/health', 'GET');

    // Send token to backend for verification using apiRequest which injects CSRF token
    console.log("📡 Sending token to backend for verification...");
    const response = await apiRequest('/api/auth/verify', 'POST', {
      idToken,
      // backend can also read from Authorization header if needed
    });

    console.log("📡 Backend verification response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Backend verification failed:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(errorData.message || 'Authentication failed during backend verification');
    }

    const resultData = await response.json();
    console.log("✅ Backend verification successful:", resultData);
    return resultData;
    
  } catch (error) {
    console.error('❌ Google Sign In error:', error);
    
    // Provide more detailed error messages
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      
      if (errorMessage.includes('popup-closed-by-user')) {
        throw new Error('Sign in was cancelled. Please try again.');
      } else if (errorMessage.includes('network-request-failed')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      } else if (errorMessage.includes('account-exists-with-different-credential')) {
        throw new Error('An account already exists with the same email but different sign-in credentials.');
      } else if (errorMessage.includes('auth/popup-blocked')) {
        throw new Error('The sign-in popup was blocked. Please allow popups for this site and try again.');
      } else if (errorMessage.includes('auth/unauthorized-domain')) {
        throw new Error('This domain is not authorized for authentication. Please contact support.');
      }
    }
    
    throw new Error(`Sign in failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    if (firebaseAvailable && auth) {
      await signOut(auth);
    }
    // Call backend logout
    await fetch('/api/logout', { method: 'GET' });
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

// Auth state observer
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  if (!firebaseAvailable || !auth) {
    // Return a dummy unsubscribe function for development
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => {
  if (!firebaseAvailable || !auth) {
    return null;
  }
  return auth.currentUser;
};

// Get ID token
export const getIdToken = async () => {
  if (!firebaseAvailable || !auth) {
    return null;
  }
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
}; 