export interface Program {
  id: string;
  title: string;
  category: 'Coding' | 'Robotics' | 'AI' | 'Design' | 'Business';
  ageGroup: string;
  description: string;
  shortDescription?: string;
  format?: 'Workshop' | 'Year Program' | 'School Program';
  isFeatured?: boolean;
  image: string;
  imagePrompt?: string;
  duration: string;
  price: string;
  stats: { name: string; value: number }[];
  active: boolean;
  schedule: string[]; // List of upcoming dates e.g. "12 Nov", "19 Nov"
  benefits?: string; // e.g. "1 Projet Complet + Certif"
  bookingType?: 'internal' | 'external';
  externalBookingUrl?: string;
  spotsAvailable?: number;
  trialAvailable?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string;
  preview: string;
  tags: string[];
  image: string;
  imagePrompt?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export interface DynamicHeroMessage {
  id: string;
  passive: string;
  action: string;
  result: string;
  color: string;
}
