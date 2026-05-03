/**
 * Single source of truth for every string on the page. Edit here.
 */

export interface GlanceItem {
  label: string;
  value: string;
}

export interface ImpactMetric {
  value: string;
  label: string;
}

export type Pillar =
  | 'Production Architecture'
  | 'Product Translation'
  | 'Agentic Velocity'
  | 'Business Outcomes';

export interface SystemCard {
  kicker: string;
  title: string;
  pillar: Pillar;
  lede: string;
  bullets: string[];
  tags: string[];
}

export interface OperatingModel {
  heading: string;
  paragraphs: string[];
}

/**
 * Experience card — used for both full-time roles and consulting/fractional
 * engagements. Cards may carry either an accomplishment list (`bullets`) or
 * a single descriptive paragraph (`description`); consulting entries
 * typically use `description`.
 */
export interface ExperienceCard {
  company: string;
  role: string;
  promotedFrom?: string;
  badge?: string;
  /** Per-card date sub-line (used inside split entries like ConnectBase). */
  dates?: string;
  bullets?: string[];
  description?: string;
  tags?: string[];
  /** Optional outbound link rendered below tags (e.g., GitHub repo). */
  link?: { href: string; label: string };
}

export interface ExperienceEntry {
  range: string;
  /** Optional override used by the print/PDF route when the displayed
   *  date precision should be richer than the website's compact `range`
   *  (e.g., website shows "2023 — Present", PDF shows "Mar 2023 — Present"). */
  pdfRange?: string;
  cards: ExperienceCard[];
}

export interface TechBucket {
  label: string;
  pills: string[];
}

export interface Section {
  /** Two-digit ordinal shown in the section index — '01', '02', etc. */
  number: string;
  /** Short label sitting next to the index in the section header. */
  label: string;
  /** Optional hardcoded H2 — only used by sections whose H2 is not already
   *  driven from another data field (e.g., OperatingModel uses
   *  `operatingModel.heading`; Contact uses `contact.heading`). */
  heading?: string;
  /** Optional descriptor paragraph rendered under the H2. */
  descriptor?: string;
}

const EXPERIENCE: ExperienceEntry[] = [
  {
    range: '2023 — Present',
    pdfRange: 'Mar 2023 — Present',
    cards: [
      {
        company: 'ConnectBase',
        role: 'Principal Engineer',
        badge: 'CURRENT',
        dates: '2025 — Present',
        bullets: [
          'Reengineered the monolithic pricing engine into a distributed worker-driven architecture (concurrent quote computation, fault isolation, horizontal scale)',
          'Modernized legacy VM-era patterns into stateless, horizontally-scalable services',
          'Chief developer and technical owner of the Direct-to-Supplier Ordering platform — wholesalers and channel partners purchase from thousands of suppliers in one interface',
          'Integrated AI-assisted workflows for supplier ingestion, semantic search, TAM analysis, and data-layer intelligence',
          'Daily use of agentic dev workflows (Claude Code, sub-agent orchestration, MCP-style tool integration) across implementation, refactoring, and architecture iteration',
          'Built and maintains the team operating patterns for AI-augmented delivery — when to delegate to an agent, where the human-in-the-loop boundary sits, how to validate generated work',
        ],
      },
      {
        company: 'ConnectBase',
        role: 'Director of DevOps',
        promotedFrom: 'Promoted to Principal Engineer',
        dates: '2023 — 2025',
        bullets: [
          'Reduced Azure spend by $50K+/month → $600K+ annualized savings, in 2 months',
          'Modernized 30+ legacy VM-hosted services into stateless, horizontally-scalable microservices',
          'Built CI/CD across 30+ heterogeneous services (Java, TypeScript / Node, Python, C#)',
          'Stood up enterprise-wide feature-flag, secrets-management, and progressive (canary) delivery infrastructure',
          'Stood up unit / functional / e2e coverage across the suite using AI-assisted test authorship',
          'Disaster-recovery and outage point person',
        ],
      },
    ],
  },
  {
    range: '2025 — 2026',
    cards: [
      {
        company: 'Chemveric',
        role: 'Technical Director',
        description:
          'Architected and led end-to-end development of a B2B SaaS cheminformatics marketplace connecting buyers and suppliers of research chemicals and materials. Multi-tenant NestJS / Postgres / RDKit / AWS, with AI-assisted ingestion, RFQ workflows, and funding-opportunity matching.',
        tags: ['NestJS', 'PostgreSQL', 'RDKit', 'AWS', 'Marketplace'],
      },
    ],
  },
  {
    range: '2022 — Present',
    cards: [
      {
        company: 'Alacrity Solutions',
        role: 'Founding Member · Principal Architect',
        description:
          'AI consulting practice helping F500s operationalize LLMs for software development, customer support, finance, compliance, and scientific data. Delivered work for global tax-tech, computational-science, and industrial-chemistry clients.',
        tags: ['RAG', 'Compliance', 'Scientific data', 'LLMs'],
      },
    ],
  },
  {
    range: '2022 — 2023',
    cards: [
      {
        company: 'Imprint.live',
        role: 'CTO · Principal Architect',
        description:
          'Led development of an AI-driven social platform — OpenAI-powered moderation, synthetic-user systems, user-value analytics for stakeholders.',
        tags: ['OpenAI', 'Moderation', 'Social platform'],
      },
    ],
  },
  {
    range: '2023 — 2024',
    cards: [
      {
        company: 'Open Interpreter',
        role: 'Contributor',
        description:
          'The desktop app for AI power users — let agents edit files, control apps, and learn new skills. Contributor to local-LLM execution patterns. 64k+ stars on GitHub.',
        tags: ['Local LLMs', 'Agentic tooling', 'Open source'],
        link: {
          href: 'https://github.com/openinterpreter/open-interpreter',
          label: 'github.com/openinterpreter/open-interpreter',
        },
      },
    ],
  },
  {
    range: '2019 — 2023',
    pdfRange: 'Jan 2019 — Mar 2023',
    cards: [
      {
        company: 'Mobile Heartbeat',
        role: 'Principal DevOps Lead',
        promotedFrom: 'Promoted from Senior DevOps Engineer',
        bullets: [
          'Designed a serverless internal application testing framework, fully Terraform-driven, integrated into CI/CD',
          'Built CI/CD for multitenant microservice apps on Azure — Terraform + Flux/Helm + Kubernetes + automated test deployment + DB bootstrapping',
          'Designed CI/CD pipelines for iOS and Android mobile applications',
          'Customer-release support across Android, iOS, and Windows platforms',
        ],
      },
    ],
  },
  {
    range: '2016 — 2019',
    pdfRange: 'Jun 2016 — Jan 2019',
    cards: [
      {
        company: 'Actifio',
        role: 'Head of DevOps',
        promotedFrom: 'Promoted from DevOps Intern → Lead → Head',
        bullets: [
          'Chief developer of the automated regression testing framework — Python/Node + Docker + Ansible + Jenkins + Robot Framework',
          'Managed 100+ dev databases (Oracle, SQL Server) and 2,000+ VMs across on-prem ESXi, Hyper-V, physical hosts, and AWS EC2',
          'Travelled to India to mentor and code-review the distributed engineering team',
          'Built developer-portal tooling: test execution, host management, log analysis',
        ],
      },
    ],
  },
];

export const RESUME = {
  meta: {
    name: 'Leif Taylor',
    titleStack:
      'AI-Native Principal Engineer · Product-to-Production Architect',
    location: 'Greater Boston Area',
    email: 'leif@alacrity.ai',
    linkedin: 'https://www.linkedin.com/in/leiftaylor/',
    calendly: 'https://calendly.com/alacrityai/30min',
    pdfHref: '/leif-taylor-resume-2026-05.pdf',
    docxHref: '/leif-taylor-resume-2026-05.docx',
    siteUrl: 'https://resume.lalalimited.com',
    lastReviewed: '2026-05-02',

    // schema.org Person fields. `jobTitle` and `jobDescription` are what
    // crawlers (Google, LinkedIn rich cards, AI training pipelines) read
    // when they index the site. Variants typically override these to
    // retune SEO for a specific role.
    jobTitle:
      'AI-Native Principal Engineer & Product-to-Production Architect',
    jobDescription:
      'I translate ambiguous business requirements into secure, scalable, revenue-producing systems — using agentic workflows to move from idea to production at exceptional speed.',
    worksFor: {
      name: 'ConnectBase',
      url: 'https://connectbase.com',
    },
    alumniOf: {
      name: 'San Francisco Conservatory of Music',
      url: 'https://sfcm.edu',
    },
    address: {
      addressLocality: 'Greater Boston Area',
      addressRegion: 'MA',
      addressCountry: 'US',
    },
    /** Shorter description used by the Twitter card (which truncates at
     *  ~200 chars on mobile). Distinct from `jobDescription` so the
     *  longer copy can stay first-person and tagline-shaped. */
    shortDescription:
      'Translates ambiguous business requirements into secure, scalable, revenue-producing systems at agentic-era speed.',

    /** Two hand-typeset lines rendered into the OG card's hero block.
     *  Hand-broken because automatic wrap of `shortDescription` doesn't
     *  produce a well-balanced visual. Variants typically override with
     *  role-tuned copy. */
    ogTaglineLines: [
      'Ambiguous business requirements →',
      'production systems, at agentic speed.',
    ] as [string, string],
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
  },

  hero: {
    eyebrow: 'AI-Native Principal Engineer · Product-to-Production Architect',
    name: 'Leif Taylor',
    tagline:
      'I translate ambiguous business requirements into secure, scalable, revenue-producing systems — using agentic workflows to move from idea to production at exceptional speed.',
    body:
      'More than a decade in production engineering, principal architecture, DevOps leadership, and AI-native delivery. I operate across product translation, full-stack implementation, infrastructure, testing, and observability. The new paradigm collapses the boundaries between those roles; this page is what one operator looks like in that paradigm.',
    nowLine:
      'NOW — Shipping the direct-to-supplier ordering platform at ConnectBase · Spearheading agentic dev workflows in production',
    glance: [
      {
        label: 'Role',
        value:
          'Principal Engineer at ConnectBase (promoted from Director of DevOps, 2023)',
      },
      { label: 'Based', value: 'Greater Boston Area' },
      {
        label: 'Operates as',
        value:
          'Hands-on technical leader — architecture, implementation, infrastructure, AI integration',
      },
      {
        label: 'Best for',
        value:
          'Companies that need product translation through production delivery, with no fidelity loss',
      },
    ] satisfies GlanceItem[],
  },

  operatingModel: {
    heading: 'How I work.',
    paragraphs: [
      'I work end-to-end. One operator across product translation, architecture, full-stack code, tests, infrastructure, and production — agentic workflows for speed, deep architectural judgment for trust.',
      'Where a 2019 team spent a quarter coordinating handoffs across specialists, I ship a working system in weeks. Same correctness bar. Same operability bar. Aimed at the business outcome the brief actually asked for.',
    ],
  } satisfies OperatingModel,

  impact: [
    {
      value: '$600K · 2 mo',
      label:
        'Azure spend reduction at ConnectBase. Same product, same headcount — architectural and operational discipline did the work, and the savings landed inside the first quarter.',
    },
    {
      value: 'Distributed CPQ',
      label:
        'Re-architected ConnectBase’s telecom CPQ engine from a coordination-heavy monolith into a distributed, worker-driven quoting platform — concurrent quote computation, fault isolation, horizontal scale, and bulk pricing across complex multi-location connectivity scenarios.',
    },
    {
      value: '0 → 1',
      label:
        'Direct-to-Supplier Ordering at ConnectBase. Greenfield concept to production in months — wholesalers and channel partners now purchase from thousands of suppliers in one interface.',
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
      value: 'AI matching',
      label:
        'Built AI-assisted supplier-matching and R&D workflow primitives for Chemveric — semantic retrieval and capability scoring across chemistry expertise, scale, geography, timelines, and regulatory constraints, with structured RFQ intelligence on top.',
    },
    {
      value: 'Multi-module IaC',
      label:
        'Built the Terraform / Kubernetes deployment substrate for Mobile Heartbeat’s modular cloud-native healthcare communication platform — repeatable provisioning, secrets, ingress, observability, and CI/CD across independently deployable clinical modules.',
    },
    {
      value: 'AI moderation',
      label:
        'Architected the trust-and-safety layer for Imprint.live, an AI-driven social platform — OpenAI-powered content classification, moderation queues, policy enforcement, human-review boundaries, and audit trails across user-generated content workflows.',
    },
    {
      value: 'Manual → Automated',
      label:
        'Took Actifio’s manual regression and feature testing into a fully automated platform — environment provisioning across a real data-center matrix: Oracle / MySQL / Postgres × RAC / single-node × 11g–18c × HP-UX / AIX / Solaris / Ubuntu / CentOS / Red Hat. Coverage and reporting baked in.',
    },
  ] satisfies ImpactMetric[],

  systems: [
    {
      kicker: 'ConnectBase',
      title: 'Distributed Pricing Engine',
      pillar: 'Production Architecture',
      lede:
        'Reengineered the monolithic pricing engine into a worker-driven microservice mesh — fault-isolated, horizontally scalable, concurrent. Work that traditionally required a small platform team.',
      bullets: [
        'Concurrent quote computation across heterogeneous supplier tariffs',
        'Fault-isolated worker model — bad inputs no longer take down the engine',
        'Horizontal scale-out path the legacy engine couldn’t support',
      ],
      tags: ['Distributed workers', 'Pricing', 'Stateless', 'Scalability'],
    },
    {
      kicker: 'ConnectBase',
      title: 'Direct-to-Supplier Ordering',
      pillar: 'Product Translation',
      lede:
        'Greenfield 0→1 — translated a multi-supplier purchasing problem into one unified interface. Chief developer and technical owner from spec through production.',
      bullets: [
        '0→1 product, greenfield architecture',
        'Multi-supplier order routing, normalization, and reconciliation',
        'Foundation for the next generation of ConnectBase commerce flows',
      ],
      tags: ['Greenfield', 'B2B Commerce', 'Multi-tenant', 'Domain modeling'],
    },
    {
      kicker: 'ConnectBase',
      title: 'AI-Driven Supplier Ingestion',
      pillar: 'Agentic Velocity',
      lede:
        'LLM-driven catalog ingestion and semantic retrieval that runs on its own — replaces what would have been an ongoing data-ops team.',
      bullets: [
        '10K+ supplier products processed weekly with no human in the loop on the happy path',
        'Semantic knowledge-base search across the entire ingested corpus',
        'Foundation for downstream intelligence: TAM, gap analysis, recommendations',
      ],
      tags: ['RAG', 'Semantic search', 'LLM workflows', 'Data ingestion'],
    },
    {
      kicker: 'ConnectBase',
      title: 'Cloud Cost Program',
      pillar: 'Business Outcomes',
      lede:
        'FinOps-style discipline across Azure — $600K saved in 2 months through architectural and configuration choices, not headcount cuts or feature freezes.',
      bullets: [
        '$50K+ monthly spend reduction',
        '$600K annualized savings',
        '~30% reduction in total cloud expenditure',
      ],
      tags: ['Azure', 'FinOps', 'Operational discipline'],
    },
  ] satisfies SystemCard[],

  experience: EXPERIENCE,

  // Toolkit — 6 buckets, ATS-friendly. Compact-but-dense per the
  // PDF feedback: explicit named technologies and patterns (vs. earlier
  // executive-summary phrasings) so recruiter ATS scanners and LLM-based
  // job-matchers see the surface without ambiguity. Same data feeds both
  // the website TechSurface and the printed PDF Toolkit.
  tech: [
    {
      label: 'AI / LLM Systems',
      pills: [
        'OpenAI',
        'Anthropic',
        'Azure OpenAI',
        'Amazon Bedrock',
        'Vertex AI',
        'Claude Code',
        'Cursor',
        'MCP',
        'LangChain',
        'LangGraph',
        'LlamaIndex',
        'tool-calling agents',
        'structured outputs',
        'function calling',
        'RAG',
        'multi-agent systems',
        'agent orchestration',
        'eval harnesses',
        'prompt-version control',
        'AI observability',
        'HITL workflows',
        'local LLMs',
        'Ollama',
        'context engineering',
      ],
    },
    {
      label: 'Retrieval / Data Intelligence',
      pills: [
        'Pinecone',
        'Weaviate',
        'Qdrant',
        'Milvus',
        'Chroma',
        'FAISS',
        'pgvector',
        'Elasticsearch / OpenSearch vector search',
        'hybrid retrieval',
        'BM25',
        'embeddings',
        'reranking',
        'cross-encoder rerankers',
        'metadata filtering',
        'chunking strategies',
        'document ingestion',
        'OCR / unstructured extraction',
        'entity resolution',
        'deduplication',
        'knowledge graphs',
        'LangSmith',
        'Langfuse',
        'RAGAS',
      ],
    },
    {
      label: 'Application Engineering',
      pills: [
        'TypeScript',
        'Node.js',
        'NestJS',
        'Express',
        'Fastify',
        'Next.js',
        'Python',
        'FastAPI',
        'Pydantic',
        'Django',
        'Java',
        'Spring Boot',
        'C#',
        '.NET',
        'ASP.NET Core',
        'React',
        'React Native',
        'Angular',
        'Svelte / SvelteKit',
        'Vite',
        'Tailwind CSS',
        'Storybook',
        'TanStack Query',
        'REST',
        'GraphQL',
        'gRPC',
        'WebSockets',
        'OpenAPI',
        'webhooks',
        'OAuth2',
        'OIDC',
        'JWT',
        'SAML',
        'SCIM',
        'API gateways',
        'idempotency',
        'rate limiting',
      ],
    },
    {
      label: 'Cloud / Platform / DevOps',
      pills: [
        'Azure',
        'AWS',
        'GCP',
        'Cloudflare',
        'Kubernetes',
        'AKS',
        'EKS',
        'ECS',
        'AWS Lambda',
        'Azure Functions',
        'Cloudflare Workers / Pages',
        'Docker',
        'Terraform',
        'Pulumi',
        'Helm',
        'Flux',
        'Argo CD',
        'Ansible',
        'Vault',
        'GitHub Actions',
        'Azure DevOps',
        'GitLab CI',
        'Jenkins',
        'CircleCI',
        'serverless',
        'service mesh',
        'platform engineering',
        'internal developer platforms',
        'golden paths',
        'Backstage',
        'feature flags',
        'progressive delivery',
        'canary deploys',
        'blue/green',
        'FinOps',
      ],
    },
    {
      label: 'Data / Distributed Systems',
      pills: [
        'PostgreSQL',
        'MySQL',
        'SQL Server',
        'Oracle',
        'CockroachDB',
        'Aurora',
        'MongoDB',
        'DynamoDB',
        'Redis',
        'Snowflake',
        'BigQuery',
        'Databricks',
        'TimescaleDB',
        'Elasticsearch',
        'Kafka',
        'RabbitMQ',
        'SQS / SNS',
        'EventBridge',
        'Temporal',
        'worker queues',
        'sagas',
        'outbox pattern',
        'CQRS',
        'event sourcing',
        'CDC',
        'dbt',
        'Airflow',
        'Spark',
        'sharding',
        'replication',
      ],
    },
    {
      label: 'Reliability / Security / Quality',
      pills: [
        'OpenTelemetry',
        'Datadog',
        'Prometheus',
        'Grafana',
        'distributed tracing',
        'structured logging',
        'SLOs / SLIs',
        'error budgets',
        'incident command',
        'postmortems',
        'runbooks',
        'on-call',
        'DR',
        'load testing',
        'k6',
        'OWASP Top 10',
        'IAM',
        'RBAC / ABAC',
        'zero trust',
        'secrets management',
        'audit logging',
        'PII handling',
        'supply-chain security',
        'Jest',
        'Vitest',
        'Pytest',
        'Playwright',
        'AI-assisted test authorship',
        'LLM regression evals',
        'golden datasets',
      ],
    },
  ] satisfies TechBucket[],

  contact: {
    heading:
      'Available for principal architecture, AI systems strategy, and fractional technical leadership.',
    body:
      'Greater Boston Area · Open to remote and hybrid engagements. Best for complex cloud, AI, product, and delivery work where architecture and business outcomes converge.',
    githubNote:
      'Code samples available on request — most repositories are private under client NDAs.',
  },

  background:
    'B.M. Composition, Music Theory, Piano — San Francisco Conservatory of Music, 2009.',

  // High-signal toolkit pills that the build-time ATS check must find in
  // the rendered PDF. Subset of the flat union of every `tech[*].pills`
  // list. Variants can replace this wholesale to retune the ATS bar for
  // a specific role (e.g., an AI-lab variant might emphasise different
  // pills than a platform-engineering one).
  atsFeaturedPills: [
    'OpenAI',
    'Anthropic',
    'LangChain',
    'LangGraph',
    'MCP',
    'RAG',
    'Pinecone',
    'pgvector',
    'NestJS',
    'FastAPI',
    'Spring Boot',
    'Kubernetes',
    'Terraform',
    'GitHub Actions',
    'Kafka',
    'Snowflake',
    'PostgreSQL',
    'OpenTelemetry',
    'OAuth2',
    'OWASP',
    'Playwright',
  ] satisfies string[],

  sections: {
    operatingModel: {
      number: '01',
      label: 'How I work',
    },
    impact: {
      number: '02',
      label: 'Outcomes',
    },
    systems: {
      number: '03',
      label: 'Selected systems',
      heading: 'Selected architecture & delivery work.',
      descriptor:
        'A handful of named systems with the operational and business problems they solved. Implementation details are in the experience section below.',
    },
    experience: {
      number: '04',
      label: 'Experience',
      heading: 'Experience.',
      descriptor:
        'Production engineering, principal architecture, DevOps leadership, and consulting — in date order.',
    },
    tech: {
      number: '05',
      label: 'Toolkit',
      heading: 'Toolkit.',
    },
    contact: {
      number: '06',
      label: 'Contact',
    },
  } satisfies Record<string, Section>,
};
