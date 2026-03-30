export interface Program {
  id: string;
  title: string;
  category: string; // e.g. "Enfants & Familles", "Écoles & Éducation"
  tags?: string[];   // e.g. ["Coding", "Robotics"]
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
  slug: string;
  author: string;
  date: string;
  preview: string;
  content: string;
  tags: string[];
  image: string;
  imagePrompt?: string;
  seoKeywords?: string[];
  status?: 'draft' | 'published';
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

export interface Workshop {
  id: string;
  name: string;
  description: string;
  ageRange: string;
  duration: string;
  image: string;
  tags: string[];
  active: boolean;
}

export interface SchoolPartner {
  id: string;
  name: string;
  slug: string; // Used for subdomain routing: slug.makerlab.academy
  logo: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
}

export interface Period {
  id: string;
  type: 'Trimester' | 'Semester' | 'Year' | 'Holiday';
  name: string; // e.g. "Semester 2 2025"
  startDate: string;
  endDate: string;
}

export interface Offer {
  id: string;
  schoolId: string;
  periodId: string;
  workshopIds: string[]; // Reference to workshops in catalog
  customPrices: Record<string, string>; // workshopId -> price string
  published: boolean;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  offerId: string;
  workshopId: string;
  childName: string;
  childAge: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  status: 'Pending' | 'Confirmed' | 'Paid';
  createdAt: string;
}
