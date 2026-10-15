import { useMemo, useState } from 'react';
import content from './content/content.json';
import { useTheme } from './theme';

const BASE = import.meta.env.BASE_URL;
interface Tok {
  name: string;
  value: string | Record<string, string>;
  usage: string;
}
const T = content.tokens as unknown as {
  color: { tokens: Tok[] };
  type: { families: Record<string, string>; groups: { name: string; family: string; styles: { name: string; fontSize: string; lineHeight: string; fontWeight: number; letterSpacing?: string; usage: string; sample: string }[] }[] };
  spacing: { tokens: Tok[] };
  radius: { tokens: Tok[] };
  shadow: { tokens: Tok[] };
};
const val = (t: Tok, theme: string) => (typeof t.value === 'string' ? t.value : t.value[theme] ?? t.value.light);

// Usage notes mention tokens in backticks; show them as code.
function Usage({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/).map((part, i) => (part.startsWith('`') ? <code key={i}>{part.slice(1, -1)}</code> : part))}
    </>
  );
}

function CopyName({ name }: { name: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      className="doc-token-name"
      title="Copy CSS variable"
      onClick={() => {
        navigator.clipboard?.writeText(`var(--${name})`).then(() => {
          setDone(true);
          window.setTimeout(() => setDone(false), 1200);
        }, () => undefined);
      }}
    >
      {done ? 'Copied' : `--${name}`}
    </button>
  );
}

const COLOR_GROUPS: [string, (n: string) => boolean][] = [
  ['Surfaces', (n) => n.startsWith('color-bg') && !/brand|component|danger|menu|tooltip|selected/.test(n)],
  ['Brand & selection', (n) => /brand|selected/.test(n)],
  ['Components', (n) => /component/.test(n)],
  ['Danger', (n) => /danger/.test(n)],
  ['Menus & tooltips', (n) => /menu|tooltip/.test(n)],
  ['Text', (n) => n.startsWith('color-text') && !/brand|component|danger|menu/.test(n)],
  ['Icons', (n) => n.startsWith('color-icon')],
  ['Borders', (n) => n.startsWith('color-border') && !/menu|selected/.test(n)],
];

export function ColorGallery() {
  const used = new Set<string>();
  return (
    <div className="doc-colors">
      {COLOR_GROUPS.map(([label, test]) => {
        const items = T.color.tokens.filter((t) => !used.has(t.name) && test(t.name));
        items.forEach((t) => used.add(t.name));
        if (!items.length) return null;
        return (
          <div key={label}>
            <h3 id={'colors-' + label.toLowerCase().replace(/[^a-z]+/g, '-')}>{label}</h3>
            <div className="doc-swatches">
              {items.map((t) => (
                <div key={t.name} className="doc-swatch">
                  <div className="doc-swatch-chips">
                    <span style={{ background: val(t, 'light') }}>
                      <i>Light</i>
                      {val(t, 'light')}
                    </span>
                    <span className="dark" style={{ background: val(t, 'dark') }}>
                      <i>Dark</i>
                      {val(t, 'dark')}
                    </span>
                  </div>
                  <div className="doc-swatch-meta">
                    <CopyName name={t.name} />
                    <p>
                      <Usage text={t.usage} />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function TypeScale() {
  return (
    <div className="doc-type">
      {T.type.groups.flatMap((g) =>
        g.styles.map((s) => (
          <div key={s.name} className="doc-type-row">
            <div className="doc-type-meta">
              <CopyName name={s.name.startsWith('code') ? 'font-mono' : 'text-' + s.name} />
              <span>
                {s.fontSize} / {s.lineHeight} · {s.fontWeight}
              </span>
            </div>
            <div>
              <div style={{ fontFamily: T.type.families[g.family], fontSize: s.fontSize, lineHeight: s.lineHeight, fontWeight: s.fontWeight, letterSpacing: s.letterSpacing }}>{s.sample}</div>
              <p className="doc-type-usage">{s.usage}</p>
            </div>
          </div>
        )),
      )}
    </div>
  );
}

function Scale({ tokens, render }: { tokens: Tok[]; render: (t: Tok) => React.ReactNode }) {
  return (
    <div className="doc-scale">
      {tokens.map((t) => (
        <div key={t.name} className="doc-scale-row">
          <CopyName name={t.name} />
          <span className="doc-scale-val">{t.value as string}</span>
          <div className="doc-scale-vis">{render(t)}</div>
          <p>
            <Usage text={t.usage} />
          </p>
        </div>
      ))}
    </div>
  );
}

export const SpacingScale = () => <Scale tokens={T.spacing.tokens} render={(t) => <span className="doc-bar" style={{ width: Math.min(parseFloat(t.value as string), 260) }} />} />;
export const RadiusScale = () => <Scale tokens={T.radius.tokens} render={(t) => <span className="doc-radius" style={{ borderRadius: t.value as string }} />} />;

export function Elevation() {
  const theme = useTheme();
  return (
    <Scale
      tokens={T.shadow.tokens.map((t) => ({ ...t, value: '' }))}
      render={(t) => (
        <span className="doc-elev">
          <span style={{ boxShadow: val(T.shadow.tokens.find((s) => s.name === t.name)!, theme) }} />
        </span>
      )}
    />
  );
}

export function IconGallery() {
  const icons = content.icons as Record<string, string>;
  const [q, setQ] = useState('');
  const [copied, setCopied] = useState('');
  const names = useMemo(() => Object.keys(icons).filter((n) => n.toLowerCase().includes(q.toLowerCase())), [icons, q]);
  return (
    <div>
      <label className="doc-filter">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Filter ${Object.keys(icons).length} icons`} aria-label="Filter icons" />
      </label>
      <div className="doc-icons">
        {names.map((n) => (
          <button
            key={n}
            className="doc-icon-tile"
            title={`Copy <Icon.${n} />`}
            onClick={() => {
              navigator.clipboard?.writeText(`<Icon.${n} />`).then(() => {
                setCopied(n);
                window.setTimeout(() => setCopied(''), 1200);
              }, () => undefined);
            }}
          >
            <span dangerouslySetInnerHTML={{ __html: icons[n] }} />
            <span className="doc-icon-name">{copied === n ? 'Copied' : n}</span>
          </button>
        ))}
        {!names.length && <p className="doc-muted">No icon matches “{q}”.</p>}
      </div>
    </div>
  );
}

export function LogoShowcase() {
  return (
    <div className="doc-logos">
      <figure>
        <div className="doc-logo-stage">
          <img src={`${BASE}logos/figment-monkey.svg`} width="120" height="120" alt="Figment monkey on its yellow tile" />
        </div>
        <figcaption>Tile: app icon, favicon, navigation rail</figcaption>
      </figure>
      <figure>
        <div className="doc-logo-stage brand">
          <img src={`${BASE}logos/figment-monkey-bare.svg`} width="120" height="120" alt="Figment monkey without the tile" />
        </div>
        <figcaption>Bare: on coloured grounds</figcaption>
      </figure>
      <figure>
        <div className="doc-logo-stage sizes">
          {[16, 26, 40, 64].map((s) => (
            <img key={s} src={`${BASE}logos/figment-monkey.svg`} width={s} height={s} alt="" />
          ))}
        </div>
        <figcaption>Sizes: 16 (favicon) to 64</figcaption>
      </figure>
    </div>
  );
}

export function Screens() {
  const shots = [
    ['editor-frame-selected', 'Editor, light theme, frame selected'],
    ['editor-dark', 'Editor, dark theme'],
    ['home-light', 'Home, light theme'],
    ['home-dark', 'Home, dark theme'],
  ];
  return (
    <div className="doc-screens">
      {shots.map(([f, cap]) => (
        <figure key={f}>
          <img src={`${BASE}shots/${f}.png`} alt={cap} loading="lazy" />
          <figcaption>{cap}</figcaption>
        </figure>
      ))}
    </div>
  );
}
