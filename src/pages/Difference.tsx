import { Page } from '../components/Page';
import { Breadcrumb } from '../components/Breadcrumb';
import { Img } from '../components/Img';
import { ArrowLink, ButtonLink, Kicker, Mark } from '../components/ui';
import { DIFFERENCE, MISSION } from '../data/site';

const ROMAN = ['I', 'II', 'III'];

/** A manifesto: one statement, three principles, and the founders' story. */
export default function Difference() {
  return (
    <Page
      title="The Northstead Difference"
      description="Northstead Trust is an entirely independent trust company in Milwaukee. Experienced people, local decisions and integrity as the foundation."
    >
      {/* Statement */}
      <header className="shell pb-14 pt-[calc(var(--header-h)+clamp(2.5rem,1.5rem+4vw,6rem))]">
        <Breadcrumb trail={[{ label: 'About' }, { label: 'The Northstead Difference' }]} />
        <Kicker className="mt-10">The Northstead Difference</Kicker>
        <h1 data-reveal="words" className="t-h1 mt-6 max-w-[22ch]">
          At Northstead Trust, we concentrate on three things: <em className="italic-accent">you, your family and the generations that follow.</em>
        </h1>
      </header>

      <div className="shell">
        <div data-reveal="media" className="media aspect-[16/9] rounded-sm md:aspect-[21/8]">
          <Img
            drift
            src="photo/studio-walk"
            alt="A small team working around a table in a bright office with tall windows."
            position="48% 45%"
            sizes="100vw"
            priority
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Why independence */}
      <section aria-labelledby="unique" className="shell section-y">
        <div className="grid-12 gap-y-10">
          <h2 id="unique" data-reveal="words" className="t-h2 col-span-12 lg:col-span-6">
            {DIFFERENCE.intro}
          </h2>
          <div className="col-span-12 lg:col-span-5 lg:col-start-8">
            <p data-reveal="up" className="t-lede">
              {DIFFERENCE.independence}
            </p>
            <p data-reveal="up" className="serif mt-8 border-l-2 border-oxblood pl-6 text-[1.45rem] leading-snug">
              {MISSION}
            </p>
          </div>
        </div>
      </section>

      {/* Principles: each one sits at a different point on the grid */}
      <section aria-labelledby="principles" className="border-t border-line">
        <div className="shell section-y">
          <Kicker>What sets us apart</Kicker>
          <h2 id="principles" className="visually-hidden">
            Our principles
          </h2>
          <ol className="mt-12 space-y-[clamp(4rem,2rem+5vw,8rem)]">
            {DIFFERENCE.pillars.map((p, i) => (
              <li key={p.title} className="grid-12 gap-y-6">
                <span
                  data-reveal="up"
                  className={`t-num col-span-12 text-[clamp(4rem,2.5rem+5vw,8rem)] leading-[1.05] text-oxblood md:col-span-2 ${i === 1 ? 'md:col-start-3' : i === 2 ? 'md:col-start-5' : ''}`}
                  aria-hidden
                >
                  {ROMAN[i]}
                </span>
                <div className={`col-span-12 md:col-span-8 ${i === 0 ? 'md:col-start-4' : i === 1 ? 'md:col-start-5' : 'md:col-start-7 md:col-span-6'}`}>
                  <h3 data-reveal="words" className="t-h2">
                    {p.title}
                  </h3>
                  <p data-reveal="up" className="t-body mt-6 max-w-[40rem]">
                    {p.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Our story */}
      <section aria-labelledby="our-legacy" className="on-dark bg-lake text-porcelain">
        <div className="shell section-y">
          <div className="grid-12 gap-y-12">
            <div className="col-span-12 lg:col-span-5">
              <Kicker light>Our Story</Kicker>
              <h2 id="our-legacy" data-reveal="words" className="t-h1 mt-6">
                Founded on <em className="italic-accent">personal service.</em>
              </h2>
              <p data-reveal="up" className="serif mt-10 text-[clamp(1.5rem,1.2rem+1vw,2rem)] leading-snug text-champagne">
                Helen Marsh
                <br />
                &amp; David Okonkwo
              </p>
              <p className="t-meta mt-2 text-mist">Founders</p>
            </div>
            <div className="col-span-12 space-y-6 lg:col-span-6 lg:col-start-7">
              {DIFFERENCE.story.map((para) => (
                <p key={para.slice(0, 20)} data-reveal="up" className="t-body text-mist">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section aria-labelledby="milestones" className="shell section-y">
        <h2 id="milestones" className="t-kicker kicker-row text-taupe-ink">
          Milestones
        </h2>
        <ul className="mt-10 grid grid-cols-1 border-t border-line md:grid-cols-3">
          <li data-reveal="up" className="py-10 md:pr-10">
            <span className="t-num block text-[clamp(3.5rem,2.5rem+3vw,5.5rem)] leading-none text-oxblood">2004</span>
            <p className="t-h4 mt-5">Five founding members</p>
            <p className="t-small mt-3 text-ink-soft">Northstead Trust opens as a chartered trust company in Milwaukee, governed by a local board of directors.</p>
          </li>
          <li data-reveal="up" data-delay="0.1" className="border-t border-line py-10 md:border-l md:border-t-0 md:px-10">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-lake p-2">
              <Mark className="h-full w-full text-champagne" />
            </span>
            <p className="t-h4 mt-5">Twenty years</p>
            <p className="t-small mt-3 text-ink-soft">{DIFFERENCE.anniversary}</p>
          </li>
          <li data-reveal="up" data-delay="0.2" className="border-t border-line py-10 md:border-l md:border-t-0 md:pl-10">
            <span className="t-num block text-[clamp(3.5rem,2.5rem+3vw,5.5rem)] leading-none text-oxblood">22</span>
            <p className="t-h4 mt-5">Years average tenure</p>
            <p className="t-small mt-3 text-ink-soft">
              The average tenure of our senior advisors. Clients work with the same people year after year.
            </p>
          </li>
        </ul>
        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
          <ButtonLink to="/about/our-team">Meet our team</ButtonLink>
          <ArrowLink to="/about/board-of-directors">Board of Directors</ArrowLink>
        </div>
      </section>
    </Page>
  );
}
