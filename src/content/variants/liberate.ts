/**
 * Liberate — Principal FDE, AI Agent Engineering variant.
 *
 * Tailoring: Liberate sells a "system of action" for insurance — voice/contact-
 * center agents in front of operational workflows, writing back into agency /
 * carrier core systems. The hard problems are deterministic orchestration
 * around stochastic agents, eval coverage, integration discipline, and
 * post-launch tuning per customer. This variant leads with the FDE shape
 * match (0 → 1 Direct-to-Supplier — the primer's named closest analogue),
 * follows with the AI-in-production cluster, and folds the agent-systems
 * framing into the operating-model paragraphs. Adds one variant-only toolkit
 * bucket (Agent Reliability / Eval Discipline). Voice-AI / VoIP /
 * insurance-core-system pills are deliberately not claimed — adjacency
 * comes from the regulated-ops breadth (telecom, healthcare, pharma,
 * moderation), not from invented domain experience.
 *
 * Hello card has no CTA — the only public posting is the Director role we
 * are not targeting. Send the URL directly to your Liberate contact.
 *
 * Source primer: docs/LIBERATE.md
 * Proposal doc:  docs/PROPOSED_LIBERATE_RESUME.md (v1)
 */
import { RESUME } from '../resume';
import type { Variant } from '../types';

export const liberate: Variant = {
  slug: 'liberate',
  company: 'Liberate',

  hello: {
    title: 'For Liberate.',
    body:
      "The Principal FDE — AI Agent Engineering role is a strong shape match for the way I work — converting messy domain workflows into production-grade agent systems without losing correctness, auditability, or deployment velocity. Regulated-ops adjacency comes from a decade across telecom commerce, healthcare communications, pharma procurement, and AI moderation; insurance is the new domain, but the risk posture is familiar territory.",
  },

  resume: {
    meta: {
      titleStack: 'AI-Native Principal Engineer · Forward-Deployed Agent Systems',
      jobTitle: 'AI-Native Principal Engineer · Forward-Deployed Agent Systems',
      jobDescription:
        'I translate ambiguous business workflows into production-grade agent systems — evaluated, observable, integrated — with deterministic boundaries around the nondeterministic parts.',
      shortDescription:
        'Messy operational workflows → production agent systems with eval coverage, observability, and integration discipline.',
      ogTaglineLines: [
        'Messy domain workflows →',
        'evaluated, observable agents.',
      ],
    },

    hero: {
      eyebrow: 'AI-Native Principal Engineer · Forward-Deployed Agent Systems',
      tagline:
        'I translate ambiguous business workflows into production-grade agent systems — evaluated, observable, integrated — with deterministic boundaries around the nondeterministic parts.',
      body:
        'A decade of production engineering and principal architecture. Two years of daily agentic dev workflows. CTO of an AI-driven social platform shipped 0→1, founding member of an AI consulting practice that has embedded with F500 customer teams across tax-tech, computational science, and industrial chemistry, and a contributor to Open Interpreter (64k+ stars). Production AI shipped across moderation, semantic retrieval, supplier ingestion, and structured RFQ intelligence — each with eval coverage, audit trails, and human-in-the-loop boundaries baked in, not bolted on. The Principal FDE AI Agent Engineering brief — one operator from first customer conversation through production deploy of an evaluated agent workflow, then extracting platform patterns the rest of the team reuses — is the operating mode I already work in.',
    },

    operatingModel: {
      heading: 'How I work.',
      paragraphs: [
        'I work end-to-end. One operator across product translation, architecture, full-stack code, tests, infrastructure, and production — agentic workflows for speed, deep architectural judgment for trust.',
        "Production AI is not a prompt — it's an evaluated, observable, tool-using workflow with deterministic boundaries around nondeterministic reasoning. The hard part isn't the model call; it's the integration discipline against legacy systems, the eval coverage that survives customer review, the audit trail, and the human-in-the-loop boundaries that make the output trustworthy.",
        'Where a 2019 team spent a quarter coordinating handoffs across specialists, I ship a working system in weeks. Same correctness bar. Same operability bar. Same auditability bar. Aimed at the business outcome the brief actually asked for.',
      ],
    },

    // 8 outcomes. 0 → 1 Direct-to-Supplier leads (primer's named closest
    // FDE analogue). AI cluster follows. Manual → Automated dropped to
    // hold the array at 8 (matches the Adobe variant's drop).
    impact: [
      {
        value: '0 → 1',
        label:
          'Direct-to-Supplier Ordering at ConnectBase. Greenfield concept to production in months — wholesalers and channel partners now purchase from thousands of suppliers in one interface, with AI-assisted supplier ingestion underneath.',
      },
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
        value: 'Email → RFQ',
        label:
          'Converted fragmented pharma procurement (emails, spreadsheets, vendor portals) into a structured RFQ workflow at Chemveric — buyer/supplier portals, RFQ lifecycle state, quote normalization, side-by-side comparison, and procurement audit trail.',
      },
      {
        value: '1M+ products',
        label:
          'Architected the data and search layer for Chemveric’s B2B chemical marketplace — multi-source ingestion, CAS-aware catalog normalization, faceted discovery, and structured search across millions of products and thousands of supplier records.',
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
    ],

    // Toolkit override: keep all 6 base buckets verbatim, insert one
    // variant-only bucket — `Agent Reliability / Eval Discipline` — right
    // after `AI / LLM Systems`. Pills focus on agent-system patterns
    // Liberate's FDE function buys for, deliberately not duplicating the
    // lower-level primitives already in base (`eval harnesses`,
    // `LLM regression evals`, `golden datasets`, `audit logging`,
    // `PII handling`). Voice/VoIP/insurance-core-system pills are
    // deliberately omitted — no flagged production experience to claim.
    tech: [
      RESUME.tech[0], // AI / LLM Systems (base)
      {
        label: 'Agent Reliability / Eval Discipline',
        pills: [
          'agent eval harnesses',
          'task-completion evals',
          'workflow orchestration',
          'escalation boundaries',
          'deployment gating',
          'staged agent rollout',
          'transcript audit trails',
          'per-customer tuning',
          'platform pattern extraction',
        ],
      },
      ...RESUME.tech.slice(1), // Retrieval / AppEng / Cloud / Data / Reliability (base, unchanged)
    ],

    contact: {
      heading:
        'Available for Principal FDE — AI Agent Engineering at Liberate, and other roles where production agent systems and integration-heavy operational SaaS converge.',
      body:
        'Greater Boston Area · Open to remote and hybrid. Best for work where messy operational workflows need to become evaluated, observable, integrated agent systems — and where the patterns extracted from the first customer engagement become the platform the rest of the team reuses.',
    },
  },
};
