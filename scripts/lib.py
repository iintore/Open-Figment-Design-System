"""Helpers for building component previews from markup captured from the running app (source/markup)."""
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
SOURCE = os.path.join(HERE, '..', 'source')
CAP = os.path.join(SOURCE, 'markup')
ICONS = json.load(open(os.path.join(SOURCE, 'icons.json')))


def cap(name, field='html'):
    return json.load(open(os.path.join(CAP, name + '.json')))[field]


def cap_parts(name):
    """A capture taken with all=True: one element per line."""
    return cap(name).split('\n')


def icon(name):
    return ICONS[name]


def strip_style(html, prop):
    """Removes one inline style property (e.g. a fixed left/top from the live app)."""
    return re.sub(r'(style="[^"]*?)' + re.escape(prop) + r':[^;"]*;?\s*', r'\1', html)


def root_class(html, add='', remove=''):
    """Adds/removes classes on the first element of a snippet."""
    m = re.match(r'(\s*<[a-z0-9-]+)([^>]*)>', html)
    tag, attrs = m.group(1), m.group(2)
    cm = re.search(r'class="([^"]*)"', attrs)
    classes = cm.group(1).split() if cm else []
    classes = [c for c in classes if c not in remove.split()] + [c for c in add.split() if c and c not in classes]
    new_attr = f' class="{" ".join(classes)}"'
    attrs = re.sub(r'\s*class="[^"]*"', '', attrs) if cm else attrs
    return f'{tag}{new_attr}{attrs}>' + html[m.end():]


def cell(label, html, sub='', cls=''):
    sub = f' <span>{sub}</span>' if sub else ''
    return f'<div class="ds-cell {cls}">{html}<span class="ds-label"><b>{label}</b>{sub}</span></div>'


def stage(*cells, cls=''):
    return f'<div class="ds-stage {cls}">' + ''.join(cells) + '</div>'
