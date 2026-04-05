import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, Image as ImageIcon, LogOut, Package, CalendarDays, BookOpen, School, Ticket, Menu, X, PenTool, Rocket, Target } from 'lucide-react';

export const AdminLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin');
        if (!isAdmin) {
            navigate('/admin');
        }
    }, [navigate]);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('isAdmin');
        navigate('/admin');
    };

    const navItems = [
        { label: 'Tableau de Bord', path: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Calendrier', path: '/admin/calendar', icon: CalendarDays },
        { label: 'Contenu du Site', path: '/admin/content', icon: FileText },
        { label: 'Programmes', path: '/admin/programs', icon: Package },
        { label: 'Réservations', path: '/admin/bookings', icon: CalendarDays },
        { label: 'Landing Pages', path: '/admin/landing-pages', icon: Rocket },
        { label: 'Missions & Parcours', path: '/admin/missions', icon: Target },
        { label: 'Blog', path: '/admin/blogs', icon: PenTool },
        { label: 'Médias', path: '/admin/media', icon: ImageIcon },
        { label: 'Catalogue Ateliers', path: '/admin/workshop-catalog', icon: BookOpen },
        { label: 'Partenaires', path: '/admin/partners', icon: School },
        { label: 'Gestion Périodes', path: '/admin/periods', icon: CalendarDays },
        { label: 'Offres Scolaires', path: '/admin/offers', icon: Ticket },
        { label: 'Configuration', path: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex font-sans relative">
            {/* Mobile Header Bar */}
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
                <Link to="/" className="text-[10px] font-black uppercase text-gray-400 hover:text-black border-2 border-black/10 px-3 py-1 rounded-full transition-colors">
                    Quitter
                </Link>
            </header>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div 
                    className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r-4 border-black flex flex-col justify-between overflow-y-auto z-50 transition-transform duration-300
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div>
                    <div className="p-6 border-b-4 border-black">
                        <h1 className="font-display font-black text-2xl uppercase tracking-tighter">MakerLab<br /><span className="text-brand-orange">Admin.</span></h1>
                    </div>
                    <nav className="p-4 space-y-2">
                        {navItems.map((item) => {
                            const isActive = location.pathname.startsWith(item.path);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 font-bold rounded-xl border-2 transition-all ${isActive
                                            ? 'bg-brand-orange border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-1 -translate-y-1'
                                            : 'border-transparent text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <item.icon size={20} strokeWidth={isActive ? 3 : 2} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

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

            {/* Main Content Content */}
            <main className="flex-1 p-4 md:p-8 overflow-x-hidden relative min-w-0">
                <div className="lg:hidden h-16" /> {/* Spacer for floating button */}
                <Outlet />
            </main>
        </div>
    );
};

