import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/lib/stores/auth-store';

import { api, ApiError } from './client';

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'super_admin' | 'admin' | 'manager' | 'support_agent';
  avatar?: string;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

interface LoginResponse {
  user: AuthUser;
  tokens: Tokens;
}

const ADMIN_ROLES = ['super_admin', 'admin', 'manager', 'support_agent'] as const;

/**
 * Exchanges a Firebase ID token for a platform JWT via the backend,
 * enforces that the account holds an admin-level role, and persists the session.
 */
async function exchangeFirebaseToken(firebaseToken: string): Promise<AuthUser> {
  const { user, tokens } = await api.post<LoginResponse>('/auth/login', { firebaseToken });

  if (!ADMIN_ROLES.includes(user.role)) {
    await signOut(auth).catch(() => undefined);
    throw new ApiError(403, 'FORBIDDEN', 'This account does not have admin access.');
  }

  useAuthStore.getState().setAuth(user, tokens);
  return user;
}

export async function loginWithEmail(email: string, password: string): Promise<AuthUser> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const firebaseToken = await credential.user.getIdToken();
  return exchangeFirebaseToken(firebaseToken);
}

export async function loginWithGoogle(): Promise<AuthUser> {
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(auth, provider);
  const firebaseToken = await credential.user.getIdToken();
  return exchangeFirebaseToken(firebaseToken);
}

/**
 * Development-only sign-in that skips Firebase. Requires the API to run with
 * NODE_ENV=development; the endpoint does not exist otherwise.
 */
export async function devLogin(email: string): Promise<AuthUser> {
  const { user, tokens } = await api.post<LoginResponse>('/auth/dev-login', { email });

  if (!ADMIN_ROLES.includes(user.role)) {
    throw new ApiError(403, 'FORBIDDEN', 'This account does not have admin access.');
  }

  useAuthStore.getState().setAuth(user, tokens);
  return user;
}

export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } catch {
    // Best-effort server-side revocation; always clear local state below.
  }
  await signOut(auth).catch(() => undefined);
  useAuthStore.getState().logout();
}
