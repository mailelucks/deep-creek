// lib/actions.ts
'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getApps, cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
  }
}

export async function loginAction(formData: FormData) {
  const idToken = formData.get('idToken') as string;
  
  if (!idToken) {
    return { error: 'Missing ID token' };
  }
  
  try {
    // Create a session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await getAuth().createSessionCookie(idToken, { expiresIn });
    
    // Get user details
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    
    try {
      // Try to get user from Firestore
      const userDoc = await getFirestore().collection('users').doc(uid).get();
      
      // If user doc doesn't exist in Firestore, create it
      if (!userDoc.exists) {
        await getFirestore().collection('users').doc(uid).set({
          email: decodedToken.email,
          role: 'user',
          createdAt: new Date().toISOString()
        });
      }
    } catch (firestoreError) {
      console.error('Firestore error:', firestoreError);
      // Continue with login even if there's a Firestore error
    }
    
    // Set the session cookie
    (await
          // Set the session cookie
          cookies()).set('session', sessionCookie, {
      maxAge: expiresIn / 1000, // maxAge is in seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });
    
    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Authentication failed' };
  }
}

export async function signupAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const role = formData.get('role') as string || 'user';
  
  if (!email || !password) {
    return { error: 'Missing email or password' };
  }
  
  // Validate role to prevent privilege escalation
  const validRoles = ['user', 'editor'];
  const safeRole = validRoles.includes(role) ? role : 'user';
  
  try {
    // Create user in Firebase Auth
    const userRecord = await getAuth().createUser({
      email,
      password,
      emailVerified: false,
    });
    
    // Store user data in Firestore
    await getFirestore().collection('users').doc(userRecord.uid).set({
      email,
      role: safeRole,
      createdAt: new Date().toISOString()
    });
    
    return { success: true, userId: userRecord.uid };
  } catch (error: any) {
    console.error('Signup error details:', error);
    
    if (error.code === 'auth/email-already-exists') {
      return { error: 'Email already in use' };
    }
    
    return { error: error.message || 'Failed to create account' };
  }
}

export async function logoutAction() {
  try {
    // Get the session cookie
    const sessionCookie = (await cookies()).get('session')?.value;
    
    if (sessionCookie) {
      // Verify and revoke the Firebase session
      const decodedClaims = await getAuth().verifySessionCookie(sessionCookie);
      await getAuth().revokeRefreshTokens(decodedClaims.sub);
    }
  } catch (error) {
    console.error('Error during logout:', error);
  }
  
  // Clear the session cookie
  (await cookies()).delete('session');
  
  // Redirect to login page
  redirect('/auth/login');
}