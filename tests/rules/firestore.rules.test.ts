import { readFileSync } from 'node:fs';
import {
  assertFails, assertSucceeds, initializeTestEnvironment, type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  addDoc, collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc, Timestamp, updateDoc,
} from 'firebase/firestore';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';

let env: RulesTestEnvironment;

const user = (email: string, verified = true) =>
  env.authenticatedContext(email.replace(/\W/g, '_'), { email, email_verified: verified }).firestore();
const visitor = () => env.unauthenticatedContext().firestore();

const OWNER = 'owner@057cafe.co.za';
const MANAGER = 'manager@057cafe.co.za';
const HOST = 'host@057cafe.co.za';
const INACTIVE = 'former@057cafe.co.za';
const STRANGER = 'someone@example.com';

const content = (email: string, version: number, data: object = { title: 'T' }) => ({
  data, version, updatedAt: serverTimestamp(), updatedBy: email,
});

const booking = (overrides: Record<string, unknown> = {}) => ({
  type: 'private_event', name: 'Thabo Mokoena', phone: '072 223 0708', date: '2026-12-01', time: '18:30',
  guests: '4 People', details: 'Birthday', event: '', status: 'new', createdAt: serverTimestamp(),
  expireAt: Timestamp.fromMillis(Date.now() + 365 * 86_400_000), ...overrides,
});

const staff = (email: string, role = 'host', active = true) => ({
  name: 'Staff', role, active, updatedAt: serverTimestamp(), updatedBy: email,
});

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-057cafe',
    firestore: { rules: readFileSync('firestore.rules', 'utf8') },
  });
});

afterAll(() => env.cleanup());

beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, 'staff', OWNER), { name: 'Owner', role: 'owner', active: true });
    await setDoc(doc(db, 'staff', MANAGER), { name: 'Manager', role: 'manager', active: true });
    await setDoc(doc(db, 'staff', HOST), { name: 'Host', role: 'host', active: true });
    await setDoc(doc(db, 'staff', INACTIVE), { name: 'Former', role: 'owner', active: false });
    await setDoc(doc(db, 'content', 'menu'), { data: { title: 'MENU' }, version: 3, updatedAt: new Date(), updatedBy: OWNER });
    await setDoc(doc(db, 'bookings', 'b1'), { ...booking(), createdAt: new Date() });
  });
});

describe('content', () => {
  it('anyone can read it', async () => {
    await assertSucceeds(getDoc(doc(visitor(), 'content', 'menu')));
    await assertSucceeds(getDocs(collection(visitor(), 'content')));
  });

  it('visitors and non-staff cannot write it', async () => {
    await assertFails(setDoc(doc(visitor(), 'content', 'menu'), content('x@y.z', 4)));
    await assertFails(setDoc(doc(user(STRANGER), 'content', 'menu'), content(STRANGER, 4)));
    await assertFails(setDoc(doc(user(HOST), 'content', 'menu'), content(HOST, 4)));
    await assertFails(setDoc(doc(user(INACTIVE), 'content', 'menu'), content(INACTIVE, 4)));
  });

  it('staff with an unverified email cannot write it', async () => {
    await assertFails(setDoc(doc(user(OWNER, false), 'content', 'menu'), content(OWNER, 4)));
  });

  it('owners and managers can save the next version', async () => {
    await assertSucceeds(setDoc(doc(user(OWNER), 'content', 'menu'), content(OWNER, 4)));
    await assertSucceeds(setDoc(doc(user(MANAGER), 'content', 'menu'), content(MANAGER, 5)));
    await assertSucceeds(setDoc(doc(user(MANAGER), 'content', 'events'), content(MANAGER, 1)));
  });

  it('a stale save is refused', async () => {
    await assertFails(setDoc(doc(user(OWNER), 'content', 'menu'), content(OWNER, 3)));
    await assertFails(setDoc(doc(user(OWNER), 'content', 'menu'), content(OWNER, 9)));
  });

  it('rejects unknown sections, extra fields and a forged author', async () => {
    await assertFails(setDoc(doc(user(OWNER), 'content', 'other'), content(OWNER, 1)));
    await assertFails(setDoc(doc(user(OWNER), 'content', 'menu'), { ...content(OWNER, 4), extra: 1 }));
    await assertFails(setDoc(doc(user(OWNER), 'content', 'menu'), content(MANAGER, 4)));
    await assertFails(setDoc(doc(user(OWNER), 'content', 'menu'), { ...content(OWNER, 4), data: 'text' }));
  });

  it('nobody can delete a section', async () => {
    await assertFails(deleteDoc(doc(user(OWNER), 'content', 'menu')));
  });
});

describe('bookings', () => {
  it('a visitor can send a valid request', async () => {
    await assertSucceeds(addDoc(collection(visitor(), 'bookings'), booking()));
    await assertSucceeds(addDoc(collection(visitor(), 'bookings'), booking({ type: 'weekend_table', details: '', event: 'Mimosa Weekend' })));
  });

  it.each([
    ['a missing name', { name: '' }],
    ['an over-long name', { name: 'x'.repeat(81) }],
    ['a bad phone number', { phone: '<script>' }],
    ['a bad date', { date: 'tomorrow' }],
    ['a bad time', { time: '6pm' }],
    ['an unknown type', { type: 'vip' }],
    ['over-long details', { details: 'x'.repeat(1001) }],
    ['a pre-confirmed status', { status: 'confirmed' }],
    ['a made-up timestamp', { createdAt: Timestamp.fromMillis(0) }],
    ['a far-future expiry', { expireAt: Timestamp.fromMillis(Date.now() + 5000 * 86_400_000) }],
    ['an extra field', { admin: true }],
  ])('refuses %s', async (_label, overrides) => {
    await assertFails(addDoc(collection(visitor(), 'bookings'), booking(overrides)));
  });

  it('visitors and non-staff cannot read, change or delete requests', async () => {
    await assertFails(getDoc(doc(visitor(), 'bookings', 'b1')));
    await assertFails(getDocs(collection(visitor(), 'bookings')));
    await assertFails(getDocs(collection(user(STRANGER), 'bookings')));
    await assertFails(updateDoc(doc(visitor(), 'bookings', 'b1'), { status: 'confirmed' }));
    await assertFails(deleteDoc(doc(user(STRANGER), 'bookings', 'b1')));
    await assertFails(getDocs(collection(user(INACTIVE), 'bookings')));
  });

  it('every staff role can read requests and mark them handled', async () => {
    await assertSucceeds(getDocs(collection(user(HOST), 'bookings')));
    await assertSucceeds(updateDoc(doc(user(HOST), 'bookings', 'b1'), { status: 'confirmed', handledBy: HOST, handledAt: serverTimestamp() }));
    await assertSucceeds(updateDoc(doc(user(MANAGER), 'bookings', 'b1'), { status: 'done', handledBy: MANAGER, handledAt: serverTimestamp() }));
  });

  it('staff cannot rewrite what the customer sent', async () => {
    await assertFails(updateDoc(doc(user(HOST), 'bookings', 'b1'), { name: 'Changed', handledBy: HOST, handledAt: serverTimestamp() }));
    await assertFails(updateDoc(doc(user(HOST), 'bookings', 'b1'), { status: 'paid', handledBy: HOST, handledAt: serverTimestamp() }));
    await assertFails(updateDoc(doc(user(HOST), 'bookings', 'b1'), { status: 'done', handledBy: OWNER, handledAt: serverTimestamp() }));
  });

  it('hosts cannot delete, managers and owners can', async () => {
    await assertFails(deleteDoc(doc(user(HOST), 'bookings', 'b1')));
    await assertSucceeds(deleteDoc(doc(user(MANAGER), 'bookings', 'b1')));
  });
});

describe('staff', () => {
  it('a signed-in person can read only their own record', async () => {
    await assertSucceeds(getDoc(doc(user(HOST), 'staff', HOST)));
    await assertSucceeds(getDoc(doc(user(STRANGER), 'staff', STRANGER)));
    await assertFails(getDoc(doc(user(HOST), 'staff', OWNER)));
    await assertFails(getDocs(collection(user(MANAGER), 'staff')));
    await assertFails(getDoc(doc(visitor(), 'staff', OWNER)));
  });

  it('only owners can list and manage staff', async () => {
    await assertSucceeds(getDocs(collection(user(OWNER), 'staff')));
    await assertSucceeds(setDoc(doc(user(OWNER), 'staff', 'new@057cafe.co.za'), staff(OWNER)));
    await assertSucceeds(setDoc(doc(user(OWNER), 'staff', HOST), staff(OWNER, 'manager')));
    await assertSucceeds(deleteDoc(doc(user(OWNER), 'staff', MANAGER)));
    await assertFails(setDoc(doc(user(MANAGER), 'staff', 'new2@057cafe.co.za'), staff(MANAGER)));
  });

  it('nobody can grant themselves access', async () => {
    await assertFails(setDoc(doc(user(STRANGER), 'staff', STRANGER), staff(STRANGER, 'owner')));
    await assertFails(setDoc(doc(user(HOST), 'staff', HOST), staff(HOST, 'owner')));
    await assertFails(setDoc(doc(user(INACTIVE), 'staff', INACTIVE), staff(INACTIVE, 'owner')));
  });

  it('owners cannot change or remove their own record', async () => {
    await assertFails(setDoc(doc(user(OWNER), 'staff', OWNER), staff(OWNER, 'host')));
    await assertFails(deleteDoc(doc(user(OWNER), 'staff', OWNER)));
  });

  it('rejects invalid roles, ids and extra fields', async () => {
    await assertFails(setDoc(doc(user(OWNER), 'staff', 'x@057cafe.co.za'), staff(OWNER, 'superuser')));
    await assertFails(setDoc(doc(user(OWNER), 'staff', 'Mixed@Case.com'), staff(OWNER)));
    await assertFails(setDoc(doc(user(OWNER), 'staff', 'not-an-email'), staff(OWNER)));
    await assertFails(setDoc(doc(user(OWNER), 'staff', 'y@057cafe.co.za'), { ...staff(OWNER), extra: true }));
  });

  it('matches staff by email regardless of letter case', async () => {
    await assertSucceeds(getDocs(collection(user('Owner@057Cafe.co.za'), 'staff')));
  });
});

describe('everything else', () => {
  it('is closed', async () => {
    await assertFails(getDoc(doc(user(OWNER), 'secrets', 'x')));
    await assertFails(setDoc(doc(user(OWNER), 'secrets', 'x'), { a: 1 }));
  });
});
