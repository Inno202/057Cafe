import { useCallback, useEffect, useRef, useState } from 'react';
import type { User } from 'firebase/auth';
import { ArrowLeft, LogOut } from 'lucide-react';
import { SCHEMA } from '../content/schema';
import { SECTION_KEYS, type SectionKey } from '../content/types';
import { isFirebaseConfigured } from '../firebase/app';
import { pathFor, type Route } from '../router';
import { Logo } from '../views/components/Logo';
import { BookingsPanel } from './BookingsPanel';
import { can, ROLE_LABELS, type StaffMember } from './roles';
import { SectionEditor } from './SectionEditor';
import { SignIn } from './SignIn';
import { StaffPanel } from './StaffPanel';
import { errorMessage, fetchStaffRecord, refreshUser, sendVerification, signOutUser, watchUser } from './store';

type Tab = SectionKey | 'bookings' | 'staff';
const CONTENT_TABS: SectionKey[] = ['menu', 'events', 'gallery', 'home', 'site', 'booking'];

export default function AdminApp({ navigate }: { navigate: (route: Route) => void }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [verified, setVerified] = useState(false);
  const [staff, setStaff] = useState<StaffMember | null | undefined>(undefined);
  const [tab, setTab] = useState<Tab>('bookings');
  const [notice, setNotice] = useState('');
  const dirty = useRef(false);
  const onDirtyChange = useCallback((value: boolean) => { dirty.current = value; }, []);

  useEffect(() => {
    document.title = 'Admin | 057 Cafè';
    if (!isFirebaseConfigured) return;
    return watchUser((next) => {
      setUser(next);
      setVerified(!!next?.emailVerified);
      setStaff(undefined);
    });
  }, []);

  // The staff record decides the role. The rules check the same record on every request.
  useEffect(() => {
    if (!user?.email || !verified) return;
    let active = true;
    fetchStaffRecord(user.email)
      .then((record) => {
        if (!active) return;
        setStaff(record);
        if (record) setTab(can(record.role, 'content') ? 'menu' : 'bookings');
      })
      .catch(() => active && setStaff(null));
    return () => { active = false; };
  }, [user, verified]);

  const leave = (event: React.MouseEvent) => {
    event.preventDefault();
    if (dirty.current && !window.confirm('You have unsaved changes. Leave without saving?')) return;
    navigate('home');
  };

  const choose = (next: Tab) => {
    if (next === tab) return;
    if (dirty.current && !window.confirm('You have unsaved changes in this section. Switch without saving?')) return;
    dirty.current = false;
    setTab(next);
  };

  const frame = (body: React.ReactNode, wide = false) => (
    <div data-theme="day" className="min-h-svh bg-page text-ink">
      <header className="border-b border-line bg-surface">
        <div className="wrap flex min-h-16 flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2">
          <a href={pathFor('home')} onClick={leave} className="flex min-h-11 items-center gap-3">
            <Logo className="size-10" />
            <span className="font-black tracking-tight uppercase">057 Cafè <span className="font-medium text-muted normal-case">Admin</span></span>
          </a>
          <div className="flex flex-wrap items-center gap-x-3">
            {staff && user && (
              <p className="text-sm text-muted"><span className="break-all">{user.email}</span> · {ROLE_LABELS[staff.role]}</p>
            )}
            <a href={pathFor('home')} onClick={leave} className="link-tap text-sm font-medium hover:text-accent">
              <ArrowLeft size={16} aria-hidden="true" /> View site
            </a>
            {user && (
              <button type="button" onClick={() => void signOutUser()} className="link-tap cursor-pointer text-sm font-medium hover:text-accent">
                <LogOut size={16} aria-hidden="true" /> Sign out
              </button>
            )}
          </div>
        </div>
      </header>
      <main className={`wrap py-10 ${wide ? '' : 'max-w-2xl'}`}>{body}</main>
    </div>
  );

  if (!isFirebaseConfigured) {
    return frame(
      <>
        <h1 className="text-2xl font-black tracking-tight">Admin is not set up yet</h1>
        <p className="mt-3 text-muted">
          This build has no Firebase project connected, so there is nothing to sign in to. The public website is showing
          its built-in content. See SETUP.md in the project for the steps.
        </p>
      </>,
    );
  }

  if (user === undefined) return frame(<p className="text-muted" role="status">Loading…</p>);
  if (user === null) return frame(<SignIn />);

  if (!verified) {
    return frame(
      <>
        <h1 className="text-2xl font-black tracking-tight">Confirm your email address</h1>
        <p className="mt-3 text-muted">
          We sent a link to <strong className="font-semibold break-all text-ink">{user.email}</strong>. Open it, then come back and continue.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => void refreshUser(user).then((ok) => { setVerified(ok); if (!ok) setNotice('Not confirmed yet. Open the link in the email first.'); }).catch((error) => setNotice(errorMessage(error)))}
          >
            I have confirmed it
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => void sendVerification(user).then(() => setNotice('Sent. Check your inbox and spam folder.')).catch((error) => setNotice(errorMessage(error)))}
          >
            Send the link again
          </button>
        </div>
        <p role="status" aria-live="polite" className="mt-4 text-sm text-muted">{notice}</p>
      </>,
    );
  }

  if (staff === undefined) return frame(<p className="text-muted" role="status">Checking your access…</p>);

  if (staff === null) {
    return frame(
      <>
        <h1 className="text-2xl font-black tracking-tight">No access for this account</h1>
        <p className="mt-3 text-muted">
          <strong className="font-semibold break-all text-ink">{user.email}</strong> is not on the staff list. Ask an owner to add this
          email address under Staff access, then sign in again.
        </p>
        <button type="button" className="btn btn-secondary mt-6" onClick={() => void signOutUser()}>Sign out</button>
      </>,
    );
  }

  const tabs: { id: Tab; label: string; group: string }[] = [
    ...(can(staff.role, 'bookings') ? [{ id: 'bookings' as Tab, label: 'Booking requests', group: 'Customers' }] : []),
    ...(can(staff.role, 'content') ? CONTENT_TABS.map((id) => ({ id: id as Tab, label: SCHEMA[id].label, group: 'Website content' })) : []),
    ...(can(staff.role, 'staff') ? [{ id: 'staff' as Tab, label: 'Staff access', group: 'Settings' }] : []),
  ];
  const groups = [...new Set(tabs.map((item) => item.group))];
  const current = tabs.some((item) => item.id === tab) ? tab : tabs[0].id;

  return frame(
    <div className="grid gap-8 md:grid-cols-[13rem_1fr] md:gap-12">
      <nav aria-label="Admin sections">
        <div className="md:hidden">
          <label htmlFor="admin-tab" className="field-label">Section</label>
          <select id="admin-tab" className="field" value={current} onChange={(event) => choose(event.target.value as Tab)}>
            {groups.map((group) => (
              <optgroup key={group} label={group}>
                {tabs.filter((item) => item.group === group).map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="hidden space-y-6 md:block">
          {groups.map((group) => (
            <div key={group}>
              <p className="px-3 text-sm font-medium text-muted">{group}</p>
              <ul className="mt-1">
                {tabs.filter((item) => item.group === group).map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => choose(item.id)}
                      aria-current={current === item.id ? 'page' : undefined}
                      className={`flex min-h-11 w-full cursor-pointer items-center rounded-lg px-3 text-left font-medium ${
                        current === item.id ? 'bg-ink text-page' : 'hover:bg-line/60'
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <div className="min-w-0">
        {current === 'bookings' ? <BookingsPanel role={staff.role} />
          : current === 'staff' ? <StaffPanel me={staff.email} />
          : (SECTION_KEYS as readonly string[]).includes(current) ? <SectionEditor key={current} section={current as SectionKey} onDirtyChange={onDirtyChange} />
          : null}
      </div>
    </div>,
    true,
  );
}
