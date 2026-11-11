import { useEffect, useState } from 'react';
import { DEFAULT_CONTENT } from '../content/defaults';
import { SCHEMA } from '../content/schema';
import type { SectionKey } from '../content/types';
import { normalizeSection, validateSection, type Errors } from '../content/validate';
import { Fields } from './Fields';
import { errorMessage, fetchSection, saveSection } from './store';

type Obj = Record<string, unknown>;
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

interface Props { section: SectionKey; onDirtyChange: (dirty: boolean) => void }

export function SectionEditor({ section, onDirtyChange }: Props) {
  const schema = SCHEMA[section];
  const [draft, setDraft] = useState<Obj | null>(null);
  const [saved, setSaved] = useState<Obj | null>(null);
  const [version, setVersion] = useState(0);
  const [meta, setMeta] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<{ kind: 'idle' | 'saving' | 'saved' | 'error'; text?: string }>({ kind: 'idle' });

  const load = async () => {
    setDraft(null);
    setErrors({});
    try {
      const stored = await fetchSection(section);
      const data = (stored ? normalizeSection(section, stored.data) : DEFAULT_CONTENT[section]) as unknown as Obj;
      setDraft(data);
      setSaved(data);
      setVersion(stored?.version ?? 0);
      setMeta(
        stored
          ? `Last saved${stored.updatedAt ? ` ${stored.updatedAt.toLocaleString()}` : ''}${stored.updatedBy ? ` by ${stored.updatedBy}` : ''}.`
          : 'Showing the built-in content. Nothing has been saved for this section yet.',
      );
      setStatus({ kind: 'idle' });
    } catch (error) {
      setStatus({ kind: 'error', text: errorMessage(error) });
    }
  };

  useEffect(() => { void load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [section]);

  const dirty = !!draft && !same(draft, saved);
  useEffect(() => { onDirtyChange(dirty); }, [dirty, onDirtyChange]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft || status.kind === 'saving') return;
    const result = validateSection(section, draft);
    setErrors(result.errors);
    const count = Object.keys(result.errors).length;
    if (count) {
      setStatus({ kind: 'error', text: `${count} ${count === 1 ? 'field needs' : 'fields need'} attention before this can be saved.` });
      return;
    }
    setStatus({ kind: 'saving' });
    try {
      const next = await saveSection(section, result.value, version);
      const value = result.value as unknown as Obj;
      setVersion(next);
      setDraft(value);
      setSaved(value);
      setMeta('Last saved just now by you.');
      setStatus({ kind: 'saved', text: 'Saved. The website now shows these changes.' });
    } catch (error) {
      const denied = (error as { code?: string })?.code?.includes('permission-denied');
      setStatus({
        kind: 'error',
        text: denied
          ? 'Not saved. Either someone else changed this section while you were editing, or your access has changed. Reload the section to see the latest version, then make your changes again.'
          : errorMessage(error),
      });
    }
  };

  return (
    <form onSubmit={save} noValidate>
      <h2 className="text-2xl font-black tracking-tight">{schema.label}</h2>
      <p className="mt-1 text-muted">{schema.description}</p>
      <p className="mt-1 text-sm text-muted">{meta}</p>

      {!draft ? (
        <p className="mt-8 text-muted" role="status">{status.kind === 'error' ? status.text : 'Loading…'}</p>
      ) : (
        <>
          <div className="mt-8">
            <Fields fields={schema.fields} value={draft} path="" errors={errors} onChange={(next) => { setDraft(next); if (status.kind !== 'idle') setStatus({ kind: 'idle' }); }} />
          </div>

          <div className="sticky bottom-0 -mx-5 mt-10 flex flex-wrap items-center gap-3 border-t border-line bg-page px-5 py-4 sm:-mx-8 sm:px-8">
            <button type="submit" className="btn btn-primary" disabled={!dirty || status.kind === 'saving'}>
              {status.kind === 'saving' ? 'Saving…' : 'Save changes'}
            </button>
            <button type="button" className="btn btn-secondary" disabled={!dirty || status.kind === 'saving'} onClick={() => { setDraft(saved); setErrors({}); setStatus({ kind: 'idle' }); }}>
              Discard changes
            </button>
            {status.kind === 'error' && status.text?.startsWith('Not saved') && (
              <button type="button" className="btn btn-secondary" onClick={() => void load()}>Reload section</button>
            )}
            <p role="status" aria-live="polite" className={`min-w-0 flex-1 basis-48 text-sm ${status.kind === 'error' ? 'font-medium text-danger' : 'text-muted'}`}>
              {status.text ?? (dirty ? 'You have unsaved changes. Nothing changes on the website until you save.' : '')}
            </p>
          </div>
        </>
      )}
    </form>
  );
}
