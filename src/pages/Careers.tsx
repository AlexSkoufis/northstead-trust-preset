import { Mail, Plus } from 'lucide-react';
import { Page } from '../components/Page';
import { Breadcrumb } from '../components/Breadcrumb';
import { Img } from '../components/Img';
import { Kicker, Mark } from '../components/ui';
import { BENEFITS, CAREERS_INTRO, EEO, JOBS } from '../data/careers';
import { CONTACT, MISSION } from '../data/site';

/** Careers: a quieter page. Positions use native disclosure (works without JS). */
export default function Careers() {
  return (
    <Page
      title="Careers"
      description="Discover your potential at Northstead Trust. Open positions in Milwaukee."
    >
      <header className="shell pt-[calc(var(--header-h)+clamp(2.5rem,1.5rem+4vw,6rem))]">
        <Breadcrumb trail={[{ label: 'About' }, { label: 'Careers' }]} />
        <div className="grid-12 mt-10 gap-y-8">
          <div className="col-span-12 lg:col-span-8">
            <Kicker>Careers</Kicker>
            <h1 data-reveal="words" className="t-h1 mt-6">
              Discover your potential at Northstead Trust, where each day is an opportunity to contribute to <em className="italic-accent">something meaningful.</em>
            </h1>
          </div>
        </div>
      </header>

      <div className="shell mt-14">
        <div data-reveal="media" className="media aspect-[16/9] rounded-sm md:aspect-[21/8]">
          <Img drift src="photo/careers" alt="A bright, minimal studio with large windows and long work tables." position="60% 50%" sizes="100vw" priority className="h-full w-full object-cover" />
        </div>
      </div>

      <section aria-labelledby="culture" className="shell section-y">
        <div className="grid-12 gap-y-10">
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            <Mark className="h-auto w-[7rem] text-taupe" />
          </div>
          <div className="col-span-12 md:col-span-8 lg:col-span-7 lg:col-start-5">
            <h2 id="culture" data-reveal="up" className="t-h3">
              {CAREERS_INTRO}
            </h2>
            <p data-reveal="up" className="t-body mt-8">
              {BENEFITS}
            </p>
            <p data-reveal="up" className="serif mt-8 border-l-2 border-oxblood pl-6 text-[1.35rem] leading-snug">
              {MISSION}
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="positions" className="bg-paper">
        <div className="shell section-y">
          <div className="flex flex-col gap-4 border-b border-ink pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Kicker>Open positions</Kicker>
              <h2 id="positions" className="t-h2 mt-4">
                Join the team
              </h2>
            </div>
            <p className="t-body max-w-[28rem]">Learn more about our open positions below and submit your resum&eacute; if you are interested in a career with us.</p>
          </div>

          <div className="mt-2">
            {JOBS.map((job) => (
              <details key={job.id} className="group border-b border-line [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex min-h-20 cursor-pointer list-none items-center gap-5 py-6">
                  <span className="min-w-0 flex-1">
                    <span className="serif block text-[clamp(1.6rem,1.2rem+1.6vw,2.6rem)] leading-[1.12]">{job.title}</span>
                    <span className="t-meta mt-2 block">
                      {job.location} <span aria-hidden>·</span> {job.status} <span aria-hidden>·</span> {job.hours}
                    </span>
                  </span>
                  <span className="grid h-12 w-12 flex-none place-items-center rounded-full border border-line transition-transform duration-500 group-open:rotate-45 group-open:bg-ink group-open:text-porcelain" aria-hidden>
                    <Plus size={18} strokeWidth={1.6} />
                  </span>
                </summary>
                <div className="grid-12 gap-y-8 pb-12 pt-2">
                  <div className="col-span-12 space-y-4 lg:col-span-4">
                    {job.summary.map((s) => (
                      <p key={s.slice(0, 20)} className="t-body">
                        {s}
                      </p>
                    ))}
                    {job.closing && <p className="t-body font-semibold text-ink">{job.closing}</p>}
                    <a href={`mailto:${CONTACT.careersEmail}?subject=${encodeURIComponent(`POSITION: ${job.title}`)}`} className="btn mt-4">
                      <Mail size={16} aria-hidden /> Apply by email
                    </a>
                    <p className="t-small text-ink-soft">
                      Submit a resume and cover letter to{' '}
                      <a href={`mailto:${CONTACT.careersEmail}`} className="link-line-rest break-anywhere text-ink">
                        {CONTACT.careersEmail}
                      </a>
                    </p>
                  </div>
                  <div className="col-span-12 space-y-10 lg:col-span-7 lg:col-start-6">
                    {job.sections.map((s) => (
                      <div key={s.heading}>
                        <h3 className="t-kicker text-taupe-ink">{s.heading}</h3>
                        <ol className="mt-4 space-y-3">
                          {s.items.map((it, i) => (
                            <li key={it.slice(0, 30)} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-2 text-[0.9375rem] leading-relaxed text-ink-soft">
                              <span className="t-num text-oxblood">{i + 1}.</span>
                              <span>{it}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    ))}
                  </div>
                </div>
              </details>
            ))}
          </div>
          <p className="t-small mt-10 max-w-[56rem] text-ink-soft">{EEO}</p>
        </div>
      </section>
    </Page>
  );
}
