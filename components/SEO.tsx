import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  schemaType?: 'Organization' | 'Course' | 'Event';
  schemaData?: any;
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url,
  schemaType,
  schemaData
}) => {
  const location = useLocation();
  const baseTitle = "MakerLab Academy | Ateliers de Robotique & Coding pour Enfants à Casablanca";
  const baseDescription = "Inscrivez vos enfants au meilleur Camp Robotique à Casablanca. Ateliers 100% pratiques sur les Drones, le Codage et l'Ingénierie. Devenez un Créateur, pas un simple assembleur !";
  const baseKeywords = "robotique enfants Casablanca, camp robotique casablanca, stages de vacances casablanca, école de robotique maroc, drone workshop casablanca, coding for kids maroc";

  useEffect(() => {
    // Update Title
    document.title = title ? `${title} | MakerLab Academy` : baseTitle;

    // Update Meta Tags
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

    updateMeta('description', description || baseDescription);
    updateMeta('keywords', keywords || baseKeywords);
    
    // OG Tags
    updateProperty('og:title', title ? `${title} | MakerLab Academy` : baseTitle);
    updateProperty('og:description', description || baseDescription);
    updateProperty('og:image', image || '/logo-full.png');
    updateProperty('og:url', window.location.origin + location.pathname);
    updateProperty('og:type', 'website');

    // Twitter Tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title ? `${title} | MakerLab Academy` : baseTitle);
    updateMeta('twitter:description', description || baseDescription);
    updateMeta('twitter:image', image || '/logo-full.png');

    // JSON-LD Structured Data
    const scriptId = 'json-ld-schema';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const defaultSchema = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "MakerLab Academy",
      "url": window.location.origin,
      "logo": window.location.origin + "/logo-full.png",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Casablanca",
        "addressCountry": "MA"
      }
    };

    const currentSchema = schemaType && schemaData ? {
        "@context": "https://schema.org",
        "@type": schemaType,
        ...schemaData
    } : defaultSchema;

    script.textContent = JSON.stringify(currentSchema);

    return () => {
        // Optionnel: On peut laisser le script ou le nettoyer au démontage
    };

  }, [title, description, keywords, image, location, schemaType, schemaData]);

  return null; // This component doesn't render anything
};
