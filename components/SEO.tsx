import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url 
}) => {
  const location = useLocation();
  const baseTitle = "MakerLab Academy | Robotics & Coding for Kids in Casablanca";
  const baseDescription = "MakerLab Academy is the leading STEM education center in Casablanca. We offer robotics, coding, AI, and 3D printing workshops for kids and teens (7-17 years). No kits, real engineering!";
  const baseKeywords = "robotique enfants Casablanca, cours de codage Maroc, STEM activities Morocco, coding for kids Casablanca, ateliers scientifiques enfants";

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

  }, [title, description, keywords, image, location]);

  return null; // This component doesn't render anything
};
