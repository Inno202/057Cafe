import { resolveContent } from './validate';
import type { SectionKey, SiteContent } from './types';

export type RawSections = Partial<Record<SectionKey, unknown>>;

/** Read-only view of the content store. The public site has no write path. */
export interface ContentReader {
  readAll(): Promise<RawSections>;
}

export interface ContentCache {
  read(): RawSections | null;
  write(raw: RawSections): void;
}

export type ContentSource = 'store' | 'cache' | 'defaults';
export interface LoadResult { content: SiteContent; source: ContentSource }

const CACHE_KEY = '057cafe.content.v1';

/** Remembers the last content that loaded so repeat visits paint instantly and survive an outage. */
export function browserCache(storage: Pick<Storage, 'getItem' | 'setItem'> | undefined): ContentCache {
  return {
    read() {
      try {
        const text = storage?.getItem(CACHE_KEY);
        const parsed: unknown = text ? JSON.parse(text) : null;
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as RawSections) : null;
      } catch {
        return null;
      }
    },
    write(raw) {
      try {
        storage?.setItem(CACHE_KEY, JSON.stringify(raw));
      } catch {
        /* storage full or blocked: the site still works without the cache */
      }
    },
  };
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Content store timed out')), ms);
    promise.then(
      (value) => { clearTimeout(timer); resolve(value); },
      (error) => { clearTimeout(timer); reject(error); },
    );
  });
}

/** What to show before the store answers: cached content if any, otherwise the defaults. */
export function initialContent(cache?: ContentCache): LoadResult {
  const cached = cache?.read();
  return cached ? { content: resolveContent(cached), source: 'cache' } : { content: resolveContent(null), source: 'defaults' };
}

/**
 * Loads content from the store. Never rejects: on any failure it returns the
 * cached copy, or the built-in defaults when there is no cache.
 */
export async function loadContent(
  reader: ContentReader | null,
  cache?: ContentCache,
  timeoutMs = 8000,
): Promise<LoadResult> {
  if (!reader) return initialContent(cache);
  try {
    const raw = await withTimeout(reader.readAll(), timeoutMs);
    if (!raw || typeof raw !== 'object' || Object.keys(raw).length === 0) {
      return { content: resolveContent(null), source: 'defaults' };
    }
    cache?.write(raw);
    return { content: resolveContent(raw), source: 'store' };
  } catch {
    return initialContent(cache);
  }
}
