import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import { ProgramProvider } from './contexts/ProgramContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { AnnouncementBar } from './components/AnnouncementBar';

import { Schools } from './pages/Schools';
import { KidsFamilies } from './pages/KidsFamilies';
import { Store } from './pages/Store';
import { Contact } from './pages/Contact';
import { ChatAssistant } from './components/ChatAssistant';
import { BackgroundElements } from './components/BackgroundElements';
import { BookingPage } from './pages/BookingPage';
import { AdminBookings } from './pages/Admin/AdminBookings';

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

  return (
    <SettingsProvider>
      <ProgramProvider>
        <Router>
          <ScrollToTop />
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
                <Route path="/register" element={<Register />} />

                {/* New Application Routes */}
                <Route path="/schools" element={<Schools />} />
                <Route path="/kids-families" element={<KidsFamilies />} />
                <Route path="/store" element={<Store />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/booking/:id" element={<BookingPage />} />
                <Route path="/about" element={<div className="container py-20 text-center"><h1 className="font-display text-4xl font-bold">About MakerLab Academy</h1><p className="mt-4">Page en construction</p></div>} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="content" element={<AdminContent />} />
                  <Route path="media" element={<AdminMedia />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="bookings" element={<AdminBookings />} />
                  <Route path="programs" element={<AdminDashboard />} /> {/* Alias for dashboard since dashboard IS programs list */}
                  <Route path="program/:id" element={<ProgramEditor />} />
                </Route>

                <Route path="*" element={<div className="container py-12 text-center"><h1>404 - Page non trouvée</h1></div>} />
              </Routes>
            </main>
            <ChatAssistant />
            <Footer />
          </div>
        </Router>
      </ProgramProvider>
    </SettingsProvider>
  );
};

export default App;