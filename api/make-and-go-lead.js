/**
 * POST /api/make-and-go-lead
 *
 * Handles the full server-side pipeline for a Make & Go lead:
 *   1. Write to Firestore (make-and-go-leads collection)
 *   2. Fire Meta CAPI Lead event (if META_PIXEL_ID + META_ACCESS_TOKEN set)
 *   3a. Send WhatsApp notification via CallMeBot → Noufissa personal number (HOT/WARM)
 *   3b. Send WhatsApp notification via TextMeBot → MakerLab platform number (HOT/WARM)
 *   4. Return { tier, redirect_url } to client
 *
 * Both notification channels run in parallel via Promise.allSettled.
 * Gracefully degrades — the lead is ALWAYS saved to Firestore first.
 * CAPI and WA failures are non-blocking and never block the response.
 */

import crypto from 'crypto';

// ── Constants ────────────────────────────────────────────────────────────────
const FIRESTORE_PROJECT  = 'edufy-makerlab';
const FIRESTORE_DATABASE = 'websitev2';
const FIRESTORE_API_KEY  = 'AIzaSyCbSdElE-DXh83x02wszjfUcXl9z0iQj1A';
const COLLECTION         = 'make-and-go-leads';

const META_PIXEL_ID     = process.env.META_PIXEL_ID     || '';
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || '';

// CallMeBot — Noufissa personal number
const WA_INTERNAL_NUM   = process.env.WA_INTERNAL_NUMBER || '';
const WA_API_KEY        = process.env.WA_API_KEY         || '';

// TextMeBot — MakerLab platform number (platform.makerlab@gmail.com)
const TEXTMEBOT_API_KEY = process.env.TEXTMEBOT_API_KEY || '';
const TEXTMEBOT_PHONE   = process.env.TEXTMEBOT_PHONE   || '212782076917';

// ── Helpers ──────────────────────────────────────────────────────────────────

/** SHA-256 hash of a normalized phone string (remove spaces, leading +, lowercase) */
function hashPhone(raw) {
  const normalized = raw.replace(/\s+/g, '').replace(/^\+/, '').toLowerCase();
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

/** Dynamic event value based on lead tier */
function tierValue(tier) {
  if (tier === 'Tier_1_Hot')  return 100.00;
  if (tier === 'Tier_2_Warm') return 10.00;
  return 1.00;
}

/** Redirect URL based on tier */
function redirectUrl(tier) {
  if (tier === 'Tier_1_Hot')  return '/priority-booking';
  if (tier === 'Tier_2_Warm') return '/merci';
  return '/decouvrir';
}

/** Firestore REST URL for document creation */
const firestoreWriteUrl = () =>
  `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/${FIRESTORE_DATABASE}/documents/${COLLECTION}?key=${FIRESTORE_API_KEY}`;

/** Firestore REST URL for document update (PATCH) */
const firestoreUpdateUrl = (docId) =>
  `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/${FIRESTORE_DATABASE}/documents/${COLLECTION}/${docId}?key=${FIRESTORE_API_KEY}&currentDocument.exists=true`;

/** Convert a plain JS object to Firestore REST field format */
function toFirestoreFields(obj) {
  const fields = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string')  fields[k] = { stringValue: v };
    else if (typeof v === 'number') fields[k] = { integerValue: String(Math.round(v)) };
    else if (typeof v === 'boolean') fields[k] = { booleanValue: v };
    else if (v === null || v === undefined) fields[k] = { nullValue: null };
  }
  return fields;
}

/** Friendly label for WhatsApp message */
function trackLabel(track) {
  const map = {
    TRACK_ROBOT:   '🤖 Robot Autonome',
    TRACK_FOUNDER: '👕 T-Shirt Design',
    TRACK_GAME:    '🎮 Retro Arcade',
    TRACK_MAKER:   '🔧 Coffre-Fort Laser',
  };
  return map[track] || track;
}

function urgencyLabel(tag) {
  const map = {
    URGENCY_NOW:   'Ce week-end 🔥',
    URGENCY_SOON:  'Dans 2 semaines',
    URGENCY_LATER: 'Vacances scolaires',
    URGENCY_COLD:  'Pas encore sûr',
  };
  return map[tag] || tag;
}

function motivationLabel(tag) {
  const map = {
    MOTIVATION_MAKER:   'Démonte tout — Maker pur',
    MOTIVATION_SCREENS: 'Trop d\'écrans → création',
    MOTIVATION_TECH:    'Bases coding / tech',
  };
  return map[tag] || tag;
}

// ── Step 1: Write to Firestore ────────────────────────────────────────────────
async function writeToFirestore(payload) {
  const doc = {
    fields: toFirestoreFields({
      child_name:     payload.child_name,
      parent_name:    payload.parent_name,
      phone:          payload.phone,
      track:          payload.track,
      age_tag:        payload.age_tag,
      motivation_tag: payload.motivation_tag,
      urgency_tag:    payload.urgency_tag,
      price_tag:      payload.price_tag,
      lead_score:     payload.lead_score,
      lead_tier:      payload.lead_tier,
      submitted_at:   payload.submitted_at,
      wa_sent:        false,
      capi_sent:      false,
      source:         'make_and_go_quiz',
    }),
  };

  const res = await fetch(firestoreWriteUrl(), {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(doc),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Firestore write failed: ${err}`);
  }

  const created = await res.json();
  // Extract doc ID from the full name path e.g. ".../documents/collection/DOCID"
  const parts = (created.name || '').split('/');
  return parts[parts.length - 1];
}

// ── Step 2: Meta CAPI ─────────────────────────────────────────────────────────
async function fireMetaCapi(payload, docId) {
  if (!META_PIXEL_ID || !META_ACCESS_TOKEN) return false;

  const event = {
    event_name:     'Lead',
    event_time:     Math.floor(Date.now() / 1000),
    action_source:  'website',
    user_data: {
      ph: [hashPhone(payload.phone)],
    },
    custom_data: {
      currency:         'MAD',
      value:            tierValue(payload.lead_tier),
      content_name:     'Make & Go',
      content_category: payload.track,
      lead_tier:        payload.lead_tier,
    },
  };

  const res = await fetch(
    `https://graph.facebook.com/v19.0/${META_PIXEL_ID}/events`,
    {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ data: [event], access_token: META_ACCESS_TOKEN }),
    }
  );

  const ok = res.ok;

  // Update capi_sent flag in Firestore (best-effort, non-blocking)
  if (ok && docId) {
    try {
      await fetch(firestoreUpdateUrl(docId), {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ fields: { capi_sent: { booleanValue: true } } }),
      });
    } catch { /* ignore update failure */ }
  }

  return ok;
}

// ── Step 3a: WhatsApp notification via CallMeBot (Noufissa personal number) ──
async function sendCallMeBotNotification(payload) {
  if (!WA_INTERNAL_NUM || !WA_API_KEY) return false;
  if (payload.lead_tier === 'Tier_3_Cold') return false;

  const tierPrefix = payload.lead_tier === 'Tier_1_Hot' ? '*** 🔥 HOT ***' : '>> ⚡ WARM';
  const message = [
    `${tierPrefix} NOUVEAU LEAD — Make & Go`,
    `Enfant : ${payload.child_name} | ${payload.age_tag}`,
    `Parent : ${payload.parent_name}`,
    `WA : ${payload.phone}`,
    `Track : ${trackLabel(payload.track)}`,
    `Score : ${payload.lead_score}/12`,
    `Motivation : ${motivationLabel(payload.motivation_tag)}`,
    `Urgency : ${urgencyLabel(payload.urgency_tag)}`,
    `Prix : ${payload.price_tag}`,
  ].join('\n');

  const encoded  = encodeURIComponent(message);
  const cleanNum = WA_INTERNAL_NUM.replace(/^\+/, '').replace(/\s+/g, '');

  const res = await fetch(
    `https://api.callmebot.com/whatsapp.php?phone=${cleanNum}&text=${encoded}&apikey=${WA_API_KEY}`
  );
  return res.ok;
}

// ── Step 3b: WhatsApp notification via TextMeBot (MakerLab platform number) ──
async function sendTextMeBotNotification(payload) {
  if (!TEXTMEBOT_API_KEY) return false;
  if (payload.lead_tier === 'Tier_3_Cold') return false;

  const tierEmoji  = payload.lead_tier === 'Tier_1_Hot' ? '🔥 HOT' : '⚡ WARM';
  const message = [
    `${tierEmoji} NEW LEAD — Make & Go`,
    `Enfant : ${payload.child_name} | ${payload.age_tag}`,
    `Parent : ${payload.parent_name}`,
    `WA : ${payload.phone}`,
    `Track : ${trackLabel(payload.track)}`,
    `Score : ${payload.lead_score}/12`,
    `Motivation : ${motivationLabel(payload.motivation_tag)}`,
    `Urgency : ${urgencyLabel(payload.urgency_tag)}`,
    `Prix : ${payload.price_tag}`,
  ].join('\n');

  const encoded   = encodeURIComponent(message);
  const cleanNum  = TEXTMEBOT_PHONE.replace(/^\+/, '').replace(/\s+/g, '');

  // TextMeBot API: GET https://api.textmebot.com/send.php?recipient=PHONE&apikey=KEY&text=MSG
  const res = await fetch(
    `https://api.textmebot.com/send.php?recipient=${cleanNum}&apikey=${TEXTMEBOT_API_KEY}&text=${encoded}`
  );
  return res.ok;
}

// ── Main handler ──────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  // CORS preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Parse body (Express already parses JSON; Vercel provides req.body directly)
  let payload;
  try {
    payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  // Basic validation
  const required = ['child_name', 'parent_name', 'phone', 'lead_score', 'lead_tier'];
  for (const field of required) {
    if (!payload[field]) {
      return res.status(400).json({ error: `Missing required field: ${field}` });
    }
  }

  // ── Pipeline ────────────────────────────────────────────────────────────────
  let docId = null;

  // 1. Always write to Firestore first
  try {
    docId = await writeToFirestore(payload);
    console.log(`[make-and-go-lead] Lead saved: ${docId} | tier: ${payload.lead_tier} | score: ${payload.lead_score}`);
  } catch (err) {
    console.error('[make-and-go-lead] Firestore write failed:', err.message);
    // Don't block — still respond with redirect
  }

  // 2. Meta CAPI (non-blocking)
  try {
    const capiOk = await fireMetaCapi(payload, docId);
    if (capiOk) console.log(`[make-and-go-lead] CAPI event fired for ${docId}`);
  } catch (err) {
    console.warn('[make-and-go-lead] CAPI failed (non-blocking):', err.message);
  }

  // 3. Both WA channels fire in parallel — wa_sent = true if either succeeds
  try {
    const [callmebotResult, textmebotResult] = await Promise.allSettled([
      sendCallMeBotNotification(payload),
      sendTextMeBotNotification(payload),
    ]);

    const callmebotOk = callmebotResult.status === 'fulfilled' && callmebotResult.value;
    const textmebotOk = textmebotResult.status === 'fulfilled' && textmebotResult.value;
    const waSent      = callmebotOk || textmebotOk;

    console.log(
      `[make-and-go-lead] WA | CallMeBot: ${callmebotOk ? '✅' : '❌'} | TextMeBot: ${textmebotOk ? '✅' : '❌'}`
    );

    // Update Firestore wa_sent flag if at least one channel succeeded
    if (waSent && docId) {
      try {
        await fetch(firestoreUpdateUrl(docId), {
          method:  'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ fields: { wa_sent: { booleanValue: true } } }),
        });
      } catch { /* ignore update failure */ }
    }
  } catch (err) {
    console.warn('[make-and-go-lead] WA notifications failed (non-blocking):', err.message);
  }

  // ── Respond ─────────────────────────────────────────────────────────────────
  return res.status(200).json({
    success:      true,
    tier:         payload.lead_tier,
    redirect_url: redirectUrl(payload.lead_tier),
  });
}
