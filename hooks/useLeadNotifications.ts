import { useEffect, useRef, useState, useCallback } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export interface IncomingLead {
  id: string;
  child_name: string;
  parent_name: string;
  lead_tier: 'Tier_1_Hot' | 'Tier_2_Warm' | 'Tier_3_Cold';
  track: string;
  phone: string;
  submitted_at: string;
}

/* ─── Chime generator — Web Audio API, no external files ─────────────────── */
function playChime(tier: IncomingLead['lead_tier']) {
  try {
    const ctx = new AudioContext();
    // HOT → two ascending tones; WARM → single soft tone
    const notes: [number, number][] = tier === 'Tier_1_Hot'
      ? [[523, 0], [659, 0.18], [784, 0.36]]   // C5 E5 G5 — bright triad
      : [[440, 0], [554, 0.2]];                  // A4 C#5 — softer duo

    notes.forEach(([freq, delay]) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.28, ctx.currentTime + delay + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.6);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.7);
    });
  } catch { /* unsupported environment — silent fail */ }
}

/* ─── Browser notification ────────────────────────────────────────────────── */
function fireBrowserNotification(lead: IncomingLead) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const emoji = lead.lead_tier === 'Tier_1_Hot' ? '🔥' : '⚡';
  const track = lead.track?.replace('TRACK_', '') ?? '';
  new Notification(`${emoji} Nouveau lead Make & Go`, {
    body: `${lead.parent_name} → ${lead.child_name} · ${track}`,
    icon: '/logo-icon.png',
    tag:  lead.id,
  });
}

/* ─── Hook ────────────────────────────────────────────────────────────────── */
export function useLeadNotifications() {
  const [toast, setToast]         = useState<IncomingLead | null>(null);
  const [unreadCount, setUnread]  = useState(0);

  const seenIds     = useRef<Set<string>>(new Set());
  const initialized = useRef(false);
  const toastTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Request browser notification permission once */
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {/* user denied */});
    }
  }, []);

  /* Firestore real-time listener */
  useEffect(() => {
    const q = query(
      collection(db, 'make-and-go-leads'),
      orderBy('submitted_at', 'desc'),
      limit(30),
    );

    const unsub = onSnapshot(q, snap => {
      if (!initialized.current) {
        /* Seed existing IDs so we don't fire on historical data */
        snap.docs.forEach(d => seenIds.current.add(d.id));
        initialized.current = true;
        return;
      }

      snap.docChanges().forEach(change => {
        if (change.type !== 'added') return;
        if (seenIds.current.has(change.doc.id)) return;
        seenIds.current.add(change.doc.id);

        const data = { id: change.doc.id, ...change.doc.data() } as IncomingLead;

        /* Only notify for HOT + WARM — ignore COLD */
        if (data.lead_tier === 'Tier_3_Cold') return;

        /* Sound */
        playChime(data.lead_tier);

        /* Browser notification (if permission granted) */
        fireBrowserNotification(data);

        /* In-app toast — show the newest, auto-dismiss after 8 s */
        setToast(data);
        setUnread(n => n + 1);

        if (toastTimer.current) clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(null), 8000);
      });
    });

    return () => {
      unsub();
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  const clearUnread = useCallback(() => setUnread(0), []);

  return { toast, unreadCount, dismissToast, clearUnread };
}
