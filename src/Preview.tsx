import { useEffect, useMemo, useRef, useState } from 'react';
import { CodeBlock } from './CodeBlock';
import { formatHtml } from './formatHtml';
import { useTheme } from './theme';

const BASE = import.meta.env.BASE_URL;

/**
 * Renders captured product markup inside a shadow root with the product stylesheets, so docs
 * styles can't leak in and the preview follows the page theme.
 */
export function LiveMarkup({ html, width, minHeight, padded = true, canvas = false }: { html: string; width?: number | null; minHeight?: number; padded?: boolean; canvas?: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const root = el.shadowRoot ?? el.attachShadow({ mode: 'open' });
    root.innerHTML = `<link rel="stylesheet" href="${BASE}ds/tokens.css"><link rel="stylesheet" href="${BASE}ds/bundle.css">
      <style>:host{display:block} .pv{background:var(--color-bg);color:var(--color-text);font:var(--text-body-medium);letter-spacing:.055px;-webkit-font-smoothing:antialiased} .pv.canvas{background:var(--color-bg-canvas)} .pv.pad{padding:32px;display:flex;justify-content:center;align-items:center;flex-wrap:wrap;gap:16px}
      .pv .ds-stage{padding:0} img{max-width:100%}</style>
      <div class="pv${padded ? ' pad' : ''}${canvas ? ' canvas' : ''}" data-theme="${theme}" style="${minHeight ? `min-height:${minHeight}px;` : ''}${width ? `width:${width}px;` : ''}">${html.replaceAll('/shots/', `${BASE}shots/`).replaceAll('/logos/', `${BASE}logos/`)}</div>`;
  }, [html, theme, width, minHeight, padded, canvas]);
  return <div ref={host} className="doc-live" />;
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
