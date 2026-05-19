// backend/routes/events.js — GET /api/events
// Fetches upcoming Melbourne senior/wellness events from Eventbrite and
// returns a normalised list to the frontend.
//
// Design notes:
//   - Uses Node's built-in `https` module instead of `fetch` because this
//     file was written before the Node 18 global fetch was widely available.
//   - Results are cached in-memory for 30 minutes to avoid hammering the
//     Eventbrite API on every page load (free tier is rate-limited).
//   - Events are fetched per-organiser (not by keyword search) so results
//     are curated rather than algorithmically scraped.

const express = require("express");
const router  = express.Router();
const https   = require("https");
const { URL }  = require("url");

const EVENTBRITE_TOKEN = process.env.EVENTBRITE_TOKEN;

// ── In-memory cache ──
// 30-minute TTL balances freshness with API rate limits. A serverless
// cold-start clears this cache, so worst-case a new function instance
// makes one live Eventbrite call before subsequent requests are cached.
let cache = { data: null, expires: 0 };

// Promise-based wrapper around Node's https.request, since `fetch` is not
// guaranteed available in older Node versions on the target deployment.
function httpsGet(urlString, headers) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(urlString);
    const options = {
      hostname: parsed.hostname,
      path:     parsed.pathname + parsed.search,
      method:   "GET",
      headers:  { "Accept": "application/json", ...headers },
    };
    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => { body += chunk; });
      res.on("end", () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(body) }); }
        catch (e) { reject(new Error(`Invalid JSON (status ${res.statusCode}): ${body.slice(0, 300)}`)); }
      });
    });
    req.on("error", reject);
    req.end();
  });
}

// GET /api/events/test — verify token
router.get("/test", async (req, res) => {
  try {
    const { status, data } = await httpsGet(
      "https://www.eventbriteapi.com/v3/users/me/",
      { Authorization: `Bearer ${EVENTBRITE_TOKEN}` }
    );
    res.json({ status, data });
  } catch (err) {
    res.json({ error: err.message });
  }
});

// GET /api/events/test-org — find your organiser ID
router.get("/test-org", async (req, res) => {
  try {
    const { status, data } = await httpsGet(
      "https://www.eventbriteapi.com/v3/users/me/organizations/",
      { Authorization: `Bearer ${EVENTBRITE_TOKEN}` }
    );
    res.json({ status, data });
  } catch (err) {
    res.json({ error: err.message });
  }
});

// GET /api/events/test-organiser?id=XXX — fetch raw events for an organiser
router.get("/test-organiser", async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Pass ?id=ORGANISER_ID" });
  try {
    const params = new URLSearchParams({ "status": "live", "expand": "venue" });
    const { status, data } = await httpsGet(
      `https://www.eventbriteapi.com/v3/organizers/${id}/events/?${params}`,
      { Authorization: `Bearer ${EVENTBRITE_TOKEN}` }
    );
    res.json({ status, events_count: data.events?.length ?? 0, raw: data });
  } catch (err) {
    res.json({ error: err.message });
  }
});

// GET /api/events/organiser?eventId=XXX — extract organiser_id from an event
router.get("/organiser", async (req, res) => {
  const { eventId } = req.query;
  if (!eventId) return res.status(400).json({ error: "Pass ?eventId=XXX" });
  try {
    const { status, data } = await httpsGet(
      `https://www.eventbriteapi.com/v3/events/${eventId}/`,
      { Authorization: `Bearer ${EVENTBRITE_TOKEN}` }
    );
    res.json({
      status,
      event_id:     data.id,
      event_name:   data.name?.text,
      organizer_id: data.organizer_id,
      error:        data.error ?? null,
    });
  } catch (err) {
    res.json({ error: err.message });
  }
});

// ── Curated organiser list ──
// Only events from these known Melbourne senior/wellness organisers are
// shown. This avoids surfacing irrelevant or low-quality search results.
// To add a new organiser: find their Eventbrite URL
//   eventbrite.com.au/o/{name}-XXXXXXX  ← the trailing number is the ID
const MELBOURNE_ORGANISER_IDS = [
  "76900127983",  // Aged & Disability Expo
  "27859048737",  // Carers Victoria - Events
  "77352683853",  // Over60 programs
];

// Per-organiser title filters — used when an organiser runs a mix of events
// and we only want a specific subset surfaced in the app.
const ORGANISER_TITLE_FILTERS = {
  "77352683853": "60",  // Over60 programs — only events with "60" in the title
};

// ── Difficulty classification ──
// Inferred from event title/description keywords since Eventbrite has no
// difficulty field. null means the difficulty couldn't be determined and the
// frontend will omit it rather than show a misleading label.
const DIFFICULTY_KEYWORDS = {
  Easy:   ["tea", "lunch", "breakfast", "brekkie", "brunch", "dinner", "food"],
  Medium: ["walk", "yoga"],
  Hard:   ["dance", "run", "jog"],
};

function classifyDifficulty(title, desc) {
  const text = `${title} ${desc}`.toLowerCase();
  for (const [level, keywords] of Object.entries(DIFFICULTY_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) return level;
  }
  return null;
}

function mapEvent(e) {
  const title = e.name?.text ?? "Untitled Event";
  const desc  = (e.description?.text ?? "").slice(0, 150);
  return {
    id:         e.id,
    title,
    desc,
    url:        e.url,
    time:       e.start?.local
      ? new Date(e.start.local).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" })
      : "Date TBC",
    location:   e.venue?.address?.localized_address_display ?? e.venue?.name ?? "Melbourne",
    img:        e.logo?.url ?? null,
    is_free:    e.is_free,
    difficulty: classifyDifficulty(title, desc),
  };
}

// GET /api/events
router.get("/", async (req, res) => {
  if (cache.data && Date.now() < cache.expires) {
    return res.json(cache.data);
  }

  if (!EVENTBRITE_TOKEN) {
    return res.status(500).json({ error: "Eventbrite token not configured" });
  }

  try {
    const today = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");

    const params = new URLSearchParams({
      "status": "live",
      "expand": "venue",  // venue is not included by default; needed for address filtering
    });

    // Promise.allSettled so a single organiser failure doesn't wipe all results —
    // partial results are better than an empty page.
    const results = await Promise.allSettled(
      MELBOURNE_ORGANISER_IDS.map((id) =>
        httpsGet(
          `https://www.eventbriteapi.com/v3/organizers/${id}/events/?${params}`,
          { Authorization: `Bearer ${EVENTBRITE_TOKEN}` }
        )
      )
    );

    const allEvents = [];
    results.forEach((r, i) => {
      if (r.status === "fulfilled") {
        const { status, data } = r.value;
        const organiserId = MELBOURNE_ORGANISER_IDS[i];
        const titleFilter = ORGANISER_TITLE_FILTERS[organiserId];
        let organiserEvents = data.events ?? [];
        // Apply per-organiser title filter to narrow mixed-topic organisers
        if (titleFilter) {
          organiserEvents = organiserEvents.filter((e) =>
            (e.name?.text ?? "").toLowerCase().includes(titleFilter.toLowerCase())
          );
        }
        console.log(`[events] organiser ${organiserId} → status ${status}, events: ${organiserEvents.length}`);
        allEvents.push(...organiserEvents);
      } else {
        console.error(`[events] organiser ${MELBOURNE_ORGANISER_IDS[i]} failed:`, r.reason?.message);
      }
    });

    // Keep only upcoming Melbourne/VIC events. Empty address passes through
    // because some venues omit the city field but are still Melbourne-based.
    const now = new Date();
    const filtered = allEvents.filter((e) => {
      const isUpcoming = e.start?.local ? new Date(e.start.local) >= now : true;
      const address = (e.venue?.address?.localized_address_display ?? "").toLowerCase();
      const isMelbourne = address.includes("melbourne") || address.includes("vic") || address === "";
      return isUpcoming && isMelbourne;
    });
    // Chronological order so the nearest event appears first in the UI
    filtered.sort((a, b) => new Date(a.start?.local) - new Date(b.start?.local));
    // Cap at 50 to keep API response payload small; frontend paginates or filters further
    const events = filtered.slice(0, 50).map(mapEvent);

    console.log(`[events] Total events returned: ${events.length}`);

    const result = { events };
    // Write to cache after successful fetch so a failed fetch doesn't clear valid cached data
    cache = { data: result, expires: Date.now() + 30 * 60 * 1000 };

    res.json(result);
  } catch (err) {
    console.error("[events] Fetch error:", err.message);
    res.status(502).json({ error: "Failed to fetch events", detail: err.message });
  }
});

module.exports = router;
