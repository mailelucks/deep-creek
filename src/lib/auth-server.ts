import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getApps, cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// User type definitions
export type UserRole = 'admin' | 'editor' | 'user';

export interface ServerSideUser {
  uid: string;
  email: string | undefined;
  role: UserRole;
}

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function getServerSession(): Promise<ServerSideUser | null> {
  const session = (await cookies()).get('session')?.value || '';
  
  if (!session) {
    return null;
  }
  
  try {
    // Verify the session cookie
    const decodedClaims = await getAuth().verifySessionCookie(session, true);
    
    // Get user data from Firestore
    const userDoc = await getFirestore()
      .collection('users')
      .doc(decodedClaims.uid)
      .get();
    
    if (!userDoc.exists) {
      return { 
        uid: decodedClaims.uid, 
        email: decodedClaims.email, 
        role: 'user' 
      };
    }
    
    const userData = userDoc.data();
    
    return { 
      uid: decodedClaims.uid,
      email: decodedClaims.email,
      role: (userData?.role || 'user') as UserRole,
    };
  } catch (error) {
    // If there's an error or the cookie is invalid, clear it
    (await
      // If there's an error or the cookie is invalid, clear it
      cookies()).delete('session');
    return null;
  }
}

// Check if a user has a required role
export async function checkUserRole(requiredRole: UserRole): Promise<ServerSideUser> {
  const user = await getServerSession();
  
  if (!user) {
    redirect('/auth/login');
  }
  
  const role = user.role || 'user';
  
  // Role hierarchy check
  if (requiredRole === 'admin' && role !== 'admin') {
    redirect('/unauthorized');
  }
  
  if (requiredRole === 'editor' && !['editor', 'admin'].includes(role)) {
    redirect('/unauthorized');
  }
  
  return user;
}