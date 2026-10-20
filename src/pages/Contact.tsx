import { useId, useState, type FormEvent } from 'react';
import { ArrowUpRight, Lock, Mail, MapPin, Phone, Printer } from 'lucide-react';
import { Page } from '../components/Page';
import { Breadcrumb } from '../components/Breadcrumb';
import { Kicker } from '../components/ui';
import { CONTACT, SERVICES } from '../data/site';

/**
 * Quiet and usable. There is no verified submission endpoint for this
 * concept, so the form composes an email in the visitor's own mail app,
 * addressed to the contact email in src/data/site.ts, and says so plainly. Nothing is stored.
 */
export default function Contact() {
  const id = useId();
  const [interests, setInterests] = useState<string[]>([]);
  const [error, setError] = useState('');

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const first = String(f.get('first') ?? '').trim();
    const last = String(f.get('last') ?? '').trim();
    if (!first || !last) {
      setError('Please add your first and last name.');
      (e.currentTarget.elements.namedItem(first ? 'last' : 'first') as HTMLInputElement)?.focus();
      return;
    }
    if (interests.length === 0) {
      setError('Please choose at least one service you are interested in.');
      return;
    }
    setError('');
    const lines = [
      `Name: ${first} ${last}`,
      f.get('email') ? `Email: ${f.get('email')}` : '',
      f.get('phone') ? `Phone: ${f.get('phone')}` : '',
      `Interested in: ${interests.join(', ')}`,
      '',
      String(f.get('message') ?? ''),
    ].filter((l, i) => l !== '' || i === 4);
    const subject = `Conversation request: ${interests.join(', ')}`;
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
  };

  const toggle = (name: string) => setInterests((cur) => (cur.includes(name) ? cur.filter((x) => x !== name) : [...cur, name]));

  return (
    <Page title="Contact" description="Contact Northstead Trust at 700 Lakefront Plaza, Suite 1800, Milwaukee, WI 53202.">
      <div className="shell pb-[var(--section-y)] pt-[calc(var(--header-h)+clamp(2.5rem,1.5rem+4vw,6rem))]">
        <Breadcrumb trail={[{ label: 'Contact' }]} />
        <div className="grid-12 mt-10 gap-y-16">
          <div className="col-span-12 lg:col-span-5">
            <Kicker>Contact us</Kicker>
            <h1 data-reveal="words" className="t-display mt-6">
              Let&rsquo;s <em className="italic-accent">talk.</em>
            </h1>
            <p data-reveal="up" className="t-lede mt-6 max-w-[28rem]">
              Tell us a little about yourself, and we&rsquo;ll be in touch soon.
            </p>

            <address className="mt-12 border-t border-line not-italic">
              <ContactRow icon={<Phone size={16} aria-hidden />} label="Phone" href={CONTACT.phoneHref} value={CONTACT.phone} />
              <ContactRow icon={<Mail size={16} aria-hidden />} label="Email" href={`mailto:${CONTACT.email}`} value={CONTACT.email} />
              <ContactRow icon={<Printer size={16} aria-hidden />} label="Fax" value={CONTACT.fax} />
              <ContactRow
                icon={<MapPin size={16} aria-hidden />}
                label="Office"
                href={CONTACT.mapHref}
                value={
                  <>
                    {CONTACT.street}
                    <br />
                    {CONTACT.city}
                  </>
                }
                external
              />
            </address>

            <a
              href={CONTACT.clientLogin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 flex items-center justify-between gap-4 rounded-sm bg-lake p-6 text-porcelain transition-colors hover:bg-lake-deep"
            >
              <span>
                <span className="t-kicker flex items-center gap-2 text-champagne">
                  <Lock size={13} aria-hidden /> Existing clients
                </span>
                <span className="serif mt-2 block text-[1.5rem] leading-tight">Client Login</span>
              </span>
              <ArrowUpRight size={20} aria-hidden />
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </div>

          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <form noValidate onSubmit={submit} className="rounded-sm bg-paper p-[clamp(1.25rem,0.8rem+2.5vw,3rem)] shadow-[0_0_0_1px_var(--color-line)]" aria-describedby={`${id}-note`}>
              <h2 className="t-h3">Start a conversation</h2>
              <p id={`${id}-note`} className="t-small mt-3 text-ink-soft">
                This concept site doesn&rsquo;t send or store anything. When you continue, your email app opens with a message to {CONTACT.email}{' '}
                that you can review before sending.
              </p>

              <fieldset className="mt-8">
                <legend className="text-sm font-semibold">
                  Which service are you interested in? <span className="text-oxblood">*</span>
                </legend>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {SERVICES.map((s) => {
                    const on = interests.includes(s.name);
                    return (
                      <label
                        key={s.slug}
                        className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-sm border px-4 py-2 text-[0.9375rem] font-medium transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-legacy ${
                          on ? 'border-ink bg-ink text-porcelain' : 'border-line bg-porcelain hover:border-ink'
                        }`}
                      >
                        <input type="checkbox" name="service" value={s.name} checked={on} onChange={() => toggle(s.name)} className="h-4 w-4 accent-[var(--color-oxblood)]" />
                        {s.name}
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field id={`${id}-first`} name="first" label="First name" required autoComplete="given-name" />
                <Field id={`${id}-last`} name="last" label="Last name" required autoComplete="family-name" />
                <Field id={`${id}-email`} name="email" label="Email address" type="email" autoComplete="email" />
                <Field id={`${id}-phone`} name="phone" label="Phone number" type="tel" autoComplete="tel" />
              </div>
              <div className="mt-4">
                <label htmlFor={`${id}-msg`} className="text-sm font-semibold">
                  Message
                </label>
                <textarea
                  id={`${id}-msg`}
                  name="message"
                  rows={5}
                  className="mt-2 block w-full resize-y rounded-sm border border-line bg-porcelain px-4 py-3 text-base leading-relaxed outline-none transition-colors focus:border-ink"
                />
              </div>

              <p role="alert" aria-live="assertive" className="mt-4 min-h-[1.5rem] text-sm font-semibold text-legacy">
                {error}
              </p>
              <button type="submit" className="btn mt-2 w-full sm:w-auto">
                <Mail size={16} aria-hidden /> Continue in your email app
              </button>
              <p className="t-small mt-5 text-ink-soft">
                Prefer to talk? Call{' '}
                <a href={CONTACT.phoneHref} className="link-line-rest font-semibold text-ink">
                  {CONTACT.phone}
                </a>
                .
              </p>
            </form>
          </div>
        </div>
      </div>
    </Page>
  );
}

function ContactRow({ icon, label, value, href, external }: { icon: React.ReactNode; label: string; value: React.ReactNode; href?: string; external?: boolean }) {
  const content = (
    <>
      <span className="t-kicker flex items-center gap-2 text-taupe-ink">
        {icon} {label}
      </span>
      <span className="serif break-anywhere mt-1 block text-[clamp(1.35rem,1.1rem+0.9vw,1.75rem)] leading-tight">
        {href ? <span className="link-line">{value}</span> : value}
      </span>
    </>
  );
  return (
    <div className="border-b border-line py-5">
      {href ? (
        <a href={href} className="group block" {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {content}
          {external && <span className="visually-hidden"> (opens in a new tab)</span>}
        </a>
      ) : (
        content
      )}
    </div>
  );
}

function Field({ id, name, label, type = 'text', required, autoComplete }: { id: string; name: string; label: string; type?: string; required?: boolean; autoComplete?: string }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="text-sm font-semibold">
        {label} {required && <span className="text-oxblood">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        aria-required={required}
        autoComplete={autoComplete}
        className="mt-2 block min-h-12 w-full min-w-0 rounded-sm border border-line bg-porcelain px-4 text-base outline-none transition-colors focus:border-ink"
      />
    </div>
  );
}
