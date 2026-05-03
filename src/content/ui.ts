/**
 * UI string surface — every chrome string the components render.
 *
 * Why this lives separately from `RESUME`: `RESUME` holds *content* (who
 * Leif is, what he's done). This file holds the labels, button text, modal
 * copy, and footer chrome the page wraps that content in. Variants
 * occasionally want to override these (e.g., changing an "Email Leif" CTA
 * to "Reach out about the Forward-Deployed role"), and keeping them
 * separate makes that override surgical.
 */

export interface UI {
  cta: {
    /** Hero primary CTA — opens the contact modal. */
    emailLeif: string;
    /** Hero secondary CTA — opens Calendly. */
    scheduleCall: string;
    /** Hero secondary CTA — opens the download sheet. */
    downloadResume: string;
    /** Hero ghost CTA — outbound LinkedIn link. */
    linkedin: string;
    /** Trailing arrow appended to the LinkedIn CTA. */
    linkedinArrow: string;
  };
  hero: {
    /** Aside heading on the right rail of the hero. */
    atAGlance: string;
  };
  contact: {
    /** Send-message link in the contact box. */
    sendMessage: string;
    /** Calendly link in the contact box. */
    schedule: string;
    /** LinkedIn link label in the contact box. */
    linkedin: string;
    /** Download link in the contact box. */
    download: string;
    /** Mono kicker above the contact box link list. */
    kicker: string;
  };
  modal: {
    title: string;
    closeAria: string;
    closeLabel: string;
    /** Confirmation rendered after a successful submit. */
    successTitle: string;
    successBody: string;
    successCtaLabel: string;
    /** Field labels and hints. */
    fields: {
      nameLabel: string;
      emailLabel: string;
      phoneLabel: string;
      phoneHint: string;
      reasonLabel: string;
      reasonPlaceholder: string;
      honeypotLabel: string;
    };
    /** Validation error messages. */
    errors: {
      required: string;
      emailInvalid: string;
      phoneTooShort: string;
      reasonRequired: string;
      reasonTooShort: string;
      reasonTooLong: string;
      nameTooShort: string;
      networkError: string;
      genericError: string;
    };
    cancelLabel: string;
    submitLabel: string;
    submitSendingLabel: string;
    privacyNote: string;
  };
  download: {
    title: string;
    closeLabel: string;
    sub: string;
    pdf: {
      format: string;
      title: string;
      desc: string;
    };
    docx: {
      format: string;
      title: string;
      desc: string;
    };
    note: string;
  };
  footer: {
    /** "See how this résumé was made" — italicised lead-in. */
    repoLead: string;
    /** Trailing arrow rendered after the lead-in. */
    repoArrow: string;
    /** GitHub repository URL. */
    repoUrl: string;
    /** Display label for the repo link. */
    repoLabel: string;
    /** Prefix on the © line. */
    copyrightOwner: string;
    /** "Reviewed" prefix in the © row. */
    reviewedLabel: string;
  };
  notFound: {
    eyebrow: string;
    heading: string;
    body: string;
    homeLabel: string;
  };
  print: {
    /** Section head used by the PDF for the consulting/fractional partition
     *  of `RESUME.experience`. The website folds these entries into the same
     *  timeline as primary employment, so this label only surfaces in the
     *  PDF and DOCX. */
    consultingHeading: string;
  };
}

export const UI: UI = {
  cta: {
    emailLeif: 'Email Leif',
    scheduleCall: 'Schedule 30 min',
    downloadResume: 'Download résumé',
    linkedin: 'LinkedIn',
    linkedinArrow: '→',
  },
  hero: {
    atAGlance: 'At a Glance',
  },
  contact: {
    sendMessage: 'Send Leif a message →',
    schedule: 'Schedule 30 min on my calendar →',
    linkedin: 'LinkedIn — leiftaylor',
    download: 'Download résumé →',
    kicker: 'Contact',
  },
  modal: {
    title: "Tell me what you're trying to build.",
    closeAria: 'Close',
    closeLabel: 'ESC',
    successTitle: 'Thanks — I’ll be in touch.',
    successBody:
      'Your message landed. I’ll usually reply within a day or two.',
    successCtaLabel: 'Close',
    fields: {
      nameLabel: 'Your name',
      emailLabel: 'Email',
      phoneLabel: 'Phone',
      phoneHint: 'Optional',
      reasonLabel: 'Reason for reaching out',
      reasonPlaceholder:
        "A few sentences — what you're trying to build, the role, or why you're reaching out.",
      honeypotLabel: 'Website',
    },
    errors: {
      required: 'Required.',
      emailInvalid: 'Email looks off.',
      phoneTooShort: 'Looks too short.',
      reasonRequired: 'A few sentences, please.',
      reasonTooShort: 'A bit more, please.',
      reasonTooLong: 'A bit shorter, please.',
      nameTooShort: 'Too short.',
      networkError: 'Network error — please try again.',
      genericError: 'Something went wrong. Please try again.',
    },
    cancelLabel: 'Cancel',
    submitLabel: 'Send message',
    submitSendingLabel: 'Sending…',
    privacyNote:
      'Your message goes only to Leif. Not stored, not shared, not used for anything else.',
  },
  download: {
    title: 'Download résumé.',
    closeLabel: 'ESC',
    sub: 'Two formats. Pick whichever your workflow expects.',
    pdf: {
      format: 'PDF',
      title: 'Designed PDF',
      desc:
        'Typeset, hyperlinks live, opens in any browser. The default for human readers.',
    },
    docx: {
      format: 'DOCX',
      title: 'Word document',
      desc:
        'Single-column, plain-text-first. The most reliably parsed format for ATS / recruiter screening tools.',
    },
    note:
      'Both formats are generated from the same source data and updated on every site deploy.',
  },
  footer: {
    repoLead: 'See how this résumé was made',
    repoArrow: '→',
    repoUrl: 'https://github.com/alacrity-ai/leiftaylor-resume',
    repoLabel: 'github.com/alacrity-ai/leiftaylor-resume',
    copyrightOwner: 'Leif Taylor',
    reviewedLabel: 'Reviewed',
  },
  notFound: {
    eyebrow: '404',
    heading: 'No such page.',
    body:
      'That URL doesn’t match any version of this résumé. The slug may be a typo, or it may have been retired.',
    homeLabel: 'Back to the résumé →',
  },
  print: {
    consultingHeading: 'Consulting & Fractional',
  },
};
