
// Unified configuration for the application
// For Hostinger, the backend might be on a subdomain like https://api.makego.makerlab.academy
// For local development, it defaults to localhost:5000
export const API_URL = (window as any).VITE_API_URL || 'http://localhost:5000/api';
