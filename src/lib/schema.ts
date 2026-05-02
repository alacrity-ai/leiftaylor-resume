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
    jobTitle: 'AI-Native Principal Engineer & Product-to-Production Architect',
    description:
      'I translate ambiguous business requirements into secure, scalable, revenue-producing systems — using agentic workflows to move from idea to production at exceptional speed.',
    email: `mailto:${meta.email}`,
    url: meta.siteUrl,
    image: `${meta.siteUrl}/og-image.png`,
    worksFor: {
      '@type': 'Organization',
      name: 'ConnectBase',
      url: 'https://connectbase.com',
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'San Francisco Conservatory of Music',
      url: 'https://sfcm.edu',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Greater Boston Area',
      addressRegion: 'MA',
      addressCountry: 'US',
    },
    sameAs: [meta.linkedin],
    knowsAbout: [
      'Distributed systems',
      'Cloud architecture',
      'AI systems',
      'Agentic workflows',
      'Retrieval-Augmented Generation',
      'Model Context Protocol',
      'Kubernetes',
      'Azure',
      'AWS',
      'PostgreSQL',
      'CI/CD',
      'B2B SaaS',
      'Multi-tenant platforms',
    ],
  };
}
