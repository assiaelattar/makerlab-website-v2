import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Settings, Image as ImageIcon,
  LogOut, Package, CalendarDays, BookOpen, School, Ticket,
  Menu, X, PenTool, Rocket, Target, Sparkles, Flame,
  ThermometerSun, Bell, ExternalLink,
} from 'lucide-react';
import { useLeadNotifications } from '../hooks/useLeadNotifications';

/* ─── Toast component ────────────────────────────────────────────────────── */
const TRACK_LABEL: Record<string, string> = {
  TRACK_ROBOT:   '🤖 Robot Autonome',
  TRACK_FOUNDER: '👕 T-Shirt Design',
  TRACK_GAME:    '🎮 Retro Arcade',
  TRACK_MAKER:   '🔧 Coffre-Fort Laser',
};

interface ToastProps {
  lead: {
    id: string;
    child_name: string;
    parent_name: string;
    lead_tier: string;
    track: string;
    phone: string;
  };
  onDismiss: () => void;
}

const LeadToast: React.FC<ToastProps> = ({ lead, onDismiss }) => {
  const isHot  = lead.lead_tier === 'Tier_1_Hot';

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-[200] w-80 rounded-2xl border-4 border-black
        shadow-[6px_6px_0_0_rgba(0,0,0,1)] animate-in slide-in-from-bottom-4 fade-in duration-300
        ${isHot ? 'bg-[#CC0000] text-white' : 'bg-[#E8580A] text-black'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-black/20">
        <div className="flex items-center gap-2">
          {isHot
            ? <Flame size={16} className="animate-pulse" />
            : <ThermometerSun size={16} />
          }
          <span className="font-display font-black text-[10px] uppercase tracking-widest">
            {isHot ? '🔥 HOT Lead' : '⚡ WARM Lead'}
          </span>
        </div>
        <button
          onClick={onDismiss}
          className="p-1 rounded-lg hover:bg-black/10 transition-colors"
        >
          <X size={14} strokeWidth={3} />
        </button>
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        <p className="font-display font-black text-base uppercase leading-tight mb-0.5">
          {lead.parent_name} → {lead.child_name}
        </p>
        <p className={`text-[10px] font-black uppercase tracking-wide ${isHot ? 'text-white/70' : 'text-black/60'}`}>
          {TRACK_LABEL[lead.track] ?? lead.track}
        </p>
        <p className={`text-[10px] font-sans mt-1 ${isHot ? 'text-white/60' : 'text-black/50'}`}>
          {lead.phone}
        </p>
      </div>

      {/* CTA */}
      <div className="px-4 pb-4 flex gap-2">
        <Link
          to="/admin/leads"
          onClick={onDismiss}
          className={`
            flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border-2 border-black
            font-display font-black text-[10px] uppercase tracking-wide transition-all
            shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5
            ${isHot ? 'bg-white text-black' : 'bg-black text-white'}
          `}
        >
          <ExternalLink size={12} /> Voir le lead
        </Link>
        <a
          href={`https://wa.me/${lead.phone.replace(/\s+/g, '').replace(/^\+/, '')}?text=${encodeURIComponent(`Bonjour ! Je vous contacte suite à votre demande Make & Go pour ${lead.child_name} 🚀`)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onDismiss}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border-2 border-black bg-[#25D366] text-white font-display font-black text-[10px] uppercase shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
        >
          WA
        </a>
      </div>
    </div>
  );
};

/* ─── Main Layout ─────────────────────────────────────────────────────────── */
export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { toast, unreadCount, dismissToast, clearUnread } = useLeadNotifications();

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) navigate('/admin');
  }, [navigate]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin');
  };

  const navItems = [
    { label: '🚀 Centre de Lancement', path: '/admin/setup',           icon: Rocket },
    { label: 'Tableau de Bord',    path: '/admin/dashboard',       icon: LayoutDashboard },
    { label: 'Calendrier',          path: '/admin/calendar',         icon: CalendarDays },
    { label: 'Contenu du Site',     path: '/admin/content',          icon: FileText },
    { label: 'Programmes',          path: '/admin/programs',         icon: Package },
    { label: 'Réservations',        path: '/admin/bookings',         icon: CalendarDays },
    { label: 'Landing Pages',       path: '/admin/landing-pages',    icon: Rocket },
    { label: 'Missions & Parcours', path: '/admin/missions',         icon: Target },
    { label: '🎯 Make & Go Leads', path: '/admin/leads',            icon: Sparkles, badge: true },
    { label: 'Blog',                path: '/admin/blogs',            icon: PenTool },
    { label: 'Médias',              path: '/admin/media',            icon: ImageIcon },
    { label: 'Catalogue Ateliers',  path: '/admin/workshop-catalog', icon: BookOpen },
    { label: 'Partenaires',         path: '/admin/partners',         icon: School },
    { label: 'Gestion Périodes',    path: '/admin/periods',          icon: CalendarDays },
    { label: 'Offres Scolaires',    path: '/admin/offers',           icon: Ticket },
    { label: 'Configuration',       path: '/admin/settings',         icon: Settings },
  ];

  const isLeadsPage = location.pathname.startsWith('/admin/leads');

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans relative">

      {/* ── Mobile Header ─────────────────────────────────────────────────── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b-4 border-black z-[60] flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-brand-orange border-2 border-black shadow-neo-sm hover:shadow-none transition-all rounded-lg active:scale-95"
          >
            {isSidebarOpen ? <X size={24} strokeWidth={3} /> : <Menu size={24} strokeWidth={3} />}
          </button>
          <h1 className="font-display font-black text-lg uppercase tracking-tighter leading-none">
            MakerLab <span className="text-brand-orange">Admin.</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Bell with badge — mobile */}
          {unreadCount > 0 && (
            <Link
              to="/admin/leads"
              onClick={clearUnread}
              className="relative p-2 bg-[#CC0000] text-white border-2 border-black rounded-xl shadow-neo-sm animate-pulse"
            >
              <Bell size={18} />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-black text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </Link>
          )}
          <Link to="/" className="text-[10px] font-black uppercase text-gray-400 hover:text-black border-2 border-black/10 px-3 py-1 rounded-full transition-colors">
            Quitter
          </Link>
        </div>
      </header>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ───────────────────────────────────────────────────────── */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r-4 border-black flex flex-col justify-between overflow-y-auto z-50 transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div>
          {/* Logo */}
          <div className="p-6 border-b-4 border-black flex items-center justify-between">
            <h1 className="font-display font-black text-2xl uppercase tracking-tighter">
              MakerLab<br /><span className="text-brand-orange">Admin.</span>
            </h1>
            {/* Bell with badge — desktop sidebar */}
            {unreadCount > 0 && (
              <Link
                to="/admin/leads"
                onClick={clearUnread}
                className="relative p-2 bg-[#CC0000] text-white border-2 border-black rounded-xl shadow-neo-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all animate-pulse"
                title={`${unreadCount} nouveau(x) lead(s)`}
              >
                <Bell size={16} />
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-black text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </Link>
            )}
          </div>

          {/* Nav */}
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              const showBadge = (item as any).badge && unreadCount > 0 && !isLeadsPage;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => { if ((item as any).badge) clearUnread(); }}
                  className={`
                    flex items-center gap-3 px-4 py-3 font-bold rounded-xl border-2 transition-all
                    ${isActive
                      ? 'bg-brand-orange border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-1 -translate-y-1'
                      : 'border-transparent text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  <item.icon size={20} strokeWidth={isActive ? 3 : 2} />
                  <span className="flex-1">{item.label}</span>
                  {showBadge && (
                    <span className="w-5 h-5 bg-[#CC0000] text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-black animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t-4 border-black pb-8">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 font-bold rounded-xl border-2 border-transparent text-red-600 hover:bg-red-50 hover:border-red-200 w-full transition-colors"
          >
            <LogOut size={20} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden relative min-w-0">
        <div className="lg:hidden h-16" /> {/* Spacer for mobile header */}
        <Outlet />
      </main>

      {/* ── In-app Toast ──────────────────────────────────────────────────── */}
      {toast && (
        <LeadToast lead={toast} onDismiss={dismissToast} />
      )}
    </div>
  );
};
