import type { ReactNode } from 'react';
import content from './content/content.json';

// The docs chrome uses the app's own outline icons (exported into content.json), plus a few
// drawn on the same grid (1px round strokes, 24 × 24) for things the editor doesn't need.
const APP = content.icons as Record<string, string>;

export const S = ({ children }: { children: ReactNode }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {children}
  </svg>
);

/** An icon from the app's set, by name. */
export function AppIcon({ name }: { name: string }) {
  const svg = APP[name];
  if (!svg) return null;
  return <span className="doc-icon" aria-hidden dangerouslySetInnerHTML={{ __html: svg }} />;
}
