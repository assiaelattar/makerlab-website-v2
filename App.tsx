import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useSettings } from './contexts/SettingsContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Programs } from './pages/Programs';
import { ProgramDetail } from './pages/ProgramDetail';
import { Blog } from './pages/Blog';
import { Register } from './pages/Register';
import { AdminLogin } from './pages/Admin/AdminLogin';
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { AdminSettings } from './pages/Admin/AdminSettings';
import { AdminContent } from './pages/Admin/AdminContent';
import { AdminMedia } from './pages/Admin/AdminMedia';
import { AdminEnrollmentGenerator } from './pages/Admin/AdminEnrollmentGenerator';
import { ProgramEditor } from './pages/Admin/ProgramEditor';
import { AdminLayout } from './components/AdminLayout';
import { WorkshopCatalog } from './pages/Admin/WorkshopCatalog';
import { WorkshopEditor } from './pages/Admin/WorkshopEditor';
import { SchoolPartners } from './pages/Admin/SchoolPartners';
import { SchoolPartnerEditor } from './pages/Admin/SchoolPartnerEditor';
import { Offers } from './pages/Admin/Offers';
import { OfferEditor } from './pages/Admin/OfferEditor';
import { PeriodManager } from './pages/Admin/PeriodManager';
import { SchoolLanding } from './pages/SchoolLanding';
import { ProgramProvider } from './contexts/ProgramContext';
import { SchoolProvider } from './contexts/SchoolContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { MissionProvider } from './contexts/MissionContext';
import { AnnouncementBar } from './components/AnnouncementBar';

import { Schools } from './pages/Schools';
import { KidsFamilies } from './pages/KidsFamilies';
import { Store } from './pages/Store';
import { Contact } from './pages/Contact';
import { About } from './pages/About';
import { BlogDetail } from './pages/BlogDetail';
import { ChatAssistant } from './components/ChatAssistant';
import { BackgroundElements } from './components/BackgroundElements';
import { BookingPage } from './pages/BookingPage';
import { AdminBookings } from './pages/Admin/AdminBookings';
import { AdminBlogs } from './pages/Admin/AdminBlogs';
import { AdminLandingPages } from './pages/Admin/AdminLandingPages';
import { AdminLandingEditor } from './pages/Admin/AdminLandingEditor';
import { AdminMissions } from './pages/Admin/AdminMissions';
import { ProgramLanding } from './pages/ProgramLanding';
import { SocialProofToast } from './components/SocialProofToast';
import { AdminCalendar } from './pages/Admin/AdminCalendar';
import { ThankYou } from './pages/ThankYou';
import { LeadMagnet } from './pages/LeadMagnet';
import { AdminLeadMagnet } from './pages/Admin/AdminLeadMagnet';
import { MakeAndGo } from './pages/MakeAndGo';
import { PriorityBooking } from './pages/PriorityBooking';
import { MerciPage } from './pages/MerciPage';
import { DecouvrirPage } from './pages/DecouvrirPage';
import { AdminLaunchCenter } from './pages/Admin/AdminLaunchCenter';

import { STEMQuestEnrollment } from './pages/STEMQuestEnrollment';
import { SubmitProject } from './pages/SubmitProject';
import { MakerWall } from './pages/MakerWall';
import { ProjectDetail } from './pages/ProjectDetail';
import { AdminMakerWall } from './pages/Admin/AdminMakerWall';
import { AdminMakerQuests } from './pages/Admin/AdminMakerQuests';
import { MakerQuestDetail } from './pages/MakerQuestDetail';
import { AdminSTEMQuestSettings } from './pages/Admin/AdminSTEMQuestSettings';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    // Use 'instant' behavior to prevent any browser scroll restoration interference
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
};

/* ─── Injects GA4 + GSC from admin settings ─────────────────────────────── */
const GlobalAnalytics: React.FC = () => {
  const { settings } = useSettings();

  // Google Analytics 4
  React.useEffect(() => {
    const gaId = settings.googleAnalyticsId;
    if (!gaId) return;
    // avoid duplicating if already loaded
    if (document.querySelector(`script[data-ga-id="${gaId}"]`)) return;

    const s1 = document.createElement('script');
    s1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    s1.async = true;
    s1.setAttribute('data-ga-id', gaId);
    document.head.appendChild(s1);

    const s2 = document.createElement('script');
    s2.setAttribute('data-ga-id', gaId);
    s2.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);} gtag('js',new Date()); gtag('config','${gaId}');`;
    document.head.appendChild(s2);

    return () => {
      document.querySelectorAll(`script[data-ga-id="${gaId}"]`).forEach(el => el.remove());
    };
  }, [settings.googleAnalyticsId]);

  // Google Search Console verification meta tag
  React.useEffect(() => {
    const code = settings.gscVerification;
    const ATTR = 'data-gsc-verification';
    // Remove old tag if any
    document.head.querySelectorAll(`meta[${ATTR}]`).forEach(el => el.remove());
    if (!code) return;
    const meta = document.createElement('meta');
    meta.name = 'google-site-verification';
    meta.content = code;
    meta.setAttribute(ATTR, 'true');
    document.head.appendChild(meta);
    return () => {
      document.head.querySelectorAll(`meta[${ATTR}]`).forEach(el => el.remove());
    };
  }, [settings.gscVerification]);

  return null;
};

const PublicHeader: React.FC<{ scrolled: boolean }> = ({ scrolled }) => {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <div className="sticky top-0 z-[100] w-full flex flex-col pointer-events-none">
      <div className="pointer-events-auto">
        <AnnouncementBar />
        <Navbar scrolled={scrolled} />
      </div>
      <div className="h-1 bg-brand-orange transition-all duration-300 pointer-events-none self-start" style={{ width: scrolled ? '100.1%' : '0%' }}></div>
    </div>
  );
};

const App: React.FC = () => {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🛡️ Global Security: Anti-Copy & Image Protection
  React.useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      // Don't block right-click in Admin panel or on form inputs
      if (window.location.pathname.startsWith('/admin')) return;
      
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (window.location.pathname.startsWith('/admin')) return;

      // Block Ctrl+S (Save), Ctrl+U (View Source)
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 's' || e.key.toLowerCase() === 'u')) {
        e.preventDefault();
      }
    };

    const handleDragStart = (e: DragEvent) => {
      if (window.location.pathname.startsWith('/admin')) return;
      if ((e.target as HTMLElement).tagName === 'IMG') {
        e.preventDefault();
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('dragstart', handleDragStart as any);
    
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('dragstart', handleDragStart as any);
    };
  }, []);

  return (
    <SettingsProvider>
      <MissionProvider>
        <ProgramProvider>
          <SchoolProvider>
            <Router>
              <GlobalAnalytics />
              <ScrollToTop />
              <Routes>
                {/* ── Standalone marketing funnel (no Navbar / Footer) ── */}
                <Route path="/lp/:id" element={<ProgramLanding />} />
                <Route path="/thanks" element={<ThankYou />} />
                <Route path="/stemquest-enrollment/:id?" element={<STEMQuestEnrollment />} />

                {/* ── Make & Go lead funnel — /quiz + /apply both go here ── */}
                <Route path="/quiz"   element={<MakeAndGo />} />
                <Route path="/apply"  element={<MakeAndGo />} />
                <Route path="/priority-booking" element={<PriorityBooking />} />
                <Route path="/merci"     element={<MerciPage />} />
                <Route path="/decouvrir" element={<DecouvrirPage />} />

                {/* ── Admin Routes (Isolated from public layout) ── */}
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="setup" element={<AdminLaunchCenter />} />
                  <Route path="content" element={<AdminContent />} />
                  <Route path="programs" element={<AdminDashboard />} />
                  <Route path="bookings" element={<AdminBookings />} />
                  <Route path="calendar" element={<AdminCalendar />} />
                  <Route path="media" element={<AdminMedia />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="stemquest-settings" element={<AdminSTEMQuestSettings />} />
                  <Route path="blogs" element={<AdminBlogs />} />
                  <Route path="landing-pages" element={<AdminLandingPages />} />
                  <Route path="missions" element={<AdminMissions />} />
                  <Route path="leads" element={<AdminLeadMagnet />} />
                  <Route path="program/:id" element={<ProgramEditor />} />
                  <Route path="maker-wall" element={<AdminMakerWall />} />
                  <Route path="maker-quests" element={<AdminMakerQuests />} />
                  
                  {/* School Partner Admin Routes */}
                  <Route path="workshop-catalog" element={<WorkshopCatalog />} />
                  <Route path="workshop/:id" element={<WorkshopEditor />} />
                  <Route path="partners" element={<SchoolPartners />} />
                  <Route path="partner/:id" element={<SchoolPartnerEditor />} />
                  <Route path="periods" element={<PeriodManager />} />
                  <Route path="offers" element={<Offers />} />
                  <Route path="offer/:id" element={<OfferEditor />} />
                  <Route path="landing/:id" element={<AdminLandingEditor />} />
                  <Route path="generate-enrollment" element={<AdminEnrollmentGenerator />} />
                </Route>

                {/* ── Everything else uses the standard layout shell ── */}
                <Route path="*" element={
                  <div className="font-sans text-brand-dark min-h-screen flex flex-col bg-transparent relative">
                    <BackgroundElements />
                    
                    {/* Unified Sticky Header Container */}
                    <PublicHeader scrolled={scrolled} />

                    <main className="flex-grow relative z-10 animate-in fade-in duration-300">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/programs" element={<Programs />} />
                        <Route path="/programs/:id" element={<ProgramDetail />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:id" element={<BlogDetail />} />
                        <Route path="/register" element={<Register />} />

                        {/* New Application Routes */}
                        <Route path="/schools" element={<Schools />} />
                        <Route path="/kids-families" element={<KidsFamilies />} />
                        <Route path="/store" element={<Store />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/booking/:id" element={<BookingPage />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/submit" element={<SubmitProject />} />
                        <Route path="/maker-wall" element={<MakerWall />} />
                        <Route path="/maker-wall/quest/:slug" element={<MakerQuestDetail />} />
                        <Route path="/maker-wall/:slug" element={<ProjectDetail />} />



                        <Route path="/s/:slug" element={<SchoolLanding />} />

                        <Route path="*" element={<div className="container py-12 text-center"><h1>404 - Page non trouvée</h1></div>} />
                      </Routes>
                    </main>
                    <ChatAssistant />
                    <Footer />
                    <SocialProofToast />
                  </div>
                } />
              </Routes>
            </Router>
          </SchoolProvider>
        </ProgramProvider>
      </MissionProvider>
    </SettingsProvider>
  );
};

export default App;