export interface MissionBox {
  id: string;
  date: string;       // e.g. "Ce Samedi (14h30 - 17h30)"
  theme: string;      // e.g. "MISSION : IRON MAKER"
  price: string;      // e.g. "400 DHS"
  spotsTotal: number; // e.g. 20
  spotsLeft: number;  // e.g. 4
  status: 'open' | 'limited' | 'full'; // controls badge color
}

export interface StationPole {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface PerkItem {
  id: string;
  text: string;
}

export interface LandingPageData {
  enabled: boolean;
  themeColor?: 'orange' | 'blue' | 'green' | 'red';
  ogImage?: string;
  metaPixel?: string; // Raw <script> block for Meta Pixel / tracking
  layoutVariant?: 'classic' | 'modular';
  ctaMode?: 'booking' | 'lead';

  // Mission Selection (Live vs Static)
  missionIds?: string[]; 
  missionBoxes?: MissionBox[]; // Keep for backward compatibility or static overrides

  // Block 1 Hero
  heroPreHeadline?: string;
  heroHeadline?: string;
  heroSubHeadline?: string;
  heroCtaText?: string;
  heroScarcityText?: string;

  // Block 2 Agitator
  agitatorHeadline?: string;
  agitatorBody?: string;

  // Modular Blocks (Alternative to Missions)
  stationsHeadline?: string;
  stationsSubHeadline?: string;
  stations?: StationPole[];

  perksHeadline?: string;
  perksSubHeadline?: string;
  perks?: PerkItem[];

  // Gallery
  galleryImages?: string[];

  // Block 3 Offer
  offerHeadline?: string;

  // Block 4 Missions (Classic)
  missionsHeadline?: string;
  missionsSubHeadline?: string;

  // Block 5 FAQ
  faqEnabled?: boolean;

  // Block 6 Final CTA
  finalCtaHeadline?: string;
  finalCtaBody?: string;
}

export interface LandingLead {
  id?: string;
  programId: string;
  programTitle: string;
  
  // Single Mission Capture
  missionId?: string;
  missionDate?: string;
  missionTheme?: string;
  
  // Track/Bundle Capture
  trackId?: string;
  trackTitle?: string;

  parentName: string;
  childName: string;
  childAge: string;
  whatsapp: string;
  createdAt: string;

  paymentStatus?: 'Deposit' | 'Full Bundle' | 'Pending';
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  category: string; // e.g. Hardware, Digital Art, Business
  date: string; // e.g., "Ce Samedi (14h30 - 17h30)"
  price: string; // e.g., "400 DHS"
  spotsTotal: number;
  spotsLeft: number;
  status: 'open' | 'limited' | 'full';
  trackId?: string; // Links this mission directly to a bundle
}

export interface Track {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  price: string; // e.g., "1200 DHS"
  benefits: string[]; // Key selling points for the UI cards
}

export interface Program {
  id: string;
  title: string;
  category: string; // e.g. "Enfants & Familles", "Écoles & Éducation"
  tags?: string[];   // e.g. ["Coding", "Robotics"]
  ageGroup: string;
  description: string;
  shortDescription?: string;
  format?: 'Workshop' | 'Year Program' | 'School Program';
  programType?: 'annual' | 'camp' | 'workshop' | 'birthday'; // Enhanced Taxonomy
  childWorkshopIds?: string[]; // Links to sub-workshops (sons)
  parentProgramId?: string;    // Links to parent mission (e.g. Make & Go)
  isFeatured?: boolean;
  image: string;
  imagePrompt?: string;
  ogImage?: string; // Dedicated social media preview image (WhatsApp, etc.)
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
  landingPage?: LandingPageData;
  themeColor?: 'orange' | 'blue' | 'green' | 'red';
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
  ogImage?: string; // Dedicated social media preview image
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
  parentProgramId?: string; // Link to Parent Mission (e.g. Make & Go)
  workshopType?: string;      // Free-form category or type
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
  ogImage?: string; // Dedicated social media preview image for the school landing page
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
