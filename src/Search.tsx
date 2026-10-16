import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from './icons';
import { AppIcon } from './iconParts';

import { inline } from './markdown';
import content from './content/content.json';

// Each result shows its sidebar section as that section's icon, the same one the sidebar uses.
const SECTION_ICON: Record<string, string> = Object.fromEntries((content.nav as { label: string; icon: string }[]).map((g) => [g.label, g.icon]));
import { navigate } from './router';
import { headingsOf, type Page } from './data';

interface Hit {
  page: Page;
  heading?: { id: string; text: string };
  excerpt?: string;
  score: number;
}

const plain = (md: string) => md.replace(/```[\s\S]*?```/g, ' ').replace(/[#*`|>]/g, ' ').replace(/\s+/g, ' ');

function excerpt(text: string, at: number, len: number) {
  // Start and end on word boundaries around the match.
  let start = Math.max(0, at - 40);
  if (start) start = text.indexOf(' ', start) + 1 || start;
  let end = Math.min(text.length, at + len + 60);
  const space = text.lastIndexOf(' ', end);
  if (end < text.length && space > at + len) end = space;
  return (start ? '…' : '') + text.slice(start, end).trim() + (end < text.length ? '…' : '');
}

function search(pages: Page[], q: string): Hit[] {
  const t = q.trim().toLowerCase();
  if (!t) return pages.slice(0, 8).map((page) => ({ page, score: 0 }));
  const hits: Hit[] = [];
  for (const page of pages) {
    const title = page.title.toLowerCase();
    const leadHit = !title.includes(t) && page.lead.toLowerCase().includes(t);
    if (title.startsWith(t)) hits.push({ page, score: 0 });
    else if (title.includes(t)) hits.push({ page, score: 1 });
    else if (leadHit) hits.push({ page, score: 3 });
    let headingHit = false;
    for (const h of headingsOf(page.md))
      if (h.text.toLowerCase().includes(t)) {
        hits.push({ page, heading: h, score: 2 });
        headingHit = true;
      }
    if (!headingHit && !leadHit && !title.includes(t)) {
      const body = plain(page.md);
      const at = body.toLowerCase().indexOf(t);
      if (at >= 0) hits.push({ page, excerpt: excerpt(body, at, t.length), score: 4 });
    }
  }
  return hits.sort((a, b) => a.score - b.score).slice(0, 30);
}

export function SearchDialog({ pages, onClose }: { pages: Page[]; onClose: () => void }) {
  const [q, setQ] = useState('');
  const [hl, setHl] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const hits = useMemo(() => search(pages, q), [pages, q]);
  useEffect(() => input.current?.focus(), []);
  useEffect(() => {
    list.current?.querySelector('[data-hl="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [hl]);
  const go = (h: Hit) => {
    navigate(h.page.path, h.heading ? '#' + h.heading.id : '');
    onClose();
  };
  return (
    <div className="doc-search-backdrop" onMouseDown={onClose}>
      <div className="doc-search" role="dialog" aria-modal="true" aria-label="Search documentation" onMouseDown={(e) => e.stopPropagation()}>
        <label className="doc-search-input">
          <Icon.search />
          <input
            ref={input}
            value={q}
            placeholder="Search components, foundations and guidelines"
            aria-controls="doc-search-results"
            onChange={(e) => {
              setQ(e.target.value);
              setHl(0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') setHl(Math.min(hits.length - 1, hl + 1));
              else if (e.key === 'ArrowUp') setHl(Math.max(0, hl - 1));
              else if (e.key === 'Enter' && hits[hl]) go(hits[hl]);
              else if (e.key === 'Escape') onClose();
              else return;
              e.preventDefault();
            }}
          />
          <kbd>Esc</kbd>
        </label>
        <div className="doc-search-results" id="doc-search-results" role="listbox" ref={list}>
          {!hits.length && <div className="doc-search-empty">No results for “{q}”. Try a component name such as “Select”.</div>}
          {hits.map((h, i) => (
            <button
              key={h.page.path + (h.heading?.id ?? '')}
              role="option"
              aria-selected={i === hl}
              data-hl={i === hl}
              className={'doc-search-hit' + (i === hl ? ' hl' : '')}
              onMouseMove={() => setHl(i)}
              onClick={() => go(h)}
            >
              <span className="doc-search-sec" title={h.page.section}>
                <AppIcon name={SECTION_ICON[h.page.section] ?? 'file'} />
                <span className="doc-sr">{h.page.section}</span>
              </span>
              <span className="doc-search-title">
                {h.page.title}
                {h.heading && <span className="doc-search-head"> › {h.heading.text}</span>}
              </span>
              {!h.heading && <span className="doc-search-lead">{h.excerpt ?? inline(h.page.lead)}</span>}
            </button>
          ))}
        </div>
        <div className="doc-search-foot">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> to move
          </span>
          <span>
            <kbd>↵</kbd> to open
          </span>
        </div>
      </div>
    </div>
  );
}
