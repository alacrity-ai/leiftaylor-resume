/**
 * Anthropic — Forward-Deployed Engineer variant.
 *
 * Tailoring: leads with AI-relevant outcomes (AI matching / moderation /
 * structured retrieval), retunes the hero around frontier-model-into-
 * production framing, and addresses Anthropic directly via the hello
 * card. Career history is unchanged — the override is positioning, not
 * facts.
 */
import type { Variant } from '../types';

export const anthropic: Variant = {
  slug: 'anthropic',
  company: 'Anthropic',

  hello: {
    title: 'For Anthropic.',
    body:
      'The Forward-Deployed Engineer role caught my eye — connecting frontier models to real production systems is exactly the operating mode this résumé argues for. Here’s the version of me tailored to that role.',
    cta: {
      label: 'Open the JD →',
      href: 'https://www.anthropic.com/jobs',
    },
  },

  resume: {
    meta: {
      titleStack: 'AI-Native Principal Engineer · Forward-Deployed',
      jobTitle: 'AI-Native Principal Engineer · Forward-Deployed',
      jobDescription:
        'I take frontier-model capabilities into production systems — full-stack, full-lifecycle, with the architectural judgment to keep the output trustworthy.',
      shortDescription:
        'Frontier models into production systems — full-stack, full-lifecycle, with judgment intact.',
      ogTaglineLines: [
        'Frontier models →',
        'production systems, with judgment.',
      ],
    },

    hero: {
      eyebrow: 'AI-Native Principal Engineer · Forward-Deployed',
      tagline:
        'I take frontier-model capabilities into production systems — full-stack, full-lifecycle, with the architectural judgment to keep the output trustworthy.',
      body:
        'A decade of production engineering and principal architecture, two years of daily agentic dev workflows, and shipped AI systems across moderation, semantic retrieval, supplier ingestion, and structured RFQ intelligence. The Forward-Deployed brief is one operator from product translation to production — that’s the operating mode I already work in.',
    },

    // Impact reordered to lead with AI-relevant outcomes. Same 9 items
    // as base — only the order differs.
    impact: [
      {
        value: 'AI matching',
        label:
          'Built AI-assisted supplier-matching and R&D workflow primitives for Chemveric — semantic retrieval and capability scoring across chemistry expertise, scale, geography, timelines, and regulatory constraints, with structured RFQ intelligence on top.',
      },
      {
        value: 'AI moderation',
        label:
          'Architected the trust-and-safety layer for Imprint.live, an AI-driven social platform — OpenAI-powered content classification, moderation queues, policy enforcement, human-review boundaries, and audit trails across user-generated content workflows.',
      },
      {
        value: '1M+ products',
        label:
          'Architected the data and search layer for Chemveric’s B2B chemical marketplace — multi-source ingestion, CAS-aware catalog normalization, faceted discovery, and structured search across millions of products and thousands of supplier records.',
      },
      {
        value: 'Email → RFQ',
        label:
          'Converted fragmented pharma procurement (emails, spreadsheets, vendor portals) into a structured RFQ workflow at Chemveric — buyer/supplier portals, RFQ lifecycle state, quote normalization, side-by-side comparison, and procurement audit trail.',
      },
      {
        value: '0 → 1',
        label:
          'Direct-to-Supplier Ordering at ConnectBase. Greenfield concept to production in months — wholesalers and channel partners now purchase from thousands of suppliers in one interface, with AI-assisted supplier ingestion underneath.',
      },
      {
        value: 'Distributed CPQ',
        label:
          'Re-architected ConnectBase’s telecom CPQ engine from a coordination-heavy monolith into a distributed, worker-driven quoting platform — concurrent quote computation, fault isolation, horizontal scale, and bulk pricing across complex multi-location connectivity scenarios.',
      },
      {
        value: '$600K · 2 mo',
        label:
          'Azure spend reduction at ConnectBase. Same product, same headcount — architectural and operational discipline did the work, and the savings landed inside the first quarter.',
      },
      {
        value: 'Multi-module IaC',
        label:
          'Built the Terraform / Kubernetes deployment substrate for Mobile Heartbeat’s modular cloud-native healthcare communication platform — repeatable provisioning, secrets, ingress, observability, and CI/CD across independently deployable clinical modules.',
      },
      {
        value: 'Manual → Automated',
        label:
          'Took Actifio’s manual regression and feature testing into a fully automated platform — environment provisioning across a real data-center matrix: Oracle / MySQL / Postgres × RAC / single-node × 11g–18c × HP-UX / AIX / Solaris / Ubuntu / CentOS / Red Hat. Coverage and reporting baked in.',
      },
    ],

    contact: {
      heading:
        'Available for Forward-Deployed Engineering at Anthropic, and other roles where production-grade AI architecture and product translation converge.',
      body:
        'Greater Boston Area · Open to remote and hybrid. Best for work where frontier-model capabilities meet production systems, customer integration, and the architectural judgment to keep results trustworthy.',
    },
  },
};
