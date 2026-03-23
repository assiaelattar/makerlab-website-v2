
// Unified configuration for the application
// For Hostinger, the backend might be on a subdomain like https://api.makego.makerlab.academy
// For local development, it dynamically uses the current hostname
export const API_URL = (window as any).VITE_API_URL || (import.meta as any).env?.VITE_API_URL || `http://${window.location.hostname}:5000/api`;
