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
import { ProgramEditor } from './pages/Admin/ProgramEditor';
import { ProgramProvider } from './contexts/ProgramContext';
import { Marquee } from './components/Marquee';

// New Pages
import { Ecoles } from './pages/Ecoles';
import { Adultes } from './pages/Adultes';
import { Store } from './pages/Store';
import { Contact } from './pages/Contact';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <ProgramProvider>
      <Router>
        <ScrollToTop />
        <div className="font-sans text-brand-dark min-h-screen flex flex-col bg-[#fffbeb]">
          <div className="sticky top-0 z-[100] w-full">
            <Marquee />
          </div>

          <Navbar />

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/programs/:id" element={<ProgramDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/register" element={<Register />} />

              {/* New Application Routes */}
              <Route path="/ecoles" element={<Ecoles />} />
              <Route path="/adultes" element={<Adultes />} />
              <Route path="/store" element={<Store />} />
              <Route path="/contact" element={<Contact />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/program/:id" element={<ProgramEditor />} />

              <Route path="*" element={<div className="container py-12 text-center"><h1>404 - Page non trouvée</h1></div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ProgramProvider>
  );
};

export default App;