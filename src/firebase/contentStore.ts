import { collection, getDocs } from 'firebase/firestore/lite';
import type { ContentReader, RawSections } from '../content/loader';
import { SECTION_KEYS, type SectionKey } from '../content/types';
import { getDb } from './app';

export const CONTENT_COLLECTION = 'content';

/** Public, read-only access to the content store: one request for every section. */
export function firestoreReader(): ContentReader | null {
  const db = getDb();
  if (!db) return null;
  return {
    async readAll() {
      const snapshot = await getDocs(collection(db, CONTENT_COLLECTION));
      const raw: RawSections = {};
      snapshot.forEach((doc) => {
        if ((SECTION_KEYS as readonly string[]).includes(doc.id)) raw[doc.id as SectionKey] = doc.data().data;
      });
      return raw;
    },
  };
}
