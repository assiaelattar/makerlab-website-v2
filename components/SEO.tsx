import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string | string[];
  image?: string;
  url?: string;
  schemaType?: string;
  schemaData?: Record<string, unknown> | Record<string, unknown>[];
  noIndex?: boolean;
}

const SITE_URL = 'https://space.makerlab.academy';
const ORGANIZATION_ID = `${SITE_URL}/#organization`;

const absoluteUrl = (value: string, base = SITE_URL) => {
  try {
    return new URL(value, base).toString();
  } catch {
    return value;
  }
};

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  schemaType,
  schemaData,
  noIndex = false,
}) => {
  const location = useLocation();
  const baseTitle = 'MakerLab Academy | Robotique, coding et IA pour enfants à Casablanca';
  const baseDescription = 'MakerLab Academy aide les enfants de 6 à 16 ans à concevoir, coder, fabriquer et présenter de vrais projets en robotique, IA, électronique et design 3D à Casablanca.';
  const baseKeywords = 'robotique enfants Casablanca, coding enfants Maroc, atelier intelligence artificielle, impression 3D enfants, STEM Casablanca';

  useEffect(() => {
    const canonicalUrl = absoluteUrl(url || location.pathname || '/');
    const pageTitle = title
      ? (title.toLowerCase().includes('makerlab') ? title : `${title} | MakerLab Academy`)
      : baseTitle;
    const pageDescription = description || baseDescription;
    const pageImage = absoluteUrl(image || '/logo-full.png');

    document.title = pageTitle;

    const updateMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const updateProperty = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const updateLink = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!element) {
        element = document.createElement('link');
        element.rel = rel;
        document.head.appendChild(element);
      }
      element.href = href;
    };

    updateMeta('description', pageDescription);
    updateMeta('keywords', Array.isArray(keywords) ? keywords.join(', ') : (keywords || baseKeywords));
    updateMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    updateMeta('googlebot', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    updateLink('canonical', canonicalUrl);

    updateProperty('og:title', pageTitle);
    updateProperty('og:description', pageDescription);
    updateProperty('og:image', pageImage);
    updateProperty('og:url', canonicalUrl);
    updateProperty('og:type', schemaType === 'Article' ? 'article' : 'website');
    updateProperty('og:site_name', 'MakerLab Academy');
    updateProperty('og:locale', 'fr_FR');

    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', pageTitle);
    updateMeta('twitter:description', pageDescription);
    updateMeta('twitter:image', pageImage);

    const organization = {
      '@type': 'EducationalOrganization',
      '@id': ORGANIZATION_ID,
      name: 'MakerLab Academy',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo-full.png` },
      description: baseDescription,
      address: { '@type': 'PostalAddress', addressLocality: 'Casablanca', addressCountry: 'MA' },
      areaServed: { '@type': 'City', name: 'Casablanca' },
    };

    const webPage = {
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: pageTitle,
      description: pageDescription,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': ORGANIZATION_ID },
      primaryImageOfPage: { '@type': 'ImageObject', url: pageImage },
      inLanguage: 'fr-FR',
    };

    const customItems = schemaData
      ? (Array.isArray(schemaData) ? schemaData : [{ '@type': schemaType || 'Thing', ...schemaData }])
      : [];
    const graph: Record<string, unknown>[] = [webPage];

    if (location.pathname === '/') {
      graph.unshift(
        organization,
        {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          url: SITE_URL,
          name: 'MakerLab Academy',
          publisher: { '@id': ORGANIZATION_ID },
          inLanguage: 'fr-FR',
        },
      );
    }

    customItems.forEach(item => graph.push({
      ...item,
      '@id': item['@id'] || `${canonicalUrl}#primary`,
      url: item.url || canonicalUrl,
    }));

    let script = document.getElementById('json-ld-schema') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'json-ld-schema';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  }, [title, description, keywords, image, url, location.pathname, schemaType, schemaData, noIndex]);

  return null;
};
