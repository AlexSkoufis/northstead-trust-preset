import bodies from '../data/articles.json';
import { AUTHORS } from '../data/site';
import type { Block } from './content';
import { imgMeta } from '../components/Img';

const ALL = bodies as Record<string, Block[]>;

/** Full article body. Trailing signature lines are dropped when a byline is shown instead. */
export function articleBody(slug: string): Block[] {
  const body = [...(ALL[slug] ?? [])];
  const last = body[body.length - 1];
  if (AUTHORS[slug] && last?.t === 'p' && last.html.replace(/<[^>]+>/g, '').length < 70) body.pop();
  // Small square images are CMS headshots that duplicate the byline.
  return body.filter((b) => {
    if (b.t !== 'img') return true;
    const m = imgMeta(`insights/${b.src}`);
    return !(m && m.w <= 320 && Math.abs(m.w - m.h) < 8);
  });
}
