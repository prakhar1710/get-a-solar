import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  canonicalUrl?: string;
}

export const SEOHead = ({ 
  title, 
  description, 
  keywords = "solar panels, solar installation, solar bidding, solar vendors, solar subsidy, renewable energy, India",
  ogImage = "/lovable-uploads/80a6e134-e78b-48ea-987c-98347cc06daa.png",
  ogUrl,
  canonicalUrl
}: SEOHeadProps) => {
  const fullTitle = `${title} | Get A Solar`;
  const currentUrl = ogUrl || window.location.href;
  
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
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Viewport for mobile optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Helmet>
  );
};
