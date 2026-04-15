const express = require("express");
const router  = express.Router();
const https   = require("https");
const { URL }  = require("url");

const EVENTBRITE_TOKEN = process.env.EVENTBRITE_TOKEN;

// Simple in-memory cache (30 min TTL)
let cache = { data: null, expires: 0 };

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

// Known Melbourne senior/wellness organiser IDs on Eventbrite.
// Add more by going to an organiser's Eventbrite page and checking their URL:
// eventbrite.com.au/o/{organiser-name}-XXXXXXX  ← the number is the ID
const MELBOURNE_ORGANISER_IDS = [
  "76900127983",  // Aged & Disability Expo
];

function mapEvent(e) {
  return {
    id:       e.id,
    title:    e.name?.text ?? "Untitled Event",
    desc:     (e.description?.text ?? "").slice(0, 150),
    url:      e.url,
    time:     e.start?.local
      ? new Date(e.start.local).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" })
      : "Date TBC",
    location: e.venue?.address?.localized_address_display ?? e.venue?.name ?? "Melbourne",
    img:      e.logo?.url ?? null,
    is_free:  e.is_free,
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
      "expand": "venue",
    });

    // Fetch from each organiser in parallel
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
        console.log(`[events] organiser ${MELBOURNE_ORGANISER_IDS[i]} → status ${status}, events: ${data.events?.length ?? 0}`);
        if (data.events) allEvents.push(...data.events);
      } else {
        console.error(`[events] organiser ${MELBOURNE_ORGANISER_IDS[i]} failed:`, r.reason?.message);
      }
    });

    // Filter to Melbourne/Victoria events only, sort by date, take first 9
    const now = new Date();
    const filtered = allEvents.filter((e) => {
      const isUpcoming = e.start?.local ? new Date(e.start.local) >= now : true;
      const address = (e.venue?.address?.localized_address_display ?? "").toLowerCase();
      const isMelbourne = address.includes("melbourne") || address.includes("vic") || address === "";
      return isUpcoming && isMelbourne;
    });
    filtered.sort((a, b) => new Date(a.start?.local) - new Date(b.start?.local));
    const events = filtered.slice(0, 9).map(mapEvent);

    console.log(`[events] Total events returned: ${events.length}`);

    const result = { events };
    cache = { data: result, expires: Date.now() + 30 * 60 * 1000 };

    res.json(result);
  } catch (err) {
    console.error("[events] Fetch error:", err.message);
    res.status(502).json({ error: "Failed to fetch events", detail: err.message });
  }
});

module.exports = router;
