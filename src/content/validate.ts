import { DEFAULT_CONTENT } from './defaults';
import { SCHEMA, type Field } from './schema';
import { SECTION_KEYS, WEEKDAYS, type SectionKey, type SiteContent } from './types';

export type Errors = Record<string, string>;

const MAX_URL = 500;
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export const cleanText = (value: string) => value.replace(CONTROL_CHARS, '').trim();

/** Returns the normalised link when it is a plain https link, otherwise null. */
export function safeHttpsUrl(value: unknown, hosts?: readonly string[]): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > MAX_URL) return null;
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' || url.username || url.password || !url.hostname.includes('.')) return null;
  if (hosts && !hosts.includes(url.hostname)) return null;
  return url.href;
}

export const isPhone = (value: string) => /^\+[1-9]\d{7,14}$/.test(value);
export const isEmail = (value: string) => value.length <= 120 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
export const isTime = (value: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
const isId = (value: unknown): value is string => typeof value === 'string' && /^[A-Za-z0-9_-]{1,40}$/.test(value);

export const newId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** Validates one scalar field. Returns the cleaned value, or an error message. */
function checkScalar(field: Exclude<Field, { kind: 'group' | 'list' }>, raw: unknown): { value: unknown; error?: string } {
  switch (field.kind) {
    case 'text': {
      if (raw !== undefined && typeof raw !== 'string') return { value: '', error: `${field.label} must be text.` };
      const value = cleanText((raw as string | undefined) ?? '');
      if (field.required && !value) return { value, error: `${field.label} cannot be empty.` };
      if (value.length > field.max) return { value, error: `${field.label} is too long (${value.length} of ${field.max} characters).` };
      return { value };
    }
    case 'url': {
      const text = typeof raw === 'string' ? raw.trim() : '';
      if (!text) return field.required ? { value: '', error: `${field.label} cannot be empty.` } : { value: '' };
      const url = safeHttpsUrl(text, field.hosts);
      if (!url) {
        const hint = field.hosts ? ` on ${field.hosts.join(' or ')}` : '';
        return { value: text, error: `${field.label} must be a full link starting with https://${hint}.` };
      }
      return { value: url };
    }
    case 'phone': {
      const value = typeof raw === 'string' ? raw.replace(/[\s()-]/g, '') : '';
      return isPhone(value) ? { value } : { value, error: `${field.label} must look like +27722230708.` };
    }
    case 'email': {
      const value = typeof raw === 'string' ? raw.trim().toLowerCase() : '';
      return isEmail(value) ? { value } : { value, error: 'Enter a valid email address.' };
    }
    case 'time': {
      const value = typeof raw === 'string' ? raw.trim() : '';
      return isTime(value) ? { value } : { value, error: `${field.label} must be a time like 10:00.` };
    }
    case 'days': {
      const list = Array.isArray(raw) ? raw : [];
      const value = WEEKDAYS.filter((day) => list.includes(day));
      return value.length ? { value } : { value, error: 'Choose at least one day.' };
    }
    case 'select': {
      const ok = field.options.some((option) => option.value === raw);
      return ok ? { value: raw } : { value: field.options[0].value, error: `Choose a ${field.label.toLowerCase()}.` };
    }
  }
}

function checkFields(fields: Field[], raw: unknown, path: string, errors: Errors): Record<string, unknown> {
  const source = isRecord(raw) ? raw : {};
  const out: Record<string, unknown> = {};
  for (const field of fields) {
    const at = path ? `${path}.${field.key}` : field.key;
    const value = source[field.key];
    if (field.kind === 'group') {
      out[field.key] = checkFields(field.fields, value, at, errors);
    } else if (field.kind === 'list') {
      const list = Array.isArray(value) ? value : [];
      if (!Array.isArray(value)) errors[at] = `${field.label} is missing.`;
      else if (list.length > field.max) errors[at] = `${field.label}: at most ${field.max} allowed.`;
      const seen = new Set<string>();
      out[field.key] = list.map((item, index) => {
        const checked = checkFields(field.fields, item, `${at}.${index}`, errors);
        let id = isRecord(item) && isId(item.id) ? item.id : newId();
        while (seen.has(id)) id = newId();
        seen.add(id);
        return { id, ...checked };
      });
    } else {
      const result = checkScalar(field, value);
      out[field.key] = result.value;
      if (result.error) errors[at] = result.error;
    }
  }
  return out;
}

/** Strict check used before an admin save. Any problem is reported by field path. */
export function validateSection<K extends SectionKey>(key: K, raw: unknown): { value: SiteContent[K]; errors: Errors } {
  const errors: Errors = {};
  if (!isRecord(raw)) errors[''] = 'Nothing to save.';
  const value = checkFields(SCHEMA[key].fields, raw, '', errors) as unknown as SiteContent[K];
  return { value, errors };
}

function repairFields(fields: Field[], raw: unknown, fallback: Record<string, unknown>): Record<string, unknown> {
  const source = isRecord(raw) ? raw : {};
  const out: Record<string, unknown> = {};
  for (const field of fields) {
    const value = source[field.key];
    const base = fallback[field.key];
    if (field.kind === 'group') {
      out[field.key] = repairFields(field.fields, value, base as Record<string, unknown>);
    } else if (field.kind === 'list') {
      if (!Array.isArray(value)) {
        out[field.key] = base;
        continue;
      }
      const kept: Record<string, unknown>[] = [];
      for (const item of value.slice(0, field.max)) {
        const errors: Errors = {};
        const checked = checkFields(field.fields, item, '', errors);
        if (Object.keys(errors).length) continue;
        const id = isRecord(item) && isId(item.id) && !kept.some((k) => k.id === item.id) ? item.id : `item-${kept.length}`;
        kept.push({ id, ...checked });
      }
      out[field.key] = kept;
    } else {
      const result = checkScalar(field, value);
      out[field.key] = result.error ? base : result.value;
    }
  }
  return out;
}

/**
 * Lenient check used when the public site loads content. Never throws:
 * a missing section falls back to the built-in default, a bad field falls
 * back to its default value, and a bad list entry is dropped.
 */
export function normalizeSection<K extends SectionKey>(key: K, raw: unknown): SiteContent[K] {
  const fallback = DEFAULT_CONTENT[key];
  if (!isRecord(raw)) return fallback;
  return repairFields(SCHEMA[key].fields, raw, fallback as unknown as Record<string, unknown>) as unknown as SiteContent[K];
}

export function resolveContent(raw: unknown): SiteContent {
  const source = isRecord(raw) ? raw : {};
  const out = {} as Record<SectionKey, unknown>;
  for (const key of SECTION_KEYS) out[key] = normalizeSection(key, source[key]);
  return out as SiteContent;
}
