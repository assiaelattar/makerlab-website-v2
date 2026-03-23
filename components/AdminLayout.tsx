import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, Image as ImageIcon, LogOut, Package, CalendarDays } from 'lucide-react';

export const AdminLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin');
        if (!isAdmin) {
            navigate('/admin');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('isAdmin');
        navigate('/admin');
    };

    const navItems = [
        { label: 'Tableau de Bord', path: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Contenu du Site', path: '/admin/content', icon: FileText },
        { label: 'Programmes', path: '/admin/programs', icon: Package },
        { label: 'Réservations', path: '/admin/bookings', icon: CalendarDays },
        { label: 'Médias', path: '/admin/media', icon: ImageIcon },
        { label: 'Configuration', path: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r-4 border-black flex flex-col justify-between sticky top-0 h-screen overflow-y-auto z-50">
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
            <main className="flex-1 p-8 overflow-x-hidden relative">
                <Outlet />
            </main>
        </div>
    );
};
