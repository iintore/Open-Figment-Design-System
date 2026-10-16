import { useEffect, useMemo, useRef, useState } from 'react';
import { CodeBlock } from './CodeBlock';
import { formatHtml } from './formatHtml';
import { useTheme } from './theme';

const BASE = import.meta.env.BASE_URL;

// The product stylesheets are fetched once and shared by every preview as constructable
// stylesheets, so a preview never paints unstyled and pages with many examples load once.
// @import lines (web fonts) go on the document instead: font faces only work there.
let sheets: Promise<CSSStyleSheet[]> | null = null;
function productSheets() {
  sheets ??= Promise.all(
    ['tokens.css', 'bundle.css'].map(async (name) => {
      const css = await (await fetch(`${BASE}ds/${name}`)).text();
      for (const m of css.matchAll(/@import url\((['"]?)([^'")]+)\1\)[^;]*;/g)) {
        if (document.querySelector(`link[href="${m[2]}"]`)) continue;
        const link = Object.assign(document.createElement('link'), { rel: 'stylesheet', href: m[2] });
        document.head.append(link);
      }
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(css.replace(/@import url\([^)]*\)[^;]*;/g, '').replaceAll("url('fonts/", `url('${BASE}ds/fonts/`));
      return sheet;
    }),
  ).then((list) => {
    const local = new CSSStyleSheet();
    local.replaceSync(`:host{display:block} .pv{background:var(--color-bg);color:var(--color-text);font:var(--text-body-medium);letter-spacing:.055px;-webkit-font-smoothing:antialiased;contain:layout paint}
      .pv.canvas{background:var(--color-bg-canvas)} .pv.pad{padding:32px;display:flex;justify-content:center;align-items:center;flex-wrap:wrap;gap:16px}
      .pv .ds-stage{padding:0} img{max-width:100%}`);
    return [...list, local];
  });
  return sheets;
}

/**
 * Renders captured product markup inside a shadow root with the product stylesheets, so docs
 * styles can't leak in and the preview follows the page theme.
 */
export function LiveMarkup({ html, width, minHeight, padded = true, canvas = false }: { html: string; width?: number | null; minHeight?: number; padded?: boolean; canvas?: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let live = true;
    productSheets().then((list) => {
      if (!live) return;
      const root = el.shadowRoot ?? el.attachShadow({ mode: 'open' });
      root.adoptedStyleSheets = list;
      root.innerHTML = `<div class="pv${padded ? ' pad' : ''}${canvas ? ' canvas' : ''}" data-theme="${theme}" style="${minHeight ? `min-height:${minHeight}px;` : ''}${width ? `width:${width}px;` : ''}">${html.replaceAll('/shots/', `${BASE}shots/`).replaceAll('/logos/', `${BASE}logos/`)}</div>`;
      // Floating UI (menus, popovers, tooltips) was captured at its screen position; bring it
      // back into the preview's flow so it shows inside the card instead of over the page.
      for (const node of root.querySelectorAll<HTMLElement>('.pv *')) {
        if (getComputedStyle(node).position !== 'fixed') continue;
        Object.assign(node.style, { position: 'relative', inset: 'auto', left: 'auto', top: 'auto', right: 'auto', bottom: 'auto', transform: 'none', margin: '0' });
      }
      setReady(true);
    });
    return () => {
      live = false;
    };
  }, [html, theme, width, minHeight, padded, canvas]);
  return <div ref={host} className={'doc-live' + (ready ? '' : ' loading')} style={!ready ? { minHeight: minHeight ?? 120 } : undefined} />;
}

/** The design system cover (960 × 288), scaled down to fit narrower columns. */
export function Hero({ html }: { html: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(Math.min(1, el.clientWidth / 960)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div className="doc-hero" ref={box} role="img" aria-label="Open Figment: quiet panels around your work, one blue for action, one purple for components.">
      <div style={{ zoom: scale }}>
        <LiveMarkup html={html} padded={false} />
      </div>
    </div>
  );
}

export function Example({ title, sub, html, width, minHeight, canvas }: { title?: string; sub?: string; html: string; width?: number | null; minHeight?: number; canvas?: boolean }) {
  const [tab, setTab] = useState<'preview' | 'code'>('preview');
  // The editor UI is deliberately small (11px type); 200% helps inspect details.
  const [zoom, setZoom] = useState(1);
  const code = useMemo(() => formatHtml(html), [html]);
  return (
    <div className="doc-example">
      {title && (
        <h3 id={'ex-' + title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}>
          {title}
          {sub && <span className="doc-example-sub">{sub}</span>}
        </h3>
      )}
      <div className="doc-example-card">
        <div className="doc-example-bar">
          <div className="doc-tabs" role="tablist" aria-label="Example view">
            <button role="tab" aria-selected={tab === 'preview'} className={tab === 'preview' ? 'on' : ''} onClick={() => setTab('preview')}>
              Preview
            </button>
            <button role="tab" aria-selected={tab === 'code'} className={tab === 'code' ? 'on' : ''} onClick={() => setTab('code')}>
              Code
            </button>
          </div>
          {tab === 'preview' && (
            <div className="doc-zoom" role="group" aria-label="Zoom">
              {[1, 2].map((z) => (
                <button key={z} aria-pressed={zoom === z} className={zoom === z ? 'on' : ''} onClick={() => setZoom(z)}>
                  {z * 100}%
                </button>
              ))}
            </div>
          )}
        </div>
        {tab === 'preview' ? (
          <div className="doc-example-stage">
            <div style={{ zoom }}>
              <LiveMarkup html={html} width={width} minHeight={minHeight} canvas={canvas} />
            </div>
          </div>
        ) : (
          <CodeBlock code={code} lang="html" bare />
        )}
      </div>
    </div>
  );
}
