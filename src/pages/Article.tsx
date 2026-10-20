import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Play } from 'lucide-react';
import { Page } from '../components/Page';
import { Breadcrumb } from '../components/Breadcrumb';
import { Img, imgMeta } from '../components/Img';
import { ArrowLink, ButtonLink } from '../components/ui';
import { ARTICLES, articleBySlug, authorPerson, cover, fmtDate, plainName, type Block } from '../lib/content';
import { articleBody } from '../lib/articleBody';
import { CoverImg } from './Insights';
import NotFound from './NotFound';

// Article HTML comes from our content pipeline (strong, em and a only).
// External links open in a new tab.
const html = (s: string) => s.replace(/<a href="(https?:[^"]+)">/g, '<a href="$1" target="_blank" rel="noopener noreferrer">');

export default function Article() {
  const { slug = '' } = useParams();
  const a = articleBySlug(slug);
  if (!a) return <NotFound />;
  const c = cover(a);
  // The hero photograph is the article's first image: don't repeat it in the body.
  const body = articleBody(slug).filter((b) => !(c?.kind === 'photo' && b.t === 'img' && `insights/${b.src}` === c.key));
  const person = authorPerson(a);
  const words = body.reduce((n, b) => n + ('html' in b ? b.html.split(/\s+/).length : 'items' in b ? b.items.join(' ').split(/\s+/).length : 0), 0);
  const minutes = Math.max(1, Math.round(words / 230));
  const related = ARTICLES.filter((x) => x.slug !== a.slug && x.category === a.category).slice(0, 3);

  return (
    <Page key={slug} title={a.title} description={a.excerpt || `${a.category} from Northstead Trust, ${fmtDate(a.date, true)}.`}>
      <article>
        <header className="shell pt-[calc(var(--header-h)+clamp(2.5rem,1.5rem+4vw,5rem))]">
          <Breadcrumb trail={[{ label: 'Insights', to: '/insights' }, { label: a.category }]} />
          <div className="grid-12 mt-10">
            <div className="col-span-12 lg:col-span-10 lg:col-start-2 xl:col-span-9 xl:col-start-2">
              <p className="t-kicker text-oxblood">{a.category}</p>
              <h1 data-reveal="words" className="t-h1 mt-5">
                {a.title}
              </h1>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-line py-4">
                {person && (
                  <Link to={`/about/our-team/${person.slug}`} className="flex items-center gap-3">
                    <span className="media portrait-tone h-11 w-11 flex-none rounded-full">
                      <Img src={`team/${person.slug}`} alt="" position="50% 20%" sizes="44px" className="h-full w-full object-cover" />
                    </span>
                    <span className="text-sm font-semibold">
                      <span className="link-line">{a.author}</span>
                    </span>
                  </Link>
                )}
                {!person && <span className="text-sm font-semibold">By Northstead Trust</span>}
                <span className="t-meta">
                  <time dateTime={a.date}>{fmtDate(a.date, true)}</time>
                </span>
                {!a.video && <span className="t-meta">{minutes} min read</span>}
              </div>
            </div>
          </div>
        </header>

        {c?.kind === 'photo' && (
          <div className="shell mt-12">
            <div data-reveal="media" className="media aspect-[16/10] rounded-sm lg:aspect-[21/10]">
              <Img src={c.key} alt="" sizes="100vw" priority className="h-full w-full object-cover" />
            </div>
          </div>
        )}

        <div className="shell section-y pt-[clamp(3rem,2rem+3vw,5rem)]">
          <div className="grid-12 gap-y-12">
            <aside className="col-span-12 lg:col-span-2 lg:col-start-2" aria-label="Article tools">
              <div className="flex flex-wrap gap-x-6 gap-y-2 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:flex-col">
                <Link to="/insights" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold">
                  <ArrowLeft size={15} aria-hidden /> <span className="link-line">All insights</span>
                </Link>
              </div>
            </aside>
            <div className="prose-editorial col-span-12 min-w-0 lg:col-span-7">
              {body.map((b, i) => (
                <BlockView key={i} b={b} first={i === 0} />
              ))}
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related" className="bg-paper">
          <div className="shell section-y">
            <div className="flex flex-col gap-4 border-b border-ink pb-6 md:flex-row md:items-end md:justify-between">
              <h2 id="related" className="t-h2">
                More {a.category === 'In The Community' ? 'from our community' : a.category.toLowerCase()}
              </h2>
              <ArrowLink to="/insights">All insights</ArrowLink>
            </div>
            <ul className="mt-10 grid grid-cols-1 gap-x-[clamp(1rem,0.4rem+2vw,2.5rem)] gap-y-12 md:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link to={`/insights/${r.slug}`} className="group block">
                    <CoverImg a={r} aspect="aspect-[4/3]" sizes="(min-width: 768px) 30vw, 100vw" />
                    <p className="t-meta mt-4">{fmtDate(r.date)}</p>
                    <h3 className="serif mt-1 text-[1.5rem] leading-tight">
                      <span className="link-line">{r.title}</span>
                    </h3>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section aria-labelledby="article-cta" className="shell flex flex-col gap-8 py-[clamp(4rem,3rem+4vw,7rem)] md:flex-row md:items-end md:justify-between">
        <h2 id="article-cta" className="t-h2 max-w-[20ch]">
          Questions about what this means <em className="italic-accent">for your family?</em>
        </h2>
        <ButtonLink to="/contact">{person ? `Talk with ${plainName(person.name).split(' ')[0]}` : 'Start a conversation'}</ButtonLink>
      </section>
    </Page>
  );
}

function BlockView({ b, first }: { b: Block; first: boolean }) {
  switch (b.t) {
    case 'p':
      return <p className={first ? 'text-[1.15em] text-ink' : ''} dangerouslySetInnerHTML={{ __html: html(b.html) }} />;
    case 'h':
      return <h2>{b.text}</h2>;
    case 'ul':
      return (
        <ul>
          {b.items.map((it, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: html(it) }} />
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol>
          {b.items.map((it, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: html(it) }} />
          ))}
        </ol>
      );
    case 'quote':
      return <blockquote className="serif border-l-2 border-oxblood pl-6 text-[1.4em] leading-snug text-ink" dangerouslySetInnerHTML={{ __html: html(b.html) }} />;
    case 'img': {
      const m = imgMeta(`insights/${b.src}`);
      if (!m) return null;
      return (
        <figure className="my-10">
          <Img
            src={`insights/${b.src}`}
            alt={b.alt || 'Illustration accompanying the article'}
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="h-auto rounded-sm bg-paper"
            style={{ width: m.w < 700 ? `${m.w}px` : '100%', maxWidth: '100%' }}
          />
        </figure>
      );
    }
    case 'video':
      return <Video id={b.id} title={b.title} />;
  }
}

/** Click-to-load video: no third-party requests until the visitor asks. */
function Video({ id, title }: { id: string; title: string }) {
  const [on, setOn] = useState(false);
  return (
    <figure className="my-10">
      <div className="relative aspect-video overflow-hidden rounded-sm bg-lake">
        {on ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button type="button" onClick={() => setOn(true)} className="group absolute inset-0 grid place-items-center text-porcelain">
            <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-70 transition-opacity duration-500 group-hover:opacity-85" />
            <span className="relative flex flex-col items-center gap-3">
              <span className="grid h-20 w-20 place-items-center rounded-full bg-porcelain text-ink transition-transform duration-500 group-hover:scale-105">
                <Play size={26} fill="currentColor" aria-hidden />
              </span>
              <span className="rounded-full bg-lake/80 px-4 py-1.5 text-sm font-semibold">Play video: {title}</span>
            </span>
          </button>
        )}
      </div>
      <figcaption className="t-meta mt-3">Video loads from YouTube when played.</figcaption>
    </figure>
  );
}
