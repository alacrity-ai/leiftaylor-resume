import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Turnstile } from '@marsidev/react-turnstile';
import './ContactModal.css';

/**
 * The Cloudflare-published "always passes" test site key. Lets the widget
 * render and resolve in dev without a real Turnstile site configured.
 * Production swaps this for the real key via VITE_TURNSTILE_SITE_KEY.
 */
const TEST_SITE_KEY = '1x00000000000000000000AA';
const VITE_ENV: Record<string, string | undefined> =
  (typeof import.meta !== 'undefined' &&
    (import.meta as { env?: Record<string, string | undefined> }).env) ||
  {};
const SITE_KEY = VITE_ENV.VITE_TURNSTILE_SITE_KEY ?? TEST_SITE_KEY;
const ENDPOINT = VITE_ENV.VITE_CONTACT_ENDPOINT ?? '/api/contact';

interface FormFields {
  name: string;
  email: string;
  phone?: string;
  reason: string;
  hp_website: string;
}

type SubmitState =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent' }
  | { kind: 'error'; message: string };

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ContactModal({ open, onClose }: Props) {
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [state, setState] = useState<SubmitState>({ kind: 'idle' });
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);
  const triggerRef = useRef<Element | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormFields>({
    mode: 'onTouched',
    defaultValues: { hp_website: '' },
  });

  // Body scroll lock + focus management. Open: snapshot active element,
  // focus first field, lock scroll. Close: restore scroll, return focus.
  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Defer focus by a frame so the modal's transition starts before we
    // pull focus — prevents iOS Safari from scrolling the form into view
    // mid-animation.
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 50);

    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = previousOverflow;
      const trigger = triggerRef.current;
      if (trigger && trigger instanceof HTMLElement) trigger.focus();
    };
  }, [open]);

  // ESC closes; trap Tab inside the dialog.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Reset form + state every time the modal closes so a re-open is clean.
  useEffect(() => {
    if (!open) {
      reset();
      setState({ kind: 'idle' });
      setTurnstileToken(null);
    }
  }, [open, reset]);

  if (!open) return null;

  async function onSubmit(values: FormFields) {
    setState({ kind: 'sending' });
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone || undefined,
          reason: values.reason,
          hp_website: values.hp_website,
          turnstileToken,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string };
      if (res.ok && body.ok) {
        setState({ kind: 'sent' });
        return;
      }
      setState({ kind: 'error', message: body.message ?? 'Something went wrong. Please try again.' });
    } catch {
      setState({ kind: 'error', message: 'Network error — please try again.' });
    }
  }

  const sending = state.kind === 'sending';
  const canSubmit = isValid && !!turnstileToken && !sending;

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        // Backdrop click — only close if the mousedown was on the backdrop
        // itself, not bubbling up from inside the dialog.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
      >
        <header className="modal-head">
          <h2 id="contact-modal-title" className="modal-title font-display">
            Tell me what you're trying to build.
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="modal-close font-mono"
            aria-label="Close"
          >
            ESC
          </button>
        </header>

        {state.kind === 'sent' ? (
          <div className="modal-thanks" role="status" aria-live="polite">
            <p className="font-display modal-thanks__title">Thanks — I’ll be in touch.</p>
            <p className="modal-thanks__body">
              Your message landed. I’ll usually reply within a day or two.
            </p>
            <button type="button" className="btn btn-primary modal-thanks__close" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Field label="Your name" error={errors.name?.message} htmlFor="cm-name">
              <NameInput register={register} firstFieldRef={firstFieldRef} />
            </Field>

            <Field label="Email" error={errors.email?.message} htmlFor="cm-email">
              <input
                id="cm-email"
                type="email"
                autoComplete="email"
                inputMode="email"
                {...register('email', {
                  required: 'Required.',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, message: 'Email looks off.' },
                })}
              />
            </Field>

            <Field
              label="Phone"
              hint="Optional"
              error={errors.phone?.message}
              htmlFor="cm-phone"
            >
              <input
                id="cm-phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                {...register('phone', {
                  validate: (v) => {
                    if (!v || v.trim() === '') return true;
                    return v.replace(/\D/g, '').length >= 10 ? true : 'Looks too short.';
                  },
                })}
              />
            </Field>

            <Field
              label="Reason for reaching out"
              error={errors.reason?.message}
              htmlFor="cm-reason"
            >
              <textarea
                id="cm-reason"
                rows={5}
                placeholder="A few sentences — what you're trying to build, the role, or why you're reaching out."
                {...register('reason', {
                  required: 'A few sentences, please.',
                  minLength: { value: 20, message: 'A bit more, please.' },
                  maxLength: { value: 4000, message: 'A bit shorter, please.' },
                })}
              />
            </Field>

            {/* Honeypot — hidden from humans, attractive to bots. */}
            <div className="modal-honeypot" aria-hidden="true">
              <label>
                Website
                <input type="text" tabIndex={-1} autoComplete="off" {...register('hp_website')} />
              </label>
            </div>

            <div className="modal-turnstile">
              <Turnstile
                siteKey={SITE_KEY}
                onSuccess={(t) => setTurnstileToken(t)}
                onExpire={() => setTurnstileToken(null)}
                onError={() => setTurnstileToken(null)}
                options={{ theme: 'light', size: 'flexible' }}
              />
            </div>

            {state.kind === 'error' ? (
              <p role="alert" className="modal-error-banner">
                {state.message}
              </p>
            ) : null}

            <div className="modal-actions">
              <button
                type="button"
                onClick={onClose}
                className="btn modal-cancel"
                disabled={sending}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canSubmit}
                className="btn btn-primary modal-submit"
              >
                {sending ? 'Sending…' : 'Send message'}
              </button>
            </div>

            <p className="modal-privacy mono-meta mono-meta--faint">
              Your message goes only to Leif. Not stored, not shared, not used for anything else.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  hint?: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, hint, htmlFor, error, children }: FieldProps) {
  return (
    <div className="modal-field">
      <label htmlFor={htmlFor}>
        <span>{label}</span>
        {hint ? <span className="modal-field__hint">{hint}</span> : null}
      </label>
      {children}
      {error ? (
        <span role="alert" className="modal-error">
          {error}
        </span>
      ) : null}
    </div>
  );
}

/**
 * Name input that combines react-hook-form's internal ref with our local
 * firstFieldRef so the modal can focus the field on open. RHF's ref must
 * be called with the element so it can do its own form-state tracking;
 * we call our ref alongside.
 */
function NameInput({
  register,
  firstFieldRef,
}: {
  register: ReturnType<typeof useForm<FormFields>>['register'];
  firstFieldRef: React.MutableRefObject<HTMLInputElement | null>;
}) {
  const { ref: rhfRef, ...rest } = register('name', {
    required: 'Required.',
    minLength: { value: 2, message: 'Too short.' },
  });
  return (
    <input
      id="cm-name"
      autoComplete="name"
      ref={(el) => {
        rhfRef(el);
        firstFieldRef.current = el;
      }}
      {...rest}
    />
  );
}
