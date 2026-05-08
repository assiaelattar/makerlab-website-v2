import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
    MapPin, 
    CheckCircle2, 
    Wrench, 
    Brain, 
    Gift, 
    MessageCircle,
    ChevronDown,
    ChevronUp,
    ShieldCheck, 
    Landmark, 
    ImageIcon
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { useSettings } from '../contexts/SettingsContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const ReservationLP: React.FC = () => {
    const { settings } = useSettings();
    const config = settings.reservationLPSettings || {
        headline: "Réservez la place de {kidName}",
        subheadline: "Atelier {theme} – {slot} à Maarif",
        urgencyText: "⚠️ Il reste 4 places sur 10",
        priceBadge: "400 MAD",
        cashPlusPhone: "06.21.87.71.06",
        whatsappPhone: "06.21.87.71.06",
        bonusTitle: "Bonus Inclus",
        bonusText: "Confirmez votre place et recevez le guide des 3 projets tech à faire à la maison avec vos enfants !",
        finalCtaHeader: "Dernières places ce weekend",
        finalCtaBody: "Une fois 10/10, nous fermons les inscriptions. Le prochain atelier \"{theme}\" ne sera programmé que dans 3 semaines."
    };
    const [searchParams] = useSearchParams();
    const kidName = searchParams.get('kid') || 'votre enfant';
    const slot = searchParams.get('slot') || 'ce weekend';
    const theme = searchParams.get('theme') || 'Robotique';
    const fromForm = searchParams.get('from') === 'form';

    const [timeLeft, setTimeLeft] = useState(24 * 60 * 60);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // YouTube video ID — set in Admin → Meta LP Editor
    const YOUTUBE_VIDEO_ID = config.youtubeVideoId || '';

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPaymentScreenshot(file);
            const reader = new FileReader();
            reader.onload = (ev) => setScreenshotPreview(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    // Countdown Timer Effect
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Meta Pixel Effects
    useEffect(() => {
        // Fire ViewContent
        if (window.fbq) {
            window.fbq('track', 'ViewContent', {
                content_name: 'Workshop LP',
                value: 400,
                currency: 'MAD'
            });
            
            // If from form, fire Lead
            if (fromForm) {
                window.fbq('track', 'Lead');
            }
        }
    }, [fromForm]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleWhatsAppClick = async () => {
        if (window.fbq) window.fbq('track', 'Contact');

        // ── Save submission to Firestore so admin can track it ──
        try {
            await addDoc(collection(db, 'reservation-submissions'), {
                kidName,
                slot,
                theme,
                whatsappPhone: config.whatsappPhone,
                hasScreenshot: !!paymentScreenshot,
                screenshotName: paymentScreenshot?.name || null,
                submittedAt: new Date().toISOString(),
                source: 'reservation-lp',
            });
            setSubmitted(true);
        } catch (e) {
            console.warn('Could not save submission:', e);
        }

        // ── Open WhatsApp with clean message ──
        const phone = config.whatsappPhone.replace(/[^0-9]/g, '');
        const intl = phone.startsWith('0') ? `212${phone.slice(1)}` : phone.startsWith('212') ? phone : `212${phone}`;
        const msg = encodeURIComponent(
`Salam,

Je viens d'effectuer le virement bancaire de 350 DHS pour la reservation de ${kidName}.

Atelier : ${theme}
Creneau : ${slot}

Veuillez confirmer la reception.`
        );
        window.open(`https://wa.me/${intl}?text=${msg}`, '_blank');
    };

    const formatText = (text: string) => {
        if (!text) return "";
        return text
            .replace(/{kidName}/g, kidName)
            .replace(/{theme}/g, theme)
            .replace(/{slot}/g, slot);
    };

    const faqs = [
        {
            q: "📍 C'est où exactement?",
            a: "Maarif, Casablanca. L'adresse exacte et la position GPS vous seront envoyées sur WhatsApp juste après le dépôt. Parking facile. Station de Tram L1 à proximité."
        },
        {
            q: "👧 Mon enfant est timide / n'a jamais fait ça?",
            a: "C'est parfait. Nous avons des petits groupes de 10 max avec 2 animateurs. Nous sommes spécialisés pour les 6-12 ans débutants. 70% des enfants viennent pour la 1ère fois."
        },
        {
            q: "🎒 Que doit-il emmener?",
            a: "Absolument rien. Tout le matériel technique est inclus. Juste une bouteille d'eau. Un goûter est offert pendant la pause."
        },
        {
            q: "💰 Et si on annule?",
            a: "Le dépôt de 100 MAD est intégralement remboursé si vous annulez 48h avant. S'il est malade le jour J : report gratuit sur le prochain atelier."
        },
        {
            q: "🔄 On peut venir chaque semaine?",
            a: "Oui ! Le thème change chaque weekend. Beaucoup d'enfants font 3 à 4 ateliers par mois. Prochains thèmes : Drone, Piano Électronique, Grue Hydraulique."
        }
    ];

    return (
        <div className="font-sans bg-[#F5F3EE] min-h-screen text-[#111] max-w-[480px] mx-auto shadow-2xl relative pb-20">
            <SEO 
                title={`Confirmez la place de ${kidName} - MakerLab`} 
                description="Finalisez la réservation pour l'atelier MakerLab." 
                noindex={true}
            />

            {/* SECTION 1: STICKY CONFIRMATION BAR */}
            <div className="sticky top-0 z-50 bg-[#111] text-white p-3 text-center text-sm font-bold shadow-md flex flex-col justify-center items-center gap-1">
                <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#27A060]" />
                    <span>Place pré-réservée pour <span className="text-[#27A060]">{kidName}</span> – {slot}</span>
                </div>
                <div className="text-xs text-gray-300">
                    Expire dans <span className="font-mono text-red-400 font-bold tracking-widest">{formatTime(timeLeft)}</span>
                </div>
            </div>

            {/* SECTION 2: HERO */}
            <div className="px-5 py-8 bg-white border-b-4 border-[#111]">
                <h1 className="text-3xl font-black uppercase leading-tight mb-2 tracking-tight" dangerouslySetInnerHTML={{__html: formatText(config.headline).replace(kidName, `<span class="text-[#CC0000]">${kidName}</span>`)}}>
                </h1>
                <h2 className="text-lg font-bold text-gray-600 mb-6">
                    {formatText(config.subheadline)}
                </h2>

                <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-[#111] text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-full">10 enfants max</span>
                    <span className="bg-[#111] text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-full">Matériel inclus</span>
                    <span className="bg-[#CC0000] text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-full shadow-[2px_2px_0px_#111]">{config.priceBadge}</span>
                </div>

                {/* YouTube Video Embed – autoplay, no controls, muted */}
                {YOUTUBE_VIDEO_ID ? (
                  <div className="rounded-2xl border-4 border-[#111] overflow-hidden mb-4 shadow-[6px_6px_0px_#111] relative" style={{paddingBottom:'56.25%', height:0}}>
                      <iframe
                          src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${YOUTUBE_VIDEO_ID}&rel=0&playsinline=1`}
                          title="MakerLab – Présentation"
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                          style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',border:'none'}}
                      />
                  </div>
                ) : (
                  <div className="rounded-2xl border-4 border-dashed border-gray-300 mb-4 bg-gray-50 flex flex-col items-center justify-center text-center p-8 gap-2" style={{minHeight:'180px'}}>
                      <span className="text-3xl">🎬</span>
                      <p className="font-black text-sm text-gray-400 uppercase">Vidéo à configurer</p>
                      <p className="text-[10px] text-gray-400">Admin → Meta LP Editor → Vidéo YouTube</p>
                  </div>
                )}

                {/* Urgency bar */}
                <div className="flex items-center gap-2 font-bold text-sm mb-4 text-red-600 bg-red-50 border-2 border-red-200 rounded-xl px-4 py-2">
                    <span>⚠️</span> {formatText(config.urgencyText)}
                </div>

                {/* Primary CTA below video */}
                <div className="space-y-3">
                    <a href="#paiement" className="block w-full h-14 bg-[#CC0000] text-white font-black text-lg uppercase rounded-xl border-4 border-[#111] shadow-[4px_4px_0px_#111] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2">
                        Je bloque la place → <span className="text-yellow-300">350 DHS</span>
                    </a>
                    <button onClick={handleWhatsAppClick} className="w-full h-12 bg-[#25D366] text-white font-black text-sm uppercase rounded-xl border-2 border-[#111] shadow-[2px_2px_0px_#111] active:translate-y-0.5 transition-all flex items-center justify-center gap-2">
                        <MessageCircle size={20} /> Questions ? WhatsApp
                    </button>
                </div>
            </div>

            {/* BONUS SECTION */}
            <div className="px-5 py-6 bg-brand-orange text-black border-b-4 border-[#111]">
                <div className="flex items-start gap-4">
                    <div className="bg-white p-3 rounded-2xl border-4 border-black shadow-[4px_4px_0_0_black] shrink-0 rotate-[-3deg]">
                        <Gift size={28} className="text-[#CC0000]" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h3 className="font-black text-lg uppercase tracking-tight leading-none mb-1 flex items-center gap-2">
                            {config.bonusTitle}
                        </h3>
                        <p className="font-bold text-sm opacity-90 leading-snug">
                            {formatText(config.bonusText)}
                        </p>
                    </div>
                </div>
            </div>

            {/* SECTION 3: PAIEMENT — 2 options claires */}
            <div id="paiement" className="px-5 py-10">
                <h3 className="text-xl font-black uppercase mb-2 tracking-tight flex items-center gap-2">
                    <Landmark className="text-[#CC0000]" /> Comment payer ?
                </h3>
                <p className="text-sm text-gray-500 font-bold mb-6">Choisissez ce qui vous convient :</p>

                <div className="space-y-5">

                    {/* Option 1: Virement bancaire */}
                    <div className="bg-white rounded-2xl border-4 border-[#111] p-5 shadow-[6px_6px_0px_#111]">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-[#111] rounded-xl flex items-center justify-center shrink-0">
                                <Landmark size={20} className="text-white" />
                            </div>
                            <div>
                                <h4 className="font-black text-base uppercase leading-none">Virement bancaire</h4>
                                <p className="text-xs text-gray-500 font-bold mt-0.5">Attijariwafa Bank — MakerLab Academy</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-4 mb-4">
                            <p className="text-[10px] font-black uppercase text-gray-400 mb-2">🔢 RIB</p>
                            <p className="font-mono font-black text-[#111] text-sm tracking-wider bg-white border border-gray-200 rounded-lg px-3 py-2">
                                835 780 030017780736 70124 8
                            </p>
                            <p className="text-xs text-gray-500 font-bold mt-2">Montant : <span className="text-[#CC0000] font-black">350 DHS</span></p>
                        </div>

                        {/* Screenshot Upload */}
                        <p className="text-xs font-black uppercase text-gray-500 mb-2">📸 Joindre la capture du virement</p>
                        <div
                            className="border-4 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-[#CC0000] hover:bg-red-50 transition-all mb-4"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {screenshotPreview ? (
                                <img src={screenshotPreview} alt="Aperçu reçu" className="max-h-40 mx-auto rounded-lg object-contain" />
                            ) : (
                                <div className="flex flex-col items-center gap-1.5 text-gray-400">
                                    <ImageIcon size={28} />
                                    <span className="text-xs font-bold">Appuyez pour joindre la photo</span>
                                </div>
                            )}
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileChange} />
                        {paymentScreenshot && (
                            <p className="text-[10px] font-black text-[#27A060] uppercase mb-3 text-center">✅ {paymentScreenshot.name}</p>
                        )}

                        <button 
                            onClick={handleWhatsAppClick} 
                            className="w-full py-3 bg-[#25D366] text-white font-black text-sm uppercase rounded-xl border-2 border-[#111] shadow-[2px_2px_0px_#111] active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <MessageCircle size={16} /> J'ai effectue le virement
                        </button>
                        {submitted && (
                            <p className="text-[10px] font-black text-[#27A060] uppercase mt-2 text-center">Message envoye. Nous allons confirmer sous peu.</p>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-gray-300" />
                        <span className="text-xs font-black uppercase text-gray-400">ou</span>
                        <div className="flex-1 h-px bg-gray-300" />
                    </div>

                    {/* Option 2: En personne */}
                    <div className="bg-white rounded-2xl border-4 border-[#111] p-5 shadow-[4px_4px_0px_#111]">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-[#111] rounded-xl flex items-center justify-center shrink-0">
                                <MapPin size={20} className="text-brand-orange" />
                            </div>
                            <div>
                                <h4 className="font-black text-base uppercase leading-none">Passer à l'academy</h4>
                                <p className="text-xs text-gray-500 font-bold mt-0.5">Paiement sur place — en espèces</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-4 text-sm space-y-2">
                            <div className="flex items-start gap-2">
                                <span className="text-base shrink-0">📍</span>
                                <span className="font-bold text-[#111] leading-snug">Espace Anfa, Bât. N°294, Yacoub El Mansour, 2ème Étg N°05 — Casablanca</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-base shrink-0">📱</span>
                                <a href="tel:0621877106" className="font-black text-[#111] underline">0621 877 106</a>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-base shrink-0">📞</span>
                                <a href="tel:0520990202" className="font-black text-[#111] underline">0520 99 02 02</a>
                            </div>
                        </div>
                    </div>

                    {/* Urgency */}
                    <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl px-4 py-3 text-yellow-800 font-black text-xs uppercase text-center">
                        ⚠️ Place tenue jusqu'à ce soir uniquement
                    </div>

                </div>
            </div>

            {/* SECTION 4: POURQUOI LES PARENTS REVIENNENT */}
            <div className="px-5 py-10 bg-[#111] text-white">
                <h3 className="text-2xl font-black uppercase mb-8 leading-tight">Ce qui se passe <br/>en <span className="text-[#CC0000]">90 minutes</span></h3>
                
                <div className="space-y-6 mb-8">
                    <div className="flex gap-4 items-start">
                        <div className="bg-white/10 p-2.5 rounded-xl shrink-0"><Wrench size={20} className="text-[#CC0000]" /></div>
                        <div>
                            <h4 className="font-black uppercase text-sm mb-1">Il construit de A à Z</h4>
                            <p className="text-sm text-gray-400 leading-snug">Pas de kit pré-fait type Lego. Vraie fierté d'ingénieur.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="bg-white/10 p-2.5 rounded-xl shrink-0"><Brain size={20} className="text-[#CC0000]" /></div>
                        <div>
                            <h4 className="font-black uppercase text-sm mb-1">Il comprend comment ça marche</h4>
                            <p className="text-sm text-gray-400 leading-snug">Moteur, circuit, design. Il apprend la vraie logique.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="bg-white/10 p-2.5 rounded-xl shrink-0"><Gift size={20} className="text-[#CC0000]" /></div>
                        <div>
                            <h4 className="font-black uppercase text-sm mb-1">Il repart avec sa création</h4>
                            <p className="text-sm text-gray-400 leading-snug">+ une fiche de projets à refaire à la maison.</p>
                        </div>
                    </div>
                </div>



                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 relative">
                    <div className="absolute -top-3 -left-3 text-4xl opacity-50">"</div>
                    <p className="text-sm font-medium italic text-gray-300 mb-3 relative z-10 leading-relaxed">
                        "Salma, 8 ans, m'a demandé quand était le prochain atelier dès qu'on est rentrées. Merci 🙏"
                    </p>
                    <p className="text-[10px] font-black uppercase text-gray-500 tracking-wider">
                        — Maman de Salma, 2ème atelier
                    </p>
                </div>
            </div>

            {/* SECTION 5: INFOS PRATIQUES */}
            <div className="px-5 py-10">
                <h3 className="text-xl font-black uppercase mb-6 tracking-tight border-b-4 border-[#111] inline-block pb-1">Infos pratiques</h3>
                
                <div className="space-y-3">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border-2 border-[#111] rounded-xl bg-white overflow-hidden shadow-[2px_2px_0px_#111]">
                            <button 
                                className="w-full px-4 py-4 flex justify-between items-center font-black text-sm text-left uppercase"
                                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                            >
                                <span className="pr-4">{faq.q}</span>
                                {openFaq === index ? <ChevronUp size={16} className="shrink-0" /> : <ChevronDown size={16} className="shrink-0" />}
                            </button>
                            {openFaq === index && (
                                <div className="px-4 pb-4 pt-1 text-sm font-medium text-gray-600 border-t-2 border-gray-100 bg-gray-50">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* SECTION 6: URGENCE + FINAL CTA */}
            <div className="px-5 py-12 bg-[#CC0000] text-white text-center border-y-4 border-[#111]">
                <h3 className="text-3xl font-black uppercase mb-3" dangerouslySetInnerHTML={{__html: formatText(config.finalCtaHeader).replace(/\n/g, '<br/>')}}></h3>
                <p className="text-sm font-bold mb-8 opacity-90 max-w-sm mx-auto">
                    {formatText(config.finalCtaBody)}
                </p>
                
                <button 
                    onClick={() => {
                        handleWhatsAppClick();
                        if (window.fbq) window.fbq('track', 'Lead'); // Fire Lead again on final intent
                    }} 
                    className="w-full h-16 bg-[#25D366] text-white font-black text-sm uppercase rounded-xl border-4 border-[#111] shadow-[6px_6px_0px_#111] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 mb-4"
                >
                    <MessageCircle size={24} /> Confirmer ma réservation
                </button>
                <p className="text-xs font-bold opacity-80">
                    Ou des questions ? WhatsApp {config.whatsappPhone}
                </p>
            </div>

            {/* SECTION 7: FOOTER */}
            <footer className="px-5 py-8 bg-[#111] text-gray-500">
                <div className="text-center mb-5">
                    <p className="text-white font-black text-xs uppercase tracking-widest mb-1">Future Makers</p>
                    <p className="text-[10px] font-bold text-gray-400 leading-relaxed">
                        Reg. De Commerce N°506877 Casablanca<br />
                        IF 50314209<br />
                        ICE : 002798577000063
                    </p>
                </div>
                <div className="border-t border-white/10 pt-4 text-center space-y-1">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        Espace Anfa N°294, Yacoub El Mansour, 2ème Étg N°05 — Casablanca
                    </p>
                    <p className="text-[10px] font-bold text-gray-600">
                        MakerLab Academy est une marque de Future Makers
                    </p>
                    <p className="text-[10px] font-bold text-gray-600">
                        Instagram @makerlab.ma &nbsp;·&nbsp; WhatsApp {config.whatsappPhone}
                    </p>
                </div>
                <div className="flex justify-center items-center gap-1 opacity-40 mt-4">
                    <ShieldCheck size={11} />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Données sécurisées. Jamais de spam.</span>
                </div>
            </footer>
        </div>
    );
};
