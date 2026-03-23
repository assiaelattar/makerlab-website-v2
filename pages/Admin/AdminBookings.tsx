
import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Trash2, CheckCircle, Clock, Baby, User, Calendar, Mail, Phone, Filter } from 'lucide-react';

interface Booking {
    id: string;
    programTitle: string;
    bookingType: 'workshop' | 'trial';
    parentName: string;
    parentEmail: string;
    parentPhone: string;
    childName: string;
    childAge: string;
    preferredDate: string;
    notes?: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt: string;
}

export const AdminBookings: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [filter, setFilter] = useState<'all' | 'workshop' | 'trial'>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'website-bookings'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
            setBookings(data);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const updateStatus = async (id: string, status: 'confirmed' | 'cancelled' | 'pending') => {
        await updateDoc(doc(db, 'website-bookings', id), { status });
    };

    const deleteBooking = async (id: string) => {
        if (window.confirm('Supprimer cette réservation ?')) {
            await deleteDoc(doc(db, 'website-bookings', id));
        }
    };

    const filtered = bookings.filter(b => filter === 'all' || b.bookingType === filter);

    return (
        <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="font-display font-black text-4xl uppercase mb-2">Réservations</h1>
                    <p className="text-gray-500 font-bold">Gérez les inscriptions aux workshops et ateliers d'essai.</p>
                </div>

                <div className="flex items-center gap-3 bg-white border-2 border-black p-2 rounded-xl shadow-neo-sm">
                    <Filter size={18} />
                    <select 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value as any)}
                        className="font-bold outline-none bg-transparent uppercase text-xs"
                    >
                        <option value="all">Tous les types</option>
                        <option value="workshop">Workshops Payants</option>
                        <option value="trial">Ateliers d'Essai</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-red border-t-transparent"></div>
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white border-4 border-black p-20 rounded-3xl text-center shadow-neo">
                    <p className="font-display font-black text-2xl text-gray-300 uppercase">Aucune réservation trouvée</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filtered.map((booking) => (
                        <div 
                            key={booking.id} 
                            className={`bg-white border-4 border-black rounded-3xl p-6 shadow-neo-sm hover:shadow-neo transition-all relative overflow-hidden ${
                                booking.status === 'confirmed' ? 'border-brand-green' : 
                                booking.status === 'cancelled' ? 'opacity-60 border-gray-300' : ''
                            }`}
                        >
                            {/* Type Badge */}
                            <div className={`absolute top-0 right-0 px-4 py-1 font-black text-[10px] uppercase border-b-2 border-l-2 border-black ${
                                booking.bookingType === 'trial' ? 'bg-brand-blue' : 'bg-brand-red text-white'
                            }`}>
                                {booking.bookingType === 'trial' ? 'Essai Gratuit' : 'Workshop Payant'}
                            </div>

                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Program & Child */}
                                <div className="lg:w-1/3">
                                    <h3 className="font-display font-black text-xl uppercase mb-4 leading-tight">{booking.programTitle}</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 font-bold text-sm">
                                            <Baby size={16} className="text-brand-red" />
                                            <span>{booking.childName} ({booking.childAge})</span>
                                        </div>
                                        <div className="flex items-center gap-2 font-bold text-sm">
                                            <Calendar size={16} className="text-brand-red" />
                                            <span>Session : {booking.preferredDate}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 p-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-xs flex items-center gap-2 font-bold text-gray-400">
                                        <Clock size={14} /> Reçu le {new Date(booking.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>

                                {/* Parent Info */}
                                <div className="lg:w-1/3 border-l-0 lg:border-l-4 border-black border-dashed pl-0 lg:pl-8">
                                    <div className="flex items-center gap-2 font-black text-xs uppercase mb-4 opacity-40">Contact Parent</div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 font-bold">
                                            <User size={18} />
                                            <span>{booking.parentName}</span>
                                        </div>
                                        <div className="flex items-center gap-3 font-bold text-brand-red hover:underline underline-offset-4">
                                            <Mail size={18} />
                                            <a href={`mailto:${booking.parentEmail}`}>{booking.parentEmail}</a>
                                        </div>
                                        <div className="flex items-center gap-3 font-bold">
                                            <Phone size={18} />
                                            <a href={`tel:${booking.parentPhone}`}>{booking.parentPhone}</a>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions & Status */}
                                <div className="lg:w-1/3 flex flex-col justify-between items-end gap-4">
                                    <div className={`px-4 py-2 border-2 border-black font-black text-xs uppercase rounded-lg flex items-center gap-2 ${
                                        booking.status === 'confirmed' ? 'bg-brand-green text-white' : 
                                        booking.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-brand-orange text-black'
                                    }`}>
                                        {booking.status === 'pending' && <Clock size={14} />}
                                        {booking.status === 'confirmed' && <CheckCircle size={14} />}
                                        {booking.status === 'cancelled' && <Trash2 size={14} />}
                                        {booking.status}
                                    </div>

                                    {booking.notes && (
                                        <div className="w-full bg-brand-red/10 p-3 rounded-xl border-2 border-black/5 text-xs italic font-medium">
                                            "{booking.notes}"
                                        </div>
                                    )}

                                    <div className="flex gap-2 w-full lg:w-auto">
                                        {booking.status === 'pending' && (
                                            <button 
                                                onClick={() => updateStatus(booking.id, 'confirmed')}
                                                className="flex-1 lg:flex-none bg-brand-green text-white p-3 border-4 border-black shadow-neo-sm hover:shadow-none translate-x-0.5 translate-y-0.5 hover:translate-x-1 hover:translate-y-1 transition-all"
                                            >
                                                <CheckCircle size={20} />
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => deleteBooking(booking.id)}
                                            className="flex-1 lg:flex-none bg-white text-red-500 p-3 border-4 border-black shadow-neo-sm hover:shadow-none hover:bg-red-500 hover:text-white transition-all"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
