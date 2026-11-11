import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_CONTENT } from '../src/content/defaults';
import { browserCache, initialContent, loadContent, type ContentCache, type RawSections } from '../src/content/loader';
import { SECTION_KEYS } from '../src/content/types';
import { normalizeSection, resolveContent, safeHttpsUrl, validateSection } from '../src/content/validate';
import { plainText, splitEmphasis } from '../src/content/emphasis';

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

function memoryCache(initial: RawSections | null = null): ContentCache & { stored: RawSections | null } {
  return {
    stored: initial,
    read() { return this.stored; },
    write(raw) { this.stored = raw; },
  };
}

describe('built-in defaults', () => {
  it.each(SECTION_KEYS)('%s passes its own validation unchanged', (key) => {
    const { value, errors } = validateSection(key, clone(DEFAULT_CONTENT[key]));
    expect(errors).toEqual({});
    expect(value).toEqual(DEFAULT_CONTENT[key]);
  });

  it('every menu item has a price', () => {
    for (const item of DEFAULT_CONTENT.menu.items) expect(item.price.trim()).not.toBe('');
  });
});

describe('validateSection (admin saves)', () => {
  it('rejects an empty price', () => {
    const menu = clone(DEFAULT_CONTENT.menu);
    menu.items[0].price = '   ';
    expect(validateSection('menu', menu).errors['items.0.price']).toMatch(/cannot be empty/);
  });

  it('rejects text that is too long', () => {
    const menu = clone(DEFAULT_CONTENT.menu);
    menu.items[1].name = 'x'.repeat(81);
    expect(validateSection('menu', menu).errors['items.1.name']).toMatch(/too long/);
  });

  it('rejects an unknown category', () => {
    const menu = clone(DEFAULT_CONTENT.menu) as unknown as { items: { category: string }[] };
    menu.items[0].category = 'dessert';
    expect(validateSection('menu', menu).errors['items.0.category']).toBeDefined();
  });

  it.each([
    'javascript:alert(1)',
    'http://example.com/menu.pdf',
    'data:text/html,<script>alert(1)</script>',
    '//example.com/x',
    'https://user:pass@example.com/',
    'not a link',
  ])('rejects the unsafe link %s', (link) => {
    const menu = clone(DEFAULT_CONTENT.menu);
    menu.pdfUrl = link;
    expect(validateSection('menu', menu).errors.pdfUrl).toMatch(/https/);
  });

  it('accepts an https link and an empty optional link', () => {
    const menu = clone(DEFAULT_CONTENT.menu);
    menu.pdfUrl = 'https://example.com/menu.pdf';
    expect(validateSection('menu', menu).errors).toEqual({});
    menu.pdfUrl = '';
    expect(validateSection('menu', menu).errors).toEqual({});
  });

  it('only allows Google Maps for the embedded map', () => {
    const site = clone(DEFAULT_CONTENT.site);
    site.mapEmbedUrl = 'https://evil.example/frame';
    expect(validateSection('site', site).errors.mapEmbedUrl).toBeDefined();
  });

  it('checks phone, email, trading hours and days', () => {
    const site = clone(DEFAULT_CONTENT.site);
    site.phone = '072 223 0708';
    site.email = 'not-an-email';
    site.hours[0].opens = '25:00';
    site.hours[1].days = [];
    const { errors } = validateSection('site', site);
    expect(Object.keys(errors).sort()).toEqual(['email', 'hours.0.opens', 'hours.1.days', 'phone']);
  });

  it('trims text, strips control characters and gives new items an id', () => {
    const menu = clone(DEFAULT_CONTENT.menu) as unknown as { items: Record<string, unknown>[] };
    menu.items.push({ name: '  Pap \u0007& Vleis ', price: ' R85 ', description: '', category: 'african' });
    const { value, errors } = validateSection('menu', menu);
    expect(errors).toEqual({});
    const added = value.items[value.items.length - 1];
    expect(added).toMatchObject({ name: 'Pap & Vleis', price: 'R85' });
    expect(added.id).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it('limits how many items a list may hold', () => {
    const gallery = clone(DEFAULT_CONTENT.gallery);
    while (gallery.images.length < 25) gallery.images.push({ ...gallery.images[0], id: `x${gallery.images.length}` });
    expect(validateSection('gallery', gallery).errors.images).toMatch(/at most 24/);
  });

  it('reports a section that is not an object', () => {
    expect(validateSection('menu', null).errors['']).toBeDefined();
  });
});

describe('normalizeSection (public loads)', () => {
  it('falls back to the default for a missing or malformed section', () => {
    expect(normalizeSection('menu', undefined)).toBe(DEFAULT_CONTENT.menu);
    expect(normalizeSection('menu', 'oops')).toBe(DEFAULT_CONTENT.menu);
    expect(normalizeSection('menu', [])).toBe(DEFAULT_CONTENT.menu);
  });

  it('drops bad list entries and keeps the good ones', () => {
    const menu = clone(DEFAULT_CONTENT.menu) as unknown as { items: unknown[] };
    menu.items = [
      { id: 'a', name: 'Good', price: 'R10', description: '', category: 'lunch' },
      { id: 'b', name: 'No price', price: '', description: '', category: 'lunch' },
      { id: 'c', name: 'Bad category', price: 'R10', description: '', category: 'nope' },
      'garbage',
    ];
    expect(normalizeSection('menu', menu).items.map((item) => item.name)).toEqual(['Good']);
  });

  it('replaces a bad field with its default and removes unsafe links', () => {
    const site = { ...clone(DEFAULT_CONTENT.site), phone: 'call me', facebookUrl: 'javascript:alert(1)', directionsUrl: 'http://x.y' };
    const result = normalizeSection('site', site);
    expect(result.phone).toBe(DEFAULT_CONTENT.site.phone);
    expect(result.facebookUrl).toBe(DEFAULT_CONTENT.site.facebookUrl);
    expect(result.directionsUrl).toBe(DEFAULT_CONTENT.site.directionsUrl);
  });

  it('respects a list the staff emptied on purpose', () => {
    expect(normalizeSection('events', { ...clone(DEFAULT_CONTENT.events), items: [] }).items).toEqual([]);
  });

  it('ignores unknown fields', () => {
    const result = normalizeSection('booking', { ...clone(DEFAULT_CONTENT.booking), injected: '<script>' });
    expect(result).toEqual(DEFAULT_CONTENT.booking);
  });

  it('resolveContent always returns every section', () => {
    for (const raw of [null, undefined, 42, {}, { menu: 3, site: null }]) {
      expect(resolveContent(raw)).toEqual(DEFAULT_CONTENT);
    }
  });
});

describe('loadContent', () => {
  const stored = (): RawSections => ({
    menu: { ...clone(DEFAULT_CONTENT.menu), title: 'NEW MENU' },
  });

  it('uses store content and fills the other sections from defaults', async () => {
    const cache = memoryCache();
    const result = await loadContent({ readAll: async () => stored() }, cache);
    expect(result.source).toBe('store');
    expect(result.content.menu.title).toBe('NEW MENU');
    expect(result.content.site).toEqual(DEFAULT_CONTENT.site);
    expect(cache.stored).toEqual(stored());
  });

  it('shows defaults when the store is empty', async () => {
    const result = await loadContent({ readAll: async () => ({}) }, memoryCache());
    expect(result).toEqual({ content: DEFAULT_CONTENT, source: 'defaults' });
  });

  it('shows defaults when the store cannot be reached', async () => {
    const result = await loadContent({ readAll: async () => { throw new Error('offline'); } });
    expect(result).toEqual({ content: DEFAULT_CONTENT, source: 'defaults' });
  });

  it('shows the last good copy when the store cannot be reached', async () => {
    const result = await loadContent({ readAll: async () => { throw new Error('offline'); } }, memoryCache(stored()));
    expect(result.source).toBe('cache');
    expect(result.content.menu.title).toBe('NEW MENU');
  });

  it('gives up on a store that never answers', async () => {
    vi.useFakeTimers();
    const pending = loadContent({ readAll: () => new Promise(() => undefined) }, undefined, 1000);
    await vi.advanceTimersByTimeAsync(1000);
    expect((await pending).source).toBe('defaults');
    vi.useRealTimers();
  });

  it('shows defaults when no store is configured', async () => {
    expect((await loadContent(null)).source).toBe('defaults');
  });

  it('never trusts the cache blindly', () => {
    const cache = memoryCache({ menu: { items: [{ name: 'x', price: '' }] }, site: 'broken' });
    const { content } = initialContent(cache);
    expect(content.menu.items).toEqual([]);
    expect(content.site).toEqual(DEFAULT_CONTENT.site);
  });
});

describe('browserCache', () => {
  it('survives corrupt, missing or blocked storage', () => {
    expect(browserCache(undefined).read()).toBeNull();
    expect(browserCache({ getItem: () => '{not json', setItem: () => undefined }).read()).toBeNull();
    expect(browserCache({ getItem: () => '[1,2]', setItem: () => undefined }).read()).toBeNull();
    const blocked = { getItem: () => { throw new Error('denied'); }, setItem: () => { throw new Error('full'); } };
    expect(browserCache(blocked).read()).toBeNull();
    expect(() => browserCache(blocked).write({})).not.toThrow();
  });

  it('round-trips content', () => {
    const data = new Map<string, string>();
    const cache = browserCache({ getItem: (k) => data.get(k) ?? null, setItem: (k, v) => void data.set(k, v) });
    cache.write({ menu: { title: 'T' } });
    expect(cache.read()).toEqual({ menu: { title: 'T' } });
  });
});

describe('helpers', () => {
  it('safeHttpsUrl normalises and restricts hosts', () => {
    expect(safeHttpsUrl(' https://example.com/a b ')).toBe('https://example.com/a%20b');
    expect(safeHttpsUrl('https://example.com', ['maps.google.com'])).toBeNull();
    expect(safeHttpsUrl('https://localhost/x')).toBeNull();
    expect(safeHttpsUrl(`https://example.com/${'a'.repeat(600)}`)).toBeNull();
    expect(safeHttpsUrl(42)).toBeNull();
  });

  it('splitEmphasis marks *words* and leaves stray asterisks alone', () => {
    expect(splitEmphasis('AUTHENTIC *GRILL* VIBES.')).toEqual([
      { text: 'AUTHENTIC ', marked: false },
      { text: 'GRILL', marked: true },
      { text: ' VIBES.', marked: false },
    ]);
    expect(splitEmphasis('5 * 3')).toEqual([{ text: '5 * 3', marked: false }]);
    expect(plainText('BOOK THE *LIFESTYLE.*')).toBe('BOOK THE LIFESTYLE.');
  });
});
