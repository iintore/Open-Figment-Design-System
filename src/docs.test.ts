import { describe, expect, it } from 'vitest';
import content from './content/content.json';
import { formatHtml } from './formatHtml';
import { headingsOf } from './data';
import { slugify } from './markdown';

const icons = content.icons as Record<string, string>;

describe('formatHtml (Code tab)', () => {
  it('shows icons by name and indents nested elements', () => {
    const html = `<button class="btn primary">${icons.plus} Create</button>`;
    expect(formatHtml(html)).toBe(['<button class="btn primary">', '  <Icon.plus />', '  Create', '</button>'].join('\n'));
  });

  it('keeps short elements on one line', () => {
    expect(formatHtml('<label class="field"><span class="field-label">X</span><input value="493"></label>')).toBe(
      ['<label class="field">', '  <span class="field-label">X</span>', '  <input value="493">', '</label>'].join('\n'),
    );
  });

  it('collapses SVGs that are not in the icon set', () => {
    expect(formatHtml('<div><svg viewBox="0 0 1 1"><path d="M0 0"></path></svg></div>')).toBe(['<div>', '  <svg>…</svg>', '</div>'].join('\n'));
  });
});

describe('page outline', () => {
  it('lists h2 and h3 headings with ids matching the rendered anchors', () => {
    const md = '## When to use\ntext\n### `btn` classes\n#### Not listed\n## Rules';
    expect(headingsOf(md)).toEqual([
      { id: 'when-to-use', text: 'When to use', level: 2 },
      { id: 'btn-classes', text: 'btn classes', level: 3 },
      { id: 'rules', text: 'Rules', level: 2 },
    ]);
    expect(slugify('`btn` classes')).toBe('btn-classes');
  });
});

describe('content', () => {
  const pages = content.pages as Record<string, { title: string; lead: string; examples?: { html: string }[] | null; kind?: string }>;
  it('every page has a title and a lead', () => {
    for (const [path, p] of Object.entries(pages)) {
      expect(p.title, path).toBeTruthy();
      expect(p.lead, path).toBeTruthy();
    }
  });

  it('every component page shows at least one example', () => {
    for (const [path, p] of Object.entries(pages)) if (p.kind === 'component') expect(p.examples?.length, path).toBeGreaterThan(0);
  });

  it('every page is reachable from the navigation', () => {
    type Nav = { items?: { path: string }[]; sub?: { items: { path: string }[] }[] };
    const listed = new Set((content.nav as Nav[]).flatMap((g) => [...(g.items ?? []), ...(g.sub ?? []).flatMap((s) => s.items)]).map((i) => i.path));
    expect([...Object.keys(pages)].filter((p) => !listed.has(p))).toEqual([]);
  });
});
