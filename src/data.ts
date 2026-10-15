import content from './content/content.json';

export interface Example {
  title: string;
  sub: string;
  html: string;
  fill: boolean;
}

export interface Page {
  path: string;
  title: string;
  lead: string;
  md: string;
  kind?: 'component' | 'block' | 'colors' | 'type' | 'spacing' | 'radius' | 'elevation' | 'icons' | 'logo' | 'screens';
  group?: string;
  examples?: Example[] | null;
  full?: string;
  width?: number | null;
  height?: number;
  stageClass?: string;
  /** Cover markup shown above the title (Introduction). */
  hero?: string;
  /** Repository file that holds this page's content. */
  source?: string;
  section: string;
  /** Sidebar sub-group (Actions, Inputs… for components; Shell, Panels, Views for blocks). */
  subsection?: string;
}

export interface NavItem {
  title: string;
  path: string;
}
export interface NavGroup {
  label: string;
  icon: string;
  items?: NavItem[];
  sub?: { label: string; items: NavItem[] }[];
}

/** Pages in navigation order, each tagged with its sidebar section. */
export function allPages(): Page[] {
  const raw = content.pages as Record<string, Omit<Page, 'path' | 'section'>>;
  const out: Page[] = [];
  for (const g of content.nav as NavGroup[]) {
    for (const it of g.items ?? []) out.push({ ...raw[it.path], path: it.path, section: g.label } as Page);
    for (const s of g.sub ?? []) for (const it of s.items) out.push({ ...raw[it.path], path: it.path, section: g.label, subsection: s.label } as Page);
  }
  return out;
}

/** The headings a page's outline lists, in order. */
export function headingsOf(md: string): { id: string; text: string; level: number }[] {
  const out: { id: string; text: string; level: number }[] = [];
  for (const line of md.split('\n')) {
    const m = /^(#{2,3}) (.*)$/.exec(line);
    if (m) {
      const text = m[2].replace(/[`*]/g, '');
      out.push({ id: text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), text, level: m[1].length });
    }
  }
  return out;
}
