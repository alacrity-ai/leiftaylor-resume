/**
 * Adobe — Forward Deployed AI Engineer variant.
 *
 * Tailoring: matches Adobe's customer-embedment vocabulary, leads with
 * AI-in-production outcomes (AI matching / moderation / 0→1), introduces
 * a variant-only "Image GenAI" outcome at #4 to surface the home-lab
 * generative-AI work without making it the headline. Hello card and OG
 * tagline carry the "including pixels" wink for Adobe's creative-tools
 * domain. Career history and toolkit unchanged.
 *
 * JD: https://adobe.wd5.myworkdayjobs.com/en-US/external_experienced/job/Forward-Deployed-AI-Engineer_R158364
 * Proposal doc: docs/PROPOSED_ADOBE_RESUME.md (v3)
 */
import { RESUME } from '../resume';
import type { Variant } from '../types';

export const adobe: Variant = {
  slug: 'adobe',
  company: 'Adobe',

  hello: {
    title: 'For Adobe.',
    body:
      "The Forward Deployed AI Engineer role is a strong shape match for the way I work — one operator from first customer conversation through production deploy, then extracting platform patterns the rest of the org reuses. Four years of self-funded home-lab work shipping image-generation pipelines into real creative workflows means the customer side of the creative-tools stack isn't unfamiliar territory.",
    cta: {
      label: 'Open the JD →',
      href: 'https://adobe.wd5.myworkdayjobs.com/en-US/external_experienced/job/Forward-Deployed-AI-Engineer_R158364',
    },
  },

  resume: {
    meta: {
      titleStack: 'AI-Native Principal Engineer · Customer-Embedded',
      jobTitle: 'AI-Native Principal Engineer · Customer-Embedded',
      jobDescription:
        'I embed with enterprise customer teams to take generative AI from prototype to production — full-stack, full-lifecycle, then extract the patterns so the next engagement goes 2× faster.',
      shortDescription:
        'Customer-embedded GenAI delivery — prototype in days, productionize in weeks, with image-generation craft on the bench.',
      ogTaglineLines: [
        'Customer-embedded GenAI →',
        'production, including pixels.',
      ],
    },

    hero: {
      eyebrow: 'AI-Native Principal Engineer · Customer-Embedded',
      tagline:
        'I embed with enterprise customer teams to take generative AI from prototype to production — full-stack, full-lifecycle, then extract the patterns so the next engagement goes 2× faster.',
      body:
        'A decade of production engineering and principal architecture. Two years of daily agentic dev workflows. CTO of an AI-driven social platform shipped 0→1, founding member of an AI consulting practice that has embedded with F500 customer teams across tax-tech, computational science, and industrial chemistry, and a contributor to Open Interpreter (64k+ stars). Plus four years of generative-AI experimentation in a self-funded home lab — including production image-generation pipelines integrated into real creative workflows. The Forward Deployed brief — one operator from first customer conversation through production deploy, then extracting platform patterns — is the operating mode I already work in.',
    },

    // 9 outcomes. AI-in-production leads (#1–#3); the new Image GenAI
    // entry sits at #4 as a credential, not a headline; Manual →
    // Automated drops to keep the array length at 9.
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
        value: '0 → 1',
        label:
          'Direct-to-Supplier Ordering at ConnectBase. Greenfield concept to production in months — wholesalers and channel partners now purchase from thousands of suppliers in one interface, with AI-assisted supplier ingestion underneath.',
      },
      {
        value: 'Image GenAI',
        label:
          'Four years of self-funded image-generation R&D — production pipelines integrating inpainting, outpainting, AI upscaling, and textual-inversion-based subject consistency. Shipped into creative-asset workflows.',
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

    // Toolkit override: keep all 6 base buckets verbatim, insert
    // `Generative AI / Image` right after `AI / LLM Systems`, and append
    // `Forward-Deployed / Customer Engineering` at the end. The base
    // buckets are spread from RESUME.tech so updates to the global
    // toolkit propagate to the Adobe variant automatically — no
    // duplication. The two variant-only buckets surface depth that the
    // global résumé doesn't currently expose.
    tech: [
      RESUME.tech[0], // AI / LLM Systems (base)
      {
        label: 'Generative AI / Image',
        pills: [
          'Stable Diffusion',
          'SDXL',
          'ComfyUI',
          'Diffusers',
          'ControlNet',
          'LoRA',
          'textual inversion',
          'IP-Adapter',
          'inpainting',
          'outpainting',
          'image upscaling',
          'background removal',
        ],
      },
      ...RESUME.tech.slice(1), // Retrieval / AppEng / Cloud / Data / Reliability (base, unchanged)
      {
        label: 'Forward-Deployed / Customer Engineering',
        pills: [
          'technical discovery workshops',
          'customer co-development',
          'executive technical communication',
          'prototype-to-production delivery',
          'reusable implementation patterns',
          'playbooks',
          'product feedback synthesis',
          'rapid prototyping',
        ],
      },
    ],

    contact: {
      heading:
        'Available for Forward Deployed Engineering at Adobe, and other roles where customer-embedded GenAI delivery and production architecture converge.',
      body:
        'Greater Boston Area · Open to remote and hybrid. Best for work where frontier-model capabilities meet enterprise customer reality, where shipping a working prototype this week matters more than perfecting the spec, and where the patterns you extract become the platform the rest of the team builds on.',
    },
  },
};
