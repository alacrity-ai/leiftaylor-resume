/**
 * React context that carries the resolved variant bundle (resume + UI +
 * hello + slug + company) down the tree. Every component that reads
 * from `RESUME` or `UI` at runtime should pull from this hook so it
 * picks up variant overrides automatically.
 *
 * The default value is the base (global) bundle, so components work
 * without an explicit Provider — useful for testing and for any route
 * that doesn't mount one. The page-level shells (HomePage,
 * ResumePrint) wrap their tree in a Provider with the slug-resolved
 * bundle.
 */
import { createContext, useContext } from 'react';
import { RESUME } from './resume';
import { UI } from './ui';
import type { ResolvedVariant } from './types';

const DEFAULT_BUNDLE: ResolvedVariant = {
  resume: RESUME,
  ui: UI,
  slug: null,
  company: null,
};

export const ResumeContext = createContext<ResolvedVariant>(DEFAULT_BUNDLE);

/** Read the resolved variant bundle (resume + ui + hello + slug). */
export function useResume(): ResolvedVariant {
  return useContext(ResumeContext);
}
