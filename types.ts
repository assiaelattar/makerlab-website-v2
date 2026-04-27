export enum MarketingFramework {
  CLASSIC = 'classic',
  PAS = 'pas',
  BAB = 'bab',
  CONTRAST = 'contrast'
}

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

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  category?: string; // e.g. "Robotique", "Art Digital"
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

  // Selected Stations (Dynamic from Program)
  selectedStationIds?: string[];

  // Modular Blocks (Alternative to Missions)
  stationsHeadline?: string;
  stationsSubHeadline?: string;
  stations?: StationPole[];

  perksHeadline?: string;
  perksSubHeadline?: string;
  perks?: PerkItem[];

  // Timeline & Projects (New)
  showStationsAsTimeline?: boolean;
  stationsTimelineHeadline?: string;
  showProjectsSection?: boolean;
  projectsHeadline?: string;
  projectsSubHeadline?: string;
  projects?: ProjectItem[];

  // Demo Slot Reference
  featuredDemoSlotId?: string;

  // Gallery
  galleryImages?: string[];

  // Block 3 Offer
  offerHeadline?: string;

  // Block 4 Missions (Classic)
  missionsHeadline?: string;
  missionsSubHeadline?: string;

  // Block 5 FAQ
  faqEnabled?: boolean;
  faqItems?: { id: string; question: string; answer: string; }[];

  // Block 6 Final CTA
  finalCtaHeadline?: string;
  finalCtaBody?: string;

  // Marketing Framework Content (New)
  framework?: MarketingFramework;
  
  // PAS (Problem-Agitation-Solution)
  problemHeadline?: string;
  problemBody?: string;
  agitationHeadline?: string;
  agitationBody?: string;

  // BAB (Before-After-Bridge)
  beforeHeadline?: string;
  beforeBody?: string;
  afterHeadline?: string;
  afterBody?: string;
  bridgeHeadline?: string;
  bridgeBody?: string;

  // Contrast (Us vs Them)
  comparisonRows?: ComparisonRow[];

  // Premium PAS Components
  heroSurTitre?: string;
  solutionHeadline?: string;
  solutionBody?: string;
  logisticsHeadline?: string;
  logisticsBody?: string;
  showStationsInPAS?: boolean;

  // Pricing Tiers (Funnel Hierarchy)
  showAnnualOffer?: boolean;
  annualPrice?: string;   // e.g. "7500 DHS"
  monthlyPrice?: string;  // e.g. "750 DHS"
  sessionPrice?: string;  // e.g. "400 DHS"

  // Thank You Page Configuration
  thankYou?: {
    headline?: string;
    subHeadline?: string;
    videoUrl?: string;
    benefits?: string[];
    showMarquee?: boolean;
    showTrustPillars?: boolean;
    showPacks?: boolean;
  };
}

export interface ComparisonRow {
  id: string;
  feature: string;
  us: string;
  them: string;
  usBetter: boolean;
}

export interface Funnel {
  id: string;
  programId: string;
  slug: string; // The URL slug: makerlab.ma/lp/this-slug
  name: string; // Internal name for the admin (e.g., "StemQuest - BAB Campaign")
  framework: MarketingFramework;
  active: boolean;
  data: LandingPageData; // The existing configuration structure
  stats?: {
    visits: number;
    leads: number;
  };
  createdAt: string;
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
  notes?: string; // New: capture extra lead info

  // Funnel Attribution
  funnelId?: string;
  funnelSlug?: string;

  selectedPack?: string;
  paymentStatus?: 'Deposit' | 'Full Bundle' | 'Pending';
  demoSlotId?: string; // New: link to specific demo slot
  type?: string;       // New: type of lead (trial, mission, etc)

  // Profile Discovery (New)
  digitalHabits?: string;   // phone / games
  tinkeringHabits?: string; // bricolage
  artisticHabits?: string;  // dessin
}

export interface LeadMagnetLead {
  id?: string;
  childAge:     '7-9' | '10-12' | '13-14' | '15+';
  track:        'ROBOT' | 'FOUNDER' | 'GAME' | 'MAKER';
  experience:   'none' | 'coding' | 'robotics' | 'other';
  availability: 'this-week' | '2-weeks' | '1-month' | 'unsure';
  childName:    string;
  parentName:   string;
  whatsapp:     string;
  score:        number;   // 0–5
  tier:         'HOT' | 'WARM' | 'COLD';
  source:       'lead_magnet_quiz';
  createdAt:    string;
}

export interface MakeAndGoLead {
  id?:             string;
  child_name:      string;
  parent_name:     string;
  phone:           string;
  track:           'TRACK_ROBOT' | 'TRACK_FOUNDER' | 'TRACK_GAME' | 'TRACK_MAKER';
  age_tag:         'AGE_YOUNG' | 'AGE_CORE';
  motivation_tag:  'MOTIVATION_MAKER' | 'MOTIVATION_SCREENS' | 'MOTIVATION_TECH';
  urgency_tag:     'URGENCY_NOW' | 'URGENCY_SOON' | 'URGENCY_LATER' | 'URGENCY_COLD';
  price_tag:       'PRICE_OK' | 'PRICE_MAYBE' | 'PRICE_NO';
  lead_score:      number;   // 0–12
  lead_tier:       'Tier_1_Hot' | 'Tier_2_Warm' | 'Tier_3_Cold';
  submitted_at:    string;   // ISO timestamp
  source:          'make_and_go_quiz';
  wa_sent:         boolean;
  capi_sent:       boolean;
}

export interface OrientationLead {
  id?: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  childName: string;
  childAge: string;
  interests: string[];
  level: string;
  additionalNotes?: string;
  status: 'Pending' | 'Contacted' | 'Closed';
  createdAt: string;
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
  active: boolean;
  
  // High-Precision Scheduling (New)
  isoDate?: string;  // e.g. "2024-04-15"
  startTime?: string; // e.g. "14:30"
  endTime?: string;   // e.g. "17:30"
}

export interface DemoSlot {
  id: string;
  title: string;
  description?: string;
  isoDate: string;
  startTime: string;
  endTime: string;
  spotsTotal: number;
  spotsLeft: number;
  active: boolean;
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface RecurrentSlot {
  id: string;
  title: string;
  daysOfWeek: number[]; // Array of days: 1 (Mon) - 7 (Sun)
  timeSlots: TimeSlot[]; // Array of times for this day
  maxSpots: number;
  active: boolean;
  programId?: string;
}

export interface Track {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  price: string; // e.g., "1200 DHS"
  benefits: string[]; // Key selling points for the UI cards
  active: boolean;
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
  stations?: StationPole[];
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
  selectedPack?: string;
  type?: 'annual' | 'session' | 'trial';
  createdAt: string;
}

export interface MakerProject {
  id?: string;
  status: 'pending' | 'approved';
  createdAt: string;
  makerNames: string[];
  projectTitle: string;
  slug: string;
  category: string;
  pitch: string;
  coverImage: string;
  gallery: string[];
  techStack: string[];
  liveLink?: string;
  repoLink?: string;
  assetLink?: string; // New: Folder link for assets (Drive/Dropbox/etc)
  questId?: string; // Links the submission to a specific template
}

export interface MakerQuest {
  id?: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  guide: string;
  materials: string[];
  coverImage: string;
  active: boolean;
  createdAt: string;
}
