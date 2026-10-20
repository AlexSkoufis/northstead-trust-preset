import type { CSSProperties } from 'react';
import manifest from '../data/image-manifest.json';

type Entry = { w: number; h: number; widths: number[]; blur: string };
const M = manifest as Record<string, Entry>;

type Props = {
  /** manifest key, e.g. "photo/hero-horizon" */
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  style?: CSSProperties;
  position?: string;
  priority?: boolean;
  /** drift inside the frame while scrolling (desktop, motion allowed) */
  drift?: boolean;
};

export const imgUrl = (key: string, width?: number) => {
  const e = M[key];
  if (!e) return '';
  const w = width ? (e.widths.find((x) => x >= width) ?? e.widths.at(-1)) : e.widths.at(-1);
  return `/img/${key}-${w}.webp`;
};

export const hasImg = (key: string | null | undefined): key is string => !!key && !!M[key];

/** Responsive WebP image with intrinsic size (no layout shift) and a blur placeholder. */
export function Img({ src, alt, sizes = '100vw', className, style, position, priority, drift }: Props) {
  const e = M[src];
  if (!e) return null;
  return (
    <img
      src={`/img/${src}-${e.widths.find((w) => w >= 1000) ?? e.widths.at(-1)}.webp`}
      srcSet={e.widths.map((w) => `/img/${src}-${w}.webp ${w}w`).join(', ')}
      sizes={sizes}
      width={e.w}
      height={e.h}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : undefined}
      className={className}
      data-drift={drift ? '' : undefined}
      style={{
        backgroundImage: `url(${e.blur})`,
        backgroundSize: 'cover',
        backgroundPosition: position,
        objectPosition: position,
        ...style,
      }}
    />
  );
}

export const imgMeta = (key: string | null | undefined): Entry | undefined => (key ? M[key] : undefined);
