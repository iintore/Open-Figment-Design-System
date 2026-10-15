"""Builds the site's content from the Open Figment app and the sources in source/.

  OPEN_FIGMENT_APP=../Open-Figment python3 scripts/build_content.py

Reads:   <app>/src/index.css (the app's real tokens and component styles; the app checkout is
         $OPEN_FIGMENT_APP, by default ../Open-Figment next to this repository)
         source/*.md, source/markup/*.json, source/icons.json
         scripts/components_*.py (component and block specs: previews + guidelines)
Writes:  public/ds/tokens.css, public/ds/bundle.css (styles for live previews)
         src/content/content.json (every page, the navigation, tokens and icons)

Refresh source/markup and icons.json from the running app first with `npm run capture`
when components change.
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
DOCS = os.path.dirname(HERE)
APP = os.path.abspath(os.environ.get('OPEN_FIGMENT_APP', os.path.join(os.path.dirname(DOCS), 'Open-Figment')))
SOURCE = os.path.join(DOCS, 'source')
sys.path.insert(0, HERE)
from components_primitives import C  # noqa: E402
from components_blocks import B  # noqa: E402
from lib import ICONS  # noqa: E402

css_path = os.path.join(APP, 'src', 'index.css')
if not os.path.exists(css_path):
    sys.exit(f'Open Figment app not found at {APP}. Clone https://github.com/iintore/Open-Figment and set OPEN_FIGMENT_APP to its folder.')
css = open(css_path).read()


# ---------------------------------------------------------------- CSS parsing
def blocks(text):
    out, i, n = [], 0, len(text)
    while i < n:
        j = text.find('{', i)
        if j < 0:
            break
        prelude, depth, k = text[i:j].strip(), 1, j + 1
        while depth and k < n:
            depth += {'{': 1, '}': -1}.get(text[k], 0)
            k += 1
        out.append((prelude, text[j + 1:k - 1]))
        i = k
    return out


strip_comments = lambda t: re.sub(r'/\*.*?\*/', '', t, flags=re.S)


def decls(body):
    return {k.strip(): v.strip() for k, v in (p.split(':', 1) for p in strip_comments(body).split(';') if ':' in p)}


raw_blocks = blocks(css)
light = decls(next(b for p, b in raw_blocks if p.endswith(':root') and '--color-bg' in b))
dark = decls(next(b for p, b in raw_blocks if p == "[data-theme='dark']" and '--color-bg' in b))

# ---------------------------------------------------------------- Tokens
TOKENS = json.load(open(os.path.join(SOURCE, 'tokens.json')))
# Colour values always come from the stylesheet, so the docs can't drift from the app.
for t in TOKENS['color']['tokens']:
    t['value'] = {'light': light['--' + t['name']].lower(), **({'dark': dark['--' + t['name']].lower()} if '--' + t['name'] in dark else {})}
for t in TOKENS['shadow']['tokens']:
    t['value'] = {'light': light['--' + t['name']], 'dark': dark['--' + t['name']]}
missing = [k[2:] for k in light if k.startswith('--color-') and k[2:] not in {t['name'] for t in TOKENS['color']['tokens']}]
if missing:
    sys.exit(f'Colour tokens without a usage note in source/tokens.json: {missing}')


def tokens_css():
    col, sh = TOKENS['color']['tokens'], TOKENS['shadow']['tokens']
    lines = ['/* Open Figment tokens, generated from the app\'s src/index.css by scripts/build_content.py */', ':root, :host, [data-theme="light"] {']
    lines += [f"  --{t['name']}: {t['value']['light']};" for t in col + sh]
    lines += ['}', '[data-theme="dark"] {']
    lines += [f"  --{t['name']}: {t['value']['dark']};" for t in col + sh if 'dark' in t['value']]
    lines += ['}', ':root, :host {']
    lines += [f"  --{t['name']}: {t['value']};" for fam in ('spacing', 'radius') for t in TOKENS[fam]['tokens']]
    lines += [f'  --font-{k}: {v};' for k, v in TOKENS['type']['families'].items()]
    lines.append('}')
    for f in TOKENS['type']['fonts']:
        lines.append(f"@font-face {{ font-family: '{f['family']}'; src: url('{f['file']}') format('woff2'); font-weight: {f['weight']}; font-style: {f['style']}; font-display: swap; }}")
    return '\n'.join(lines) + '\n'


# ---------------------------------------------------------------- Component styles for previews
STATE = [(r':hover', '.is-hover'), (r':active', '.is-pressed'), (r':focus-within', '.is-focus'), (r':focus-visible', '.is-focus'), (r':focus\b', '.is-focus')]


def force_states(prelude):
    sels = [s.strip() for s in prelude.split(',')]
    extra = []
    for s in sels:
        t = s
        for pat, cls in STATE:
            t = re.sub(pat, cls, t)
        if t != s and t not in sels:
            extra.append(t)
    return ', '.join(sels + extra)


def emit(bl, indent=''):
    res = []
    for prelude, body in bl:
        p = strip_comments(prelude).strip()
        if p.startswith(('@font-face', '@import')):
            continue
        if p.startswith(('@media', '@supports')):
            inner = emit(blocks(body), indent + '  ')
            if inner.strip():
                res.append(f'{indent}{p} {{\n{inner}\n{indent}}}')
            continue
        if p.startswith('@keyframes'):
            res.append(f'{indent}{p} {{{body}}}')
            continue
        if p in (':root', "[data-theme='dark']") and '--color-bg' in body:
            continue
        if re.fullmatch(r'html,\s*body,\s*#root', p):
            continue
        res.append(f'{indent}{force_states(p)} {{{body}}}')
    return '\n'.join(res)


def bundle_css():
    imports = re.findall(r'^@import url\([^)]*\);', css, flags=re.M)
    head = ['/* Open Figment component styles: src/index.css without its tokens (see tokens.css).',
            '   .is-hover / .is-pressed / .is-focus mirror :hover / :active / :focus so previews show states at rest.',
            '   Generated by scripts/build_content.py. */'] + imports
    head.append(''':root, :host {
  --font: var(--font-sans);
  --text-body-medium: 450 11px/16px var(--font);
  --text-body-medium-strong: 550 11px/16px var(--font);
  --text-body-large: 450 13px/22px var(--font);
  --text-body-large-strong: 550 13px/22px var(--font);
  --text-heading-small: 550 13px/22px var(--font);
  --text-heading-medium: 550 15px/25px var(--font);
  --text-heading-large: 550 24px/32px var(--font);
}''')
    return '\n'.join(head + [emit(raw_blocks), open(os.path.join(HERE, 'ds-helpers.css')).read()]) + '\n'


# ---------------------------------------------------------------- Pages
def md_doc(name):
    """A source page: '# Title', a one-paragraph lead, then the body."""
    text = open(os.path.join(SOURCE, name + '.md')).read()
    title = re.match(r'# (.*)', text).group(1)
    rest = text.split('\n', 1)[1].strip()
    lead, body = (rest.split('\n\n', 1) + [''])[:2]
    return {'title': title, 'lead': lead.strip(), 'md': body.strip()}


def section(md, title, level=2):
    h = '#' * level
    m = re.search(rf'^{h} {re.escape(title)}\n(.*?)(?=^#{{1,{level}}} |\Z)', md, flags=re.M | re.S)
    return m.group(1).strip() if m else ''


def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', re.sub(r'(?<=[a-z])(?=[A-Z])', '-', s).lower()).strip('-')


CELL = re.compile(r'<div class="ds-cell ?([^"]*)">(.*?)<span class="ds-label"><b>(.*?)</b>(?: <span>(.*?)</span>)?</span></div>', re.S)


def examples_of(preview):
    """Splits a spec preview (a stage of labelled cells) into examples."""
    return [{'title': m.group(3), 'sub': m.group(4) or '', 'html': m.group(2).strip(), 'fill': 'fill' in m.group(1)} for m in CELL.finditer(preview)]


STATES = {'default', 'hover', 'focus', 'selected', 'active', 'hidden', 'disabled', 'pressed', 'mixed', 'open', 'checked', 'unchecked',
          'current page', 'inactive', 'off', 'on', 'empty', 'filled', 'caret hover', 'child of selected', 'instance (selected)',
          'drop inside', 'drop before', 'starred', 'muted', 'small', 'label', 'confirmation', 'error'}


def group_states(examples):
    """Puts a variant with its states in one example, and lone states in one "States" example."""
    out, by_base = [], {}
    for e in examples:
        base, _, state = e['title'].partition(' · ')
        if state and base in by_base:
            by_base[base]['states'].append((state[:1].upper() + state[1:], e['html']))
            continue
        item = {'title': e['title'], 'sub': e['sub'], 'states': [('Default', e['html'])], 'fill': e['fill']}
        by_base[e['title']] = item
        out.append(item)
    lone = [it for it in out if it['title'].lower() in STATES and len(it['states']) == 1]
    if len(lone) >= 3:
        first = out.index(lone[0])
        cells = ''.join(f'<div class="ds-cell">{it["states"][0][1]}<span class="ds-label">{it["title"]}</span></div>' for it in lone)
        merged = {'title': 'States', 'sub': ' · '.join(it['title'] for it in lone), 'states': [('States', f'<div class="ds-stage tight">{cells}</div>')], 'fill': False}
        out = [it for it in out if it not in lone]
        out.insert(first, merged)
    res = []
    for it in out:
        if len(it['states']) == 1:
            res.append({'title': it['title'], 'sub': it['sub'], 'html': it['states'][0][1], 'fill': it['fill']})
        else:
            cells = ''.join(f'<div class="ds-cell">{h}<span class="ds-label">{lbl}</span></div>' for lbl, h in it['states'])
            res.append({'title': it['title'], 'sub': ' · '.join(l for l, _ in it['states']), 'html': f'<div class="ds-stage tight">{cells}</div>', 'fill': it['fill']})
    return res


brand = open(os.path.join(SOURCE, 'brand-book.md')).read()
vf = section(brand, 'Visual foundations')
pages = {'introduction': {**md_doc('introduction'), 'source': 'source/introduction.md', 'hero': open(os.path.join(SOURCE, 'cover.html')).read()}, 'installation': {**md_doc('installation'), 'source': 'source/installation.md'}}
F = [
    ('color', 'Color', 'Two themes from one set of names. Neutral surfaces, one blue for action and selection, one purple for components, red only for destruction.', section(vf, 'Colour', 3), 'colors'),
    ('typography', 'Typography', 'Inter at interface sizes, in two weights, with Roboto Mono for code.', section(vf, 'Typography', 3), 'type'),
    ('spacing', 'Spacing & size', 'Fixed control sizes and a small set of gaps keep dense panels aligned.', section(vf, 'Space and size', 3) + '\n\n' + section(vf, 'Layout', 3), 'spacing'),
    ('radius', 'Radius', 'Five pixels for controls, thirteen for floating surfaces, round for people.', section(vf, 'Radius', 3), 'radius'),
    ('elevation', 'Elevation', 'Hairlines separate panels; only floating surfaces cast shadows.', section(vf, 'Borders, elevation and layering', 3), 'elevation'),
    ('states', 'States & motion', 'Every interactive component shares the same set of states, and motion stays functional.', section(vf, 'States', 3) + '\n\n### Motion\n' + section(vf, 'Motion', 3), None),
    ('iconography', 'Iconography', 'One outline icon set: 24px grid, 1px round strokes, a 12px live area.', section(brand, 'Iconography'), 'icons'),
    ('logo', 'Logo', 'The Figment monkey: a flat, friendly mark on a yellow tile.', md_doc('logo')['md'], 'logo'),
    ('layout', 'Editor layout', 'How the blocks fit together around the canvas.', md_doc('editor-layout')['md'], 'screens'),
    ('writing', 'Writing', 'A capable colleague: short, literal and calm.', section(brand, 'Content fundamentals'), None),
    ('accessibility', 'Accessibility', 'Names for every control, keyboard paths through menus, and honest contrast numbers.', section(brand, 'Accessibility'), None),
]
FOUNDATION_SOURCE = {'logo': 'source/logo.md', 'layout': 'source/editor-layout.md'}
for key, title, lead, md, kind in F:
    pages['foundations/' + key] = {'title': title, 'lead': lead, 'md': md, 'source': FOUNDATION_SOURCE.get(key, 'source/brand-book.md'), **({'kind': kind} if kind else {})}

for spec in C + B:
    body = re.sub(r'^# .*\n+', '', spec['readme'].strip())
    summary, rest = (body.split('\n\n', 1) + [''])[:2]
    is_block = spec['group'] == 'Blocks'
    ex = examples_of(spec['preview'])
    pages[('blocks/' if is_block else 'components/') + slug(spec['name'])] = {
        'title': spec['name'], 'lead': summary.strip(), 'md': rest.strip(), 'kind': 'block' if is_block else 'component', 'group': spec['group'],
        'examples': (ex if is_block else group_states(ex)) or None, 'full': spec['preview'], 'width': spec.get('width'), 'height': spec['height'],
        'source': 'scripts/components_blocks.py' if is_block else 'scripts/components_primitives.py',
    }

# ---------------------------------------------------------------- Navigation
COMPONENT_GROUPS = ['Actions', 'Inputs', 'Navigation', 'Overlays', 'Feedback', 'Content']
BLOCK_GROUPS = {
    'Shell': ['TabBar', 'Toolbar', 'NavigationRail', 'PresenterBar', 'ErrorScreen'],
    'Panels': ['FilePanel', 'AgentsPanel', 'AssetsPanel', 'ToolsPanel', 'PropertiesPanel', 'ComponentProperties', 'CanvasProperties', 'PrototypePanel', 'InspectPanel', 'CommentsPanel'],
    'Views': ['ColorPicker', 'ShortcutsDialog', 'VariablesView', 'HomeScreen'],
}
item = lambda k: {'title': pages[k]['title'], 'path': k}
nav = [
    {'label': 'Getting started', 'icon': 'sparkle', 'items': [item('introduction'), item('installation')]},
    {'label': 'Foundations', 'icon': 'style', 'items': [item('foundations/' + k) for k, *_ in F]},
    {'label': 'Components', 'icon': 'component', 'sub': [
        {'label': g, 'items': [item(k) for k in sorted(k for k, p in pages.items() if k.startswith('components/') and p['group'] == g)]} for g in COMPONENT_GROUPS]},
    {'label': 'Blocks', 'icon': 'panel', 'sub': [{'label': g, 'items': [item('blocks/' + slug(n)) for n in names]} for g, names in BLOCK_GROUPS.items()]},
]
listed = {i['path'] for g in nav for i in g.get('items', []) + [x for s in g.get('sub', []) for x in s['items']]}
unlisted = sorted(set(pages) - listed)
if unlisted:
    sys.exit(f'Pages missing from the navigation: {unlisted}')

# ---------------------------------------------------------------- Write
ds = os.path.join(DOCS, 'public', 'ds')
os.makedirs(ds, exist_ok=True)
open(os.path.join(ds, 'tokens.css'), 'w').write(tokens_css())
open(os.path.join(ds, 'bundle.css'), 'w').write(bundle_css())
os.makedirs(os.path.join(DOCS, 'src', 'content'), exist_ok=True)
json.dump({'pages': pages, 'nav': nav, 'tokens': TOKENS, 'icons': ICONS}, open(os.path.join(DOCS, 'src', 'content', 'content.json'), 'w'), ensure_ascii=False)
print(f'{len(pages)} pages, {sum(len(p.get("examples") or []) for p in pages.values())} examples')
