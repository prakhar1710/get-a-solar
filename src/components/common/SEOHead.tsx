import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://www.getasolar.in';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  canonicalUrl?: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const toAbsolute = (url: string) => {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

export const SEOHead = ({
  title,
  description,
  keywords = "solar panels, solar installation, solar bidding, solar vendors, solar subsidy, renewable energy, India",
  ogImage = "/hero-banner.png",
  ogUrl,
  canonicalUrl,
  jsonLd,
}: SEOHeadProps) => {
  const fullTitle = `${title} | Get A Solar`;
  const currentUrl = ogUrl
    ? toAbsolute(ogUrl)
    : (typeof window !== 'undefined' ? window.location.href : SITE_URL);
  const absoluteImage = toAbsolute(ogImage);
  const absoluteCanonical = canonicalUrl ? toAbsolute(canonicalUrl) : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={absoluteImage} />

      {absoluteCanonical && <link rel="canonical" href={absoluteCanonical} />}

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};
