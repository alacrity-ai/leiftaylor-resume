/**
 * Shared helpers used by both the print/PDF route and the DOCX generator.
 * Keeps the partitioning predicate and URL-label helpers in one place so
 * the website, PDF, and DOCX agree on how to slice and present the same
 * RESUME data.
 */
import type { ExperienceEntry } from './resume';

/**
 * Primary employment cards carry a `bullets` accomplishment list on the
 * first card. Consulting / fractional cards carry a `description`
 * paragraph instead. The website timeline renders both in date order;
 * the PDF and DOCX split them into two sections.
 */
export function isPrimaryEmployment(entry: ExperienceEntry): boolean {
  return Array.isArray(entry.cards[0]?.bullets);
}

/** Strip protocol + trailing slash from a site URL for display labels. */
export function siteHostLabel(siteUrl: string): string {
  return siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

/** "https://www.linkedin.com/in/leiftaylor/" → "linkedin.com/in/leiftaylor" */
export function linkedinLabel(linkedinUrl: string): string {
  return linkedinUrl
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');
}

/**
 * Pull the start year from a `dates` string like "2025 — Present" or
 * "2023 — 2025". Used to decorate the cross-card promotion connector
 * with the year the next role began.
 */
export function startYearFromDates(dates: string | undefined): string | null {
  if (!dates) return null;
  const m = dates.match(/(\d{4})/);
  return m ? m[1] : null;
}

/**
 * Title-case a label for use as a PDF section heading. The website's
 * SectionIndex labels are deliberately sentence-cased ("How I work"); the
 * PDF wants title case ("How I Work") for section heads.
 */
export function titleCaseLabel(s: string): string {
  return s.replace(/\b([a-z])/g, (_, c: string) => c.toUpperCase());
}
