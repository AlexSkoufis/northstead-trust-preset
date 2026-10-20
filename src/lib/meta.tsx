const SUFFIX = 'Northstead Trust';

/** React 19 hoists these into <head>. The demo is noindex; remove the robots tag at launch. */
export function Meta({ title, description, image = '/og.jpg' }: { title: string; description: string; image?: string }) {
  const full = title ? `${title} | ${SUFFIX}` : `Northstead Trust | Private Wealth and Trust Services`;
  return (
    <>
      <title>{full}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="noindex, nofollow" />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Northstead Trust" />
      <meta name="twitter:card" content="summary_large_image" />
    </>
  );
}
