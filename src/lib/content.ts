import articlesJson from '../data/articles-index.json';
import peopleJson from '../data/people.json';
import { AUTHORS } from '../data/site';
import { imgMeta } from '../components/Img';

export type Block =
  | { t: 'p'; html: string }
  | { t: 'h'; text: string }
  | { t: 'ul' | 'ol'; items: string[] }
  | { t: 'quote'; html: string }
  | { t: 'img'; src: string; alt: string }
  | { t: 'video'; id: string; title: string };

export type Article = {
  slug: string;
  title: string;
  date: string;
  category: string;
  image: string | null;
  excerpt: string;
  source: string;
  video: boolean;
  hero: string | null;
  author?: string;
};

export type Research = { title: string; date: string; category: string; href: string };

export type BioItem = { label: string; detail?: string };
export type Person = {
  slug: string;
  name: string;
  title: string;
  group: 'executive' | 'advisory' | 'counsel';
  phone: string;
  email: string;
  linkedin: string;
  intro: string[];
  sections: { heading: string; items: BioItem[] }[];
  source: string;
};
export type BoardMember = { slug: string; name: string; role: string; org: string };

export const ARTICLES: Article[] = (articlesJson.articles as Article[])
  .map((a) => ({ ...a, author: AUTHORS[a.slug] }))
  .sort((a, b) => b.date.localeCompare(a.date));
export const RESEARCH: Research[] = articlesJson.research;
export const TEAM: Person[] = peopleJson.team as Person[];
export const BOARD: BoardMember[] = peopleJson.board;

export const articleBySlug = (slug: string) => ARTICLES.find((a) => a.slug === slug);
export const personBySlug = (slug: string) => TEAM.find((p) => p.slug === slug);

export const plainName = (name: string) => name.split(',')[0];
export const credentials = (name: string) => name.split(',').slice(1).join(',').trim();

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const fmtDate = (iso: string, long = false) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${(long ? MONTHS_LONG : MONTHS)[m - 1]} ${d}, ${y}`;
};

export type Cover = { key: string; kind: 'photo' | 'portrait' | 'thumb'; alt: string };

/** First team member named in an article's byline. */
export const authorPerson = (a: Article) =>
  a.author ? TEAM.find((p) => a.author!.includes(plainName(p.name)) || a.author!.includes(plainName(p.name).replace('Steven', 'Steve'))) : undefined;

/**
 * Best verified visual for an article: a large in-body photograph, else the
 * author's team portrait, else the small featured thumbnail.
 */
export function cover(a: Article): Cover | null {
  const hero = a.hero ? `insights/${a.hero}` : null;
  if (hero && (imgMeta(hero)?.w ?? 0) >= 900 && (imgMeta(hero)?.h ?? 0) >= 500) return { key: hero, kind: 'photo', alt: '' };
  const p = authorPerson(a);
  if (p) return { key: `team/${p.slug}`, kind: 'portrait', alt: `Portrait of ${plainName(p.name)}` };
  if (a.image) return { key: `insights/${a.image}`, kind: 'thumb', alt: '' };
  return null;
}
