import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { browserCache, initialContent, loadContent, type ContentCache } from './loader';
import type { SiteContent } from './types';

const ContentContext = createContext<SiteContent | null>(null);

function getCache(): ContentCache {
  let storage: Storage | undefined;
  try {
    storage = window.localStorage;
  } catch {
    storage = undefined;
  }
  return browserCache(storage);
}

/** Every public page reads its content from here, so one admin edit reaches all of them. */
export function ContentProvider({ children }: { children: ReactNode }) {
  const [cache] = useState(getCache);
  const [content, setContent] = useState<SiteContent>(() => initialContent(cache).content);

  useEffect(() => {
    let active = true;
    // Firebase is fetched after first paint, so the page never waits for it.
    void import('../firebase/contentStore')
      .then(({ firestoreReader }) => {
        const reader = firestoreReader();
        return reader ? loadContent(reader, cache) : null;
      })
      .then((result) => {
        if (active && result) setContent(result.content);
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, [cache]);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export function useContent(): SiteContent {
  const content = useContext(ContentContext);
  if (!content) throw new Error('useContent must be used inside ContentProvider');
  return content;
}
