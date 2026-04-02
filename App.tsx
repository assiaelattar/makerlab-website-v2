import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
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
              <ScrollToTop />
              <Routes>
                {/* ── Standalone marketing funnel (no Navbar / Footer) ── */}
                <Route path="/lp/:id" element={<ProgramLanding />} />

                {/* ── Everything else uses the standard layout shell ── */}
                <Route path="*" element={
                  <div className="font-sans text-brand-dark min-h-screen flex flex-col bg-transparent relative">
                    <BackgroundElements />
                    
                    {/* Unified Sticky Header Container */}
                    <div className="sticky top-0 z-[100] w-full flex flex-col pointer-events-none">
                      <div className="pointer-events-auto">
                        <AnnouncementBar />
                        <Navbar scrolled={scrolled} />
                      </div>
                      {/* Scroll Progress Bar */}
                      <div className="h-1 bg-brand-orange transition-all duration-300 pointer-events-none self-start" style={{ width: scrolled ? '100.1%' : '0%' }}></div>
                    </div>

                    <main className="flex-grow relative z-10">
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

                        {/* Admin Routes */}
                        <Route path="/admin" element={<AdminLogin />} />
                        <Route path="/admin" element={<AdminLayout />}>
                          <Route path="dashboard" element={<AdminDashboard />} />
                          <Route path="content" element={<AdminContent />} />
                          <Route path="media" element={<AdminMedia />} />
                          <Route path="settings" element={<AdminSettings />} />
                          <Route path="bookings" element={<AdminBookings />} />
                          <Route path="blogs" element={<AdminBlogs />} />
                          <Route path="missions" element={<AdminMissions />} />
                          <Route path="programs" element={<AdminDashboard />} />
                          <Route path="program/:id" element={<ProgramEditor />} />
                          
                          {/* School Partner Admin Routes */}
                          <Route path="workshop-catalog" element={<WorkshopCatalog />} />
                          <Route path="workshop/:id" element={<WorkshopEditor />} />
                          <Route path="partners" element={<SchoolPartners />} />
                          <Route path="partner/:id" element={<SchoolPartnerEditor />} />
                          <Route path="periods" element={<PeriodManager />} />
                          <Route path="offers" element={<Offers />} />
                          <Route path="offer/:id" element={<OfferEditor />} />
                          <Route path="landing-pages" element={<AdminLandingPages />} />
                          <Route path="landing/:id" element={<AdminLandingEditor />} />
                        </Route>

                        <Route path="/s/:slug" element={<SchoolLanding />} />

                        <Route path="*" element={<div className="container py-12 text-center"><h1>404 - Page non trouvée</h1></div>} />
                      </Routes>
                    </main>
                    <ChatAssistant />
                    <Footer />
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