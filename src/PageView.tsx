import { useEffect, useRef, useState } from 'react';
import { inline, renderMarkdown } from './markdown';
import type { Page } from './data';
import { navigate, pageHref } from './router';
import { Icon } from './icons';
import { Example, Hero, LiveMarkup } from './Preview';
import { ColorGallery, Elevation, IconGallery, LogoShowcase, RadiusScale, Screens, SpacingScale, TypeScale } from './Foundations';

const GALLERY: Record<string, () => React.ReactNode> = {
  colors: () => <ColorGallery />,
  type: () => <TypeScale />,
  spacing: () => <SpacingScale />,
  radius: () => <RadiusScale />,
  elevation: () => <Elevation />,
  icons: () => <IconGallery />,
  logo: () => <LogoShowcase />,
  screens: () => <Screens />,
};
const GALLERY_TITLE: Record<string, string> = { colors: 'Tokens', type: 'Type scale', spacing: 'Scale', radius: 'Scale', elevation: 'Scale', icons: 'Icon set', logo: 'Marks', screens: 'Screens' };

function Outline({ items }: { items: { id: string; text: string; level: number }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  // While a click-triggered smooth scroll runs, keep the clicked item active.
  const pinned = useRef<{ id: string; until: number } | null>(null);
  useEffect(() => {
    const main = document.getElementById('doc-main');
    if (!main) return;
    // The article scrolls inside #doc-main on wide screens and with the document on narrow ones.
    const scroller = () => (main.scrollHeight > main.clientHeight + 1 ? main : document.scrollingElement!);
    const update = () => {
      const pin = pinned.current;
      if (pin && performance.now() < pin.until) return setActive(pin.id);
      pinned.current = null;
      const sc = scroller();
      const top = sc === main ? main.getBoundingClientRect().top : 0;
      const view = sc === main ? main.clientHeight : innerHeight;
      const els = items.map((it) => document.getElementById(it.id)).filter((el): el is HTMLElement => !!el);
      if (!els.length) return;
      // The activation line sits near the top, then slides down over the last screen of the
      // page, so headings near the end (which can never reach the top) still each get a turn.
      const max = sc.scrollHeight - sc.clientHeight;
      const span = Math.min(view, max);
      const line = span > 0 ? 96 + (view - 96) * Math.max(0, 1 - (max - sc.scrollTop) / span) : 96;
      let cur = els[0].id;
      for (const el of els) if (el.getBoundingClientRect().top - top <= line) cur = el.id;
      setActive(cur);
    };
    update();
    main.addEventListener('scroll', update, { passive: true });
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    return () => {
      main.removeEventListener('scroll', update);
      removeEventListener('scroll', update);
      removeEventListener('resize', update);
    };
  }, [items]);
  if (!items.length) return <aside className="doc-toc" />;
  return (
    <aside className="doc-toc" aria-label="On this page">
      <div className="doc-toc-title">On this page</div>
      <ul>
        {items.map((it) => (
          <li key={it.id} className={(it.level === 3 ? 'l3 ' : '') + (it.id === active ? 'on' : '')}>
            <a
              href={'#' + it.id}
              aria-current={it.id === active ? 'location' : undefined}
              onClick={(e) => {
                e.preventDefault();
                pinned.current = { id: it.id, until: performance.now() + 900 };
                setActive(it.id);
                document.getElementById(it.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.replaceState(null, '', '#' + it.id);
              }}
            >
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function PageView({ path, pages }: { path: string; pages: Page[] }) {
  const index = pages.findIndex((p) => p.path === path);
  const page = pages[index];
  // The outline lists the headings actually rendered in the article (prose, examples and
  // gallery sections alike), so every page gets one that matches what's on screen.
  const [outline, setOutline] = useState<{ id: string; text: string; level: number }[]>([]);
  useEffect(() => {
    const article = document.querySelector('.doc-article');
    if (!article) return;
    const read = () => {
      const next = [...article.querySelectorAll<HTMLElement>('h2[id], h3[id]')].map((h) => {
        const copy = h.cloneNode(true) as HTMLElement;
        copy.querySelectorAll('.doc-anchor, .doc-example-sub, [aria-hidden="true"]').forEach((n) => n.remove());
        return { id: h.id, text: copy.textContent!.trim(), level: h.tagName === 'H3' ? 3 : 2 };
      });
      setOutline((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(article, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [page]);

  useEffect(() => {
    document.title = page ? `${page.title} · Open Figment` : 'Open Figment';
    if (location.hash) requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView());
  }, [page]);

  if (!page) {
    return (
      <main className="doc-main" id="doc-main">
        <article className="doc-article">
          <h1>Page not found</h1>
          <p className="doc-lead">There’s no page at this address. Use the sidebar or search (/) to find what you need.</p>
        </article>
      </main>
    );
  }
  const prev = pages[index - 1];
  const next = pages[index + 1];
  const isBlock = page.kind === 'block';
  return (
    <main className="doc-main" id="doc-main" tabIndex={-1}>
      <div className="doc-page">
        <article className="doc-article">
          {page.hero && <Hero html={page.hero} />}
          <div className="doc-eyebrow">{page.subsection ? `${page.section} · ${page.subsection}` : page.section}</div>
          <h1>{page.title}</h1>
          <p className="doc-lead">{inline(page.lead)}</p>
          {page.kind && GALLERY[page.kind] && (
            <section className="doc-gallery">
              <h2 id="gallery">{GALLERY_TITLE[page.kind]}</h2>
              {GALLERY[page.kind]()}
            </section>
          )}
          {page.examples?.length ? (
            <section>
              <h2 id="examples">Examples</h2>
              {page.examples.map((e) => (
                <Example key={e.title} title={e.title} sub={e.sub} html={e.html} width={isBlock ? page.width ?? null : null} minHeight={isBlock ? undefined : 120} canvas={page.title === 'Toolbar'} />
              ))}
            </section>
          ) : page.full ? (
            <section>
              <h2 id="preview">Preview</h2>
              <div className="doc-block-preview">
                <LiveMarkup html={page.full} width={page.width ?? null} padded={false} />
              </div>
            </section>
          ) : null}
          <div className="doc-prose">{renderMarkdown(page.md)}</div>
          <footer className="doc-footer">
            {page.source && (
              <a href={`https://github.com/iintore/Open-Figment-Design-System/blob/main/${page.source}`} target="_blank" rel="noreferrer">
                Edit this page on GitHub
              </a>
            )}
            <span>Open Figment · MIT License</span>
          </footer>
          <nav className="doc-pager" aria-label="Pagination">
            {prev ? (
              <a
                href={pageHref(prev.path)}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(prev.path);
                }}
              >
                <span className="doc-pager-dir">
                  <Icon.arrowLeft /> Previous
                </span>
                <span className="doc-pager-title">{prev.title}</span>
              </a>
            ) : (
              <span />
            )}
            {next && (
              <a
                className="next"
                href={pageHref(next.path)}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(next.path);
                }}
              >
                <span className="doc-pager-dir">
                  Next <Icon.arrowRight />
                </span>
                <span className="doc-pager-title">{next.title}</span>
              </a>
            )}
          </nav>
        </article>
        <Outline items={outline} />
      </div>
    </main>
  );
}
