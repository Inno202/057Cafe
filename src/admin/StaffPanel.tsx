import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { ROLE_LABELS, ROLE_SUMMARY, ROLES, validateStaff, type Role, type StaffMember } from './roles';
import { errorMessage, fetchStaff, removeStaff, saveStaff } from './store';

export function StaffPanel({ me }: { me: string }) {
  const [staff, setStaff] = useState<StaffMember[] | null>(null);
  const [form, setForm] = useState({ email: '', name: '', role: 'host' as string });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      setStaff(await fetchStaff());
    } catch (error) {
      setMessage(errorMessage(error));
    }
  };
  useEffect(() => { void load(); }, []);

  const run = async (action: () => Promise<unknown>, done: string) => {
    setBusy(true);
    try {
      await action();
      await load();
      setMessage(done);
    } catch (error) {
      setMessage(errorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const add = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = validateStaff(form);
    if (staff?.some((member) => member.email === result.value.email)) result.errors.email = 'That person is already on the list.';
    setErrors(result.errors);
    if (Object.keys(result.errors).length) return;
    await run(() => saveStaff(result.value), `${result.value.email} added. They can now sign in with that email address.`);
    setForm({ email: '', name: '', role: 'host' });
  };

  return (
    <div>
      <h2 className="text-2xl font-black tracking-tight">Staff access</h2>
      <p className="mt-1 text-muted">People who may sign in here, and what each may do. Access is matched on the email address they sign in with.</p>

      <dl className="mt-6 grid gap-x-8 gap-y-2 sm:grid-cols-[auto_1fr]">
        {ROLES.map((role) => (
          <div key={role} className="contents">
            <dt className="font-semibold">{ROLE_LABELS[role]}</dt>
            <dd className="text-muted">{ROLE_SUMMARY[role]}</dd>
          </div>
        ))}
      </dl>

      <p role="status" aria-live="polite" className="mt-6 min-h-5 text-sm text-muted">{message}</p>

      {staff === null ? <p className="text-muted">Loading…</p> : (
        <ul className="divide-y divide-line border-y border-line">
          {staff.map((member) => {
            const self = member.email === me;
            return (
              <li key={member.email} className="grid items-center gap-x-4 gap-y-2 py-4 md:grid-cols-[1fr_10rem_auto_auto]">
                <div className="min-w-0">
                  <p className="font-semibold break-words">{member.name}{self && <span className="font-normal text-muted"> (you)</span>}</p>
                  <p className="break-all text-muted">{member.email}</p>
                </div>
                <div>
                  <label htmlFor={`role-${member.email}`} className="sr-only">Role for {member.name}</label>
                  <select
                    id={`role-${member.email}`}
                    className="field"
                    value={member.role}
                    disabled={self || busy}
                    onChange={(event) => void run(() => saveStaff({ ...member, role: event.target.value as Role }), `${member.name} is now ${ROLE_LABELS[event.target.value as Role].toLowerCase()}.`)}
                  >
                    {ROLES.map((role) => <option key={role} value={role}>{ROLE_LABELS[role]}</option>)}
                  </select>
                </div>
                <label className={`flex min-h-11 items-center gap-2 ${self ? 'opacity-60' : 'cursor-pointer'}`}>
                  <input
                    type="checkbox"
                    className="size-5 accent-amber-700"
                    checked={member.active}
                    disabled={self || busy}
                    onChange={(event) => void run(() => saveStaff({ ...member, active: event.target.checked }), `${member.name} ${event.target.checked ? 'can sign in again' : 'can no longer sign in'}.`)}
                  />
                  Active
                </label>
                {self ? <span className="hidden md:block md:size-11" /> : (
                  <button
                    type="button"
                    className="icon-btn text-danger"
                    disabled={busy}
                    aria-label={`Remove ${member.name}`}
                    onClick={() => { if (window.confirm(`Remove ${member.name} (${member.email})? They will lose access immediately.`)) void run(() => removeStaff(member.email), `${member.name} removed.`); }}
                  >
                    <Trash2 size={20} aria-hidden="true" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
      <p className="mt-3 text-sm text-muted">You cannot change or remove your own access, so the site can never be left without an owner. Ask another owner to do it.</p>

      <form onSubmit={add} noValidate className="mt-10 max-w-xl space-y-5 border-t border-line pt-8">
        <h3 className="text-lg font-bold">Add a staff member</h3>
        <div>
          <label htmlFor="staff-email" className="field-label">Email address</label>
          <input id="staff-email" type="email" autoComplete="off" className="field" aria-invalid={errors.email ? true : undefined} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="staff-name" className="field-label">Name</label>
          <input id="staff-name" type="text" autoComplete="off" maxLength={80} className="field" aria-invalid={errors.name ? true : undefined} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="staff-role" className="field-label">Role</label>
          <select id="staff-role" className="field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            {ROLES.map((role) => <option key={role} value={role}>{ROLE_LABELS[role]}</option>)}
          </select>
        </div>
        <button type="submit" className="btn btn-primary" disabled={busy}>Add staff member</button>
      </form>
    </div>
  );
}
