/**
 * The PDF-shaped layout. Reads the same RESUME content data the website
 * uses but renders it for paper — single column, dense typography, page-
 * break-aware, ATS-parseable.
 *
 * Mounted at /print/resume. Driven by Puppeteer at build time to produce
 * public/leif-taylor-resume-2026-05.pdf.
 */
import { useLayoutEffect } from 'react';
import { RESUME } from '@/content/resume';
import './ResumePrint.css';

const m = RESUME.meta;

export default function ResumePrint() {
  // Body class management — disables the website's paper texture and
  // hero stagger defaults so the print page renders clean white.
  useLayoutEffect(() => {
    document.body.classList.add('printing');
    document.title = 'Leif Taylor — Résumé';
    return () => {
      document.body.classList.remove('printing');
    };
  }, []);

  return (
    <article className="resume-print">
      {/* ─── HEADER ───────────────────────────────────────── */}
      <header className="resume-print__header">
        <h1 className="resume-print__name">Leif Taylor</h1>
        <p className="resume-print__eyebrow">
          AI-Native Principal Engineer · Product-to-Production Architect
        </p>
        <p className="resume-print__contact">
          <span>Greater Boston Area</span>
          <span aria-hidden="true"> · </span>
          <a href={`mailto:${m.email}`}>{m.email}</a>
          <span aria-hidden="true"> · </span>
          <a href={m.linkedin} target="_blank" rel="noreferrer">
            linkedin.com/in/leiftaylor
          </a>
          <span aria-hidden="true"> · </span>
          <a href={m.siteUrl} target="_blank" rel="noreferrer">
            resume.lalalimited.com
          </a>
        </p>
        <hr className="resume-print__rule" />
      </header>

      {/* ─── THESIS ───────────────────────────────────────── */}
      <p className="resume-print__thesis">
        <em>
          I translate ambiguous business requirements into secure, scalable,
          revenue-producing systems — using agentic workflows to move from idea
          to production at exceptional speed.
        </em>
      </p>

      {/* ─── HOW I WORK ──────────────────────────────────── */}
      <section className="resume-print__section">
        <h2 className="resume-print__section-head">How I Work</h2>
        <p className="resume-print__paragraph">
          I work end-to-end. One operator across product translation,
          architecture, full-stack code, tests, infrastructure, and production —
          agentic workflows for speed, deep architectural judgment for trust.
          Where a 2019 team spent a quarter coordinating handoffs across
          specialists, I ship a working system in weeks.
        </p>
      </section>

      {/* ─── OUTCOMES ─────────────────────────────────────── */}
      <section className="resume-print__section">
        <h2 className="resume-print__section-head">Outcomes</h2>
        <dl className="resume-print__outcomes">
          {RESUME.impact.map((o) => (
            <div className="resume-print__outcome-row" key={o.value}>
              <dt className="resume-print__outcome-anchor">{o.value}</dt>
              <dd className="resume-print__outcome-body">{o.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ─── EXPERIENCE ──────────────────────────────────── */}
      <section className="resume-print__section">
        <h2 className="resume-print__section-head">Experience</h2>

        {/* ConnectBase split entry */}
        <article className="resume-print__role">
          <header className="resume-print__role-head">
            <h3 className="resume-print__company">ConnectBase</h3>
            <span className="resume-print__dates">Mar 2023 — Present</span>
          </header>

          {/* Principal Engineer */}
          <div className="resume-print__sub-role">
            <p className="resume-print__role-title">
              Principal Engineer
              <span className="resume-print__badge">Current</span>
              <span className="resume-print__role-dates">2025 — Present</span>
            </p>
            <ul className="resume-print__bullets">
              <li>
                Reengineered the monolithic pricing engine into a distributed
                worker-driven architecture (concurrent quote computation, fault
                isolation, horizontal scale)
              </li>
              <li>
                Modernized legacy VM-era patterns into stateless, horizontally-
                scalable services
              </li>
              <li>
                Chief developer and technical owner of the Direct-to-Supplier
                Ordering platform — wholesalers and channel partners purchase
                from thousands of suppliers in one interface
              </li>
              <li>
                Integrated AI-assisted workflows for supplier ingestion,
                semantic search, TAM analysis, and data-layer intelligence
              </li>
              <li>
                Daily use of agentic dev workflows (Claude Code, sub-agent
                orchestration, MCP-style tool integration) across implementation,
                refactoring, and architecture iteration
              </li>
              <li>
                Built and maintains the team's operating patterns for AI-augmented
                delivery — when to delegate to an agent, where the human-in-the-
                loop boundary sits, how to validate generated work
              </li>
            </ul>
          </div>

          {/* Promotion connector */}
          <p className="resume-print__connector">
            ↑ Promoted to Principal Engineer (2025)
          </p>

          {/* Director of DevOps */}
          <div className="resume-print__sub-role">
            <p className="resume-print__role-title">
              Director of DevOps
              <span className="resume-print__role-dates">2023 — 2025</span>
            </p>
            <ul className="resume-print__bullets">
              <li>
                Reduced Azure spend by $50K+/month → $600K+ annualized savings,
                in 2 months
              </li>
              <li>
                Modernized 30+ legacy VM-hosted services into stateless,
                horizontally-scalable microservices
              </li>
              <li>
                Built CI/CD across 30+ heterogeneous services (Java, TypeScript /
                Node, Python, C#)
              </li>
              <li>
                Stood up enterprise-wide feature-flag, secrets-management, and
                progressive (canary) delivery infrastructure
              </li>
              <li>
                Stood up unit / functional / e2e coverage across the suite using
                AI-assisted test authorship
              </li>
              <li>Disaster-recovery and outage point person</li>
            </ul>
          </div>
        </article>

        {/* Mobile Heartbeat */}
        <article className="resume-print__role">
          <header className="resume-print__role-head">
            <h3 className="resume-print__company">Mobile Heartbeat</h3>
            <span className="resume-print__dates">Jan 2019 — Mar 2023</span>
          </header>
          <p className="resume-print__role-title">
            Principal DevOps Lead
            <span className="resume-print__role-note">
              Promoted from Senior DevOps Engineer
            </span>
          </p>
          <ul className="resume-print__bullets">
            <li>
              Designed a serverless internal application testing framework, fully
              Terraform-driven, integrated into CI/CD
            </li>
            <li>
              Built CI/CD for multitenant microservice apps on Azure — Terraform
              + Flux/Helm + Kubernetes + automated test deployment + DB
              bootstrapping
            </li>
            <li>Designed CI/CD pipelines for iOS and Android mobile applications</li>
            <li>
              Customer-release support across Android, iOS, and Windows platforms
            </li>
          </ul>
        </article>

        {/* Actifio */}
        <article className="resume-print__role">
          <header className="resume-print__role-head">
            <h3 className="resume-print__company">Actifio</h3>
            <span className="resume-print__dates">Jun 2016 — Jan 2019</span>
          </header>
          <p className="resume-print__role-title">
            Head of DevOps
            <span className="resume-print__role-note">
              Promoted from DevOps Intern → Lead → Head
            </span>
          </p>
          <ul className="resume-print__bullets">
            <li>
              Chief developer of the automated regression testing framework —
              Python/Node + Docker + Ansible + Jenkins + Robot Framework
            </li>
            <li>
              Managed 100+ dev databases (Oracle, SQL Server) and 2,000+ VMs
              across on-prem ESXi, Hyper-V, physical hosts, and AWS EC2
            </li>
            <li>
              Travelled to India to mentor and code-review the distributed
              engineering team
            </li>
            <li>
              Built developer-portal tooling: test execution, host management,
              log analysis
            </li>
          </ul>
        </article>
      </section>

      {/* ─── CONSULTING & FRACTIONAL ─────────────────────── */}
      <section className="resume-print__section">
        <h2 className="resume-print__section-head">Consulting &amp; Fractional</h2>

        <article className="resume-print__consulting">
          <header className="resume-print__consulting-head">
            <span className="resume-print__consulting-name">
              Chemveric — Technical Director
            </span>
            <span className="resume-print__dates">2025 — 2026</span>
          </header>
          <p className="resume-print__consulting-body">
            Architected and led end-to-end development of a B2B SaaS
            cheminformatics marketplace. Multi-tenant NestJS / Postgres / RDKit /
            AWS, with AI-assisted ingestion, RFQ workflows, and funding-
            opportunity matching.
          </p>
        </article>

        <article className="resume-print__consulting">
          <header className="resume-print__consulting-head">
            <span className="resume-print__consulting-name">
              Alacrity Solutions — Founding Member · Principal Architect
            </span>
            <span className="resume-print__dates">2022 — Present</span>
          </header>
          <p className="resume-print__consulting-body">
            AI consulting practice helping F500s operationalize LLMs across
            software development, customer support, finance, compliance, and
            scientific data. Engagements with global tax-tech, computational-
            science, and industrial-chemistry clients.
          </p>
        </article>

        <article className="resume-print__consulting">
          <header className="resume-print__consulting-head">
            <span className="resume-print__consulting-name">
              Imprint.live — CTO · Principal Architect
            </span>
            <span className="resume-print__dates">2022 — 2023</span>
          </header>
          <p className="resume-print__consulting-body">
            AI-driven social platform. OpenAI-powered moderation, synthetic-user
            systems, user-value analytics for stakeholders.
          </p>
        </article>

        <article className="resume-print__consulting">
          <header className="resume-print__consulting-head">
            <span className="resume-print__consulting-name">
              Open Interpreter — Contributor
            </span>
            <span className="resume-print__dates">2023 — 2024</span>
          </header>
          <p className="resume-print__consulting-body">
            The desktop app for AI power users — let agents edit files, control
            apps, and learn new skills. Contributor to local-LLM execution
            patterns. 64k+ stars on GitHub.{' '}
            <a
              href="https://github.com/openinterpreter/open-interpreter"
              target="_blank"
              rel="noreferrer"
              className="resume-print__inline-link"
            >
              github.com/openinterpreter/open-interpreter
            </a>
          </p>
        </article>
      </section>

      {/* ─── TOOLKIT ─────────────────────────────────────── */}
      <section className="resume-print__section">
        <h2 className="resume-print__section-head">Toolkit</h2>
        <dl className="resume-print__toolkit">
          {RESUME.tech.map((b) => (
            <div className="resume-print__toolkit-row" key={b.label}>
              <dt>{b.label}</dt>
              <dd>{b.pills.join(' · ')}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Education intentionally omitted from the PDF — the conservatory
          degree felt out of place against the engineering content. It still
          appears as a footer line on the website at resume.lalalimited.com. */}
    </article>
  );
}
