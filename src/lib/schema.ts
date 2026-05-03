/**
 * schema.org Person JSON-LD builder. Used at prerender time to inject a
 * <script type="application/ld+json"> block into the static HTML.
 */
import type { RESUME } from '@/content/resume';

type Meta = (typeof RESUME)['meta'];

export function personSchema(meta: Meta) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: meta.name,
    jobTitle: meta.jobTitle,
    description: meta.jobDescription,
    email: `mailto:${meta.email}`,
    url: meta.siteUrl,
    image: `${meta.siteUrl}/og-image.png`,
    worksFor: {
      '@type': 'Organization',
      name: meta.worksFor.name,
      url: meta.worksFor.url,
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: meta.alumniOf.name,
      url: meta.alumniOf.url,
    },
    address: {
      '@type': 'PostalAddress',
      ...meta.address,
    },
    sameAs: [meta.linkedin],
    knowsAbout: meta.knowsAbout,
  };
}
