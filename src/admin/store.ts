import {
  connectAuthEmulator, createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, onAuthStateChanged,
  sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut,
  type Auth, type User,
} from 'firebase/auth';
import {
  collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, startAfter,
  updateDoc, type QueryDocumentSnapshot,
} from 'firebase/firestore/lite';
import type { BookingInput, BookingStatus } from '../bookings/validate';
import type { SectionKey } from '../content/types';
import { getDb, getFirebaseApp, useEmulators } from '../firebase/app';
import { BOOKINGS_COLLECTION } from '../firebase/bookings';
import { CONTENT_COLLECTION } from '../firebase/contentStore';
import { isRole, type StaffMember } from './roles';

let auth: Auth | null = null;

export function getAuthInstance(): Auth {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase is not configured.');
  if (!auth) {
    auth = getAuth(app);
    if (useEmulators) connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  }
  return auth;
}

const db = () => {
  const instance = getDb();
  if (!instance) throw new Error('Firebase is not configured.');
  return instance;
};

const myEmail = () => (getAuthInstance().currentUser?.email ?? '').toLowerCase();

/* Sign-in */
export const watchUser = (callback: (user: User | null) => void) => onAuthStateChanged(getAuthInstance(), callback);
export const signInEmail = (email: string, password: string) => signInWithEmailAndPassword(getAuthInstance(), email, password);
export const signInGoogle = () => signInWithPopup(getAuthInstance(), new GoogleAuthProvider());
export const resetPassword = (email: string) => sendPasswordResetEmail(getAuthInstance(), email);
export const signOutUser = () => signOut(getAuthInstance());
export const sendVerification = (user: User) => sendEmailVerification(user);

export async function createAccount(email: string, password: string) {
  const credential = await createUserWithEmailAndPassword(getAuthInstance(), email, password);
  await sendEmailVerification(credential.user);
}

/** Re-reads the account after the person clicked the link in their email. */
export async function refreshUser(user: User): Promise<boolean> {
  await user.reload();
  await user.getIdToken(true);
  return user.emailVerified;
}

/** A person's staff record, or null if they are not staff. */
export async function fetchStaffRecord(email: string): Promise<StaffMember | null> {
  const snapshot = await getDoc(doc(db(), 'staff', email.toLowerCase()));
  const data = snapshot.data();
  if (!data || data.active !== true || !isRole(data.role)) return null;
  return { email: snapshot.id, name: String(data.name ?? ''), role: data.role, active: true };
}

/* Content */
export interface StoredSection { data: unknown; version: number; updatedBy?: string; updatedAt?: Date }

export async function fetchSection(key: SectionKey): Promise<StoredSection | null> {
  const snapshot = await getDoc(doc(db(), CONTENT_COLLECTION, key));
  const stored = snapshot.data();
  if (!stored) return null;
  return {
    data: stored.data,
    version: typeof stored.version === 'number' ? stored.version : 0,
    updatedBy: stored.updatedBy,
    updatedAt: stored.updatedAt?.toDate?.(),
  };
}

/** Saves a section as the next version. The rules refuse the save if someone else saved first. */
export async function saveSection(key: SectionKey, data: unknown, previousVersion: number): Promise<number> {
  const version = previousVersion + 1;
  await setDoc(doc(db(), CONTENT_COLLECTION, key), { data, version, updatedAt: serverTimestamp(), updatedBy: myEmail() });
  return version;
}

/* Bookings */
export interface Booking extends BookingInput {
  id: string;
  status: BookingStatus;
  createdAt: Date | null;
  handledBy?: string;
}

export interface BookingPage { bookings: Booking[]; cursor: QueryDocumentSnapshot | null }

const PAGE_SIZE = 25;

export async function fetchBookings(after: QueryDocumentSnapshot | null): Promise<BookingPage> {
  const base = [orderBy('createdAt', 'desc'), limit(PAGE_SIZE)];
  const snapshot = await getDocs(query(collection(db(), BOOKINGS_COLLECTION), ...(after ? [...base, startAfter(after)] : base)));
  const bookings = snapshot.docs.map((item) => {
    const data = item.data();
    return { ...(data as BookingInput), id: item.id, status: data.status, createdAt: data.createdAt?.toDate?.() ?? null, handledBy: data.handledBy } as Booking;
  });
  return { bookings, cursor: snapshot.docs.length === PAGE_SIZE ? snapshot.docs[snapshot.docs.length - 1] : null };
}

export const setBookingStatus = (id: string, status: BookingStatus) =>
  updateDoc(doc(db(), BOOKINGS_COLLECTION, id), { status, handledBy: myEmail(), handledAt: serverTimestamp() });

export const deleteBooking = (id: string) => deleteDoc(doc(db(), BOOKINGS_COLLECTION, id));

/* Staff */
export async function fetchStaff(): Promise<StaffMember[]> {
  const snapshot = await getDocs(collection(db(), 'staff'));
  return snapshot.docs
    .map((item) => {
      const data = item.data();
      return { email: item.id, name: String(data.name ?? ''), role: isRole(data.role) ? data.role : 'host', active: data.active === true } as StaffMember;
    })
    .sort((a, b) => a.email.localeCompare(b.email));
}

export const saveStaff = (member: StaffMember) =>
  setDoc(doc(db(), 'staff', member.email), {
    name: member.name, role: member.role, active: member.active, updatedAt: serverTimestamp(), updatedBy: myEmail(),
  });

export const removeStaff = (email: string) => deleteDoc(doc(db(), 'staff', email));

export function errorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code ?? '';
  if (code.includes('permission-denied')) return 'You do not have permission to do that.';
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) return 'That email and password do not match.';
  if (code.includes('email-already-in-use')) return 'An account with that email already exists. Sign in instead.';
  if (code.includes('weak-password')) return 'Choose a password with at least 8 characters.';
  if (code.includes('invalid-email')) return 'Enter a valid email address.';
  if (code.includes('too-many-requests')) return 'Too many attempts. Wait a few minutes and try again.';
  if (code.includes('popup-closed') || code.includes('cancelled-popup')) return 'Sign-in was cancelled.';
  if (code.includes('network') || code.includes('unavailable')) return 'Could not reach the server. Check your connection and try again.';
  return 'Something went wrong. Please try again.';
}
