import { useEffect, useMemo, useState } from 'react';
import { inline, renderMarkdown } from './markdown';
import { headingsOf, type Page } from './data';
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
  useEffect(() => {
    const main = document.getElementById('doc-main');
    if (!main) return;
    const onScroll = () => {
      let cur = items[0]?.id;
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top < 120) cur = it.id;
      }
      setActive(cur);
    };
    onScroll();
    main.addEventListener('scroll', onScroll, { passive: true });
    return () => main.removeEventListener('scroll', onScroll);
  }, [items]);
  if (items.length < 2) return <aside className="doc-toc" />;
  return (
    <aside className="doc-toc" aria-label="On this page">
      <div className="doc-toc-title">On this page</div>
      <ul>
        {items.map((it) => (
          <li key={it.id} className={(it.level === 3 ? 'l3 ' : '') + (it.id === active ? 'on' : '')}>
            <a
              href={'#' + it.id}
              onClick={(e) => {
                e.preventDefault();
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
  const outline = useMemo(() => {
    if (!page) return [];
    const ex = (page.examples ?? []).map((e) => ({ id: 'ex-' + e.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'), text: e.title, level: 3 }));
    const gallery = page.kind && GALLERY[page.kind] ? [{ id: 'gallery', text: GALLERY_TITLE[page.kind], level: 2 }] : [];
    const examples = page.examples?.length ? [{ id: 'examples', text: 'Examples', level: 2 }, ...ex] : page.full ? [{ id: 'preview', text: 'Preview', level: 2 }] : [];
    return [...gallery, ...examples, ...headingsOf(page.md)];
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
