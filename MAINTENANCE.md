# ActiveAgeing – Maintenance & Technical Handover Document

**Version:** 1.0  
**Last Updated:** May 2026  
**Prepared for:** Sponsor / Technical Staff  
**Application:** ActiveAgeing – Senior Wellness & Route Planning Web Application

---

## Table of Contents

1. [Application Overview](#1-application-overview)
2. [Architecture Diagram](#2-architecture-diagram)
3. [Technology Stack](#3-technology-stack)
4. [Repository Structure](#4-repository-structure)
5. [Local Development Setup](#5-local-development-setup)
6. [Environment Variables](#6-environment-variables)
7. [Database Schema](#7-database-schema)
8. [API Reference](#8-api-reference)
9. [Frontend Features & Pages](#9-frontend-features--pages)
10. [Third-Party Integrations](#10-third-party-integrations)
11. [Security Measures](#11-security-measures)
12. [Deployment](#12-deployment)
13. [Common Maintenance Tasks](#13-common-maintenance-tasks)
14. [Troubleshooting](#14-troubleshooting)
15. [Regulatory Compliance](#15-regulatory-compliance)
16. [Recommended Future Improvements](#16-recommended-future-improvements)

---

## 1. Application Overview

ActiveAgeing is a web application designed to support older adults (65+) in Melbourne, Victoria, in maintaining and improving their physical activity. It provides:

- A **wellness check-in survey** that scores activity levels and recommends personalised exercises.
- A **guided exercise session** with timer-based routines and a break/celebration flow.
- A **route planning tool** that generates personalised walking, jogging, or cycling routes using the user's suburb and preferences, overlaid with points of interest (benches, water fountains, landmarks, restrooms).
- A **community events page** that surfaces curated upcoming senior wellness events from Eventbrite.
- A **route sharing feature** that lets users create a short code to share a planned route with friends.

The application targets non-technical users on mobile and desktop browsers. No login or account is required.

---

## 2. Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│                   USER BROWSER                  │
│                                                 │
│  Vue 3 SPA (Vite build, served via Vercel CDN)  │
│  ┌──────────┐  ┌────────────┐  ┌─────────────┐ │
│  │ Wellness │  │   Route    │  │   Events    │ │
│  │ Check-in │  │  Planner   │  │    Page     │ │
│  └────┬─────┘  └─────┬──────┘  └──────┬──────┘ │
└───────┼──────────────┼────────────────┼─────────┘
        │  HTTPS/JSON  │                │
        ▼              ▼                ▼
┌──────────────────────────────────────────────────┐
│        Express API (Vercel Serverless Node)       │
│                                                  │
│  /api/survey      /api/routes     /api/events    │
│  /api/results     /api/routesurvey               │
│  /api/shared-routes                              │
└───────────┬──────────────┬───────────────────────┘
            │              │
            ▼              ▼
    ┌──────────────┐  ┌─────────────────────────────┐
    │  MySQL DB    │  │      External APIs           │
    │  (PlanetScale│  │                              │
    │   / Railway) │  │  OpenRouteService (routes)   │
    │              │  │  Nominatim (geocoding)       │
    │  Tables:     │  │  Overpass (POIs)             │
    │  - user_     │  │  Eventbrite (events)         │
    │    checkins  │  │  Mapbox GL (map tiles)       │
    │  - exercise_ │  └─────────────────────────────┘
    │    recommendations
    │  - category_ │
    │    thresholds│
    │  - shared_   │
    │    routes    │
    │  - route_    │
    │    survey_   │
    │    responses │
    └──────────────┘
```

---

## 3. Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Frontend framework | Vue 3 | ^3.5 | Reactive UI, single-page application |
| Frontend build tool | Vite | ^8.0 | Dev server, production bundler |
| Client-side routing | Vue Router | ^5.0 | Page navigation without full reloads |
| Map rendering | Mapbox GL JS | ^3.23 | Interactive route and POI maps |
| Pose detection | MediaPipe Pose | ^0.5 | Exercise session motion tracking |
| Backend framework | Express.js | ^4.19 | REST API server |
| Backend runtime | Node.js | 18+ | Serverless function runtime on Vercel |
| Database client | mysql2/promise | ^3.9 | Async MySQL queries |
| Database | MySQL 8 | — | Persistent data storage |
| Deployment – frontend | Vercel (CDN) | — | Static site hosting |
| Deployment – backend | Vercel (Serverless) | — | API function hosting |
| CORS | cors npm package | ^2.8 | Cross-origin request control |
| Environment config | dotenv | ^16.4 | Local `.env` loading |

---

## 4. Repository Structure

```
ActiveAgeing/
├── src/                        # Vue frontend source
│   ├── main.js                 # App entry point – mounts Vue, registers router
│   ├── router/
│   │   └── index.js            # All client-side routes defined here
│   ├── views/                  # One file per page/route
│   │   ├── Home.vue            # Landing page
│   │   ├── SnapshotView.vue    # Wellness history summary
│   │   ├── Survey.vue          # Wellness check-in (5 questions)
│   │   ├── Results.vue         # Scored results + exercise recommendations
│   │   ├── ExerciseSession.vue # Guided timer-based exercise session
│   │   ├── BreakPage.vue       # Rest break between exercises
│   │   ├── Celebration.vue     # Session completion screen
│   │   ├── RoutePlan.vue       # Route feature landing (enter code or plan)
│   │   ├── RouteSurvey.vue     # Route preference survey (location, pace, etc.)
│   │   ├── Planner.vue         # Main map planner + POI overlay + sharing
│   │   ├── EventsPage.vue      # Community events listing
│   │   ├── AllExercisesPage.vue# Browse full exercise library
│   │   ├── HelpPage.vue        # Help / FAQ
│   │   ├── ContactPage.vue     # Contact information
│   │   ├── TermsPage.vue       # Terms of Service
│   │   └── PrivacyPage.vue     # Privacy Policy
│   └── components/
│       ├── PasswordGate.vue    # Demo soft-gate (not a security boundary)
│       └── HelloWorld.vue      # Vite scaffold – unused, safe to delete
│
├── backend/
│   ├── server.js               # Express entry point + route mounting
│   ├── db.js                   # MySQL connection pool
│   ├── vercel.json             # Vercel serverless deployment config
│   ├── .env.example            # Template for required environment variables
│   ├── migration.sql           # DB schema v1 + seed data
│   ├── migration_v2.sql        # Adds gif_url + extra exercises
│   ├── migration_v3.sql        # Exercise content refresh
│   ├── migration_v4.sql        # Exercise name corrections
│   ├── routes/
│   │   ├── survey.js           # POST /api/survey – scoring + exercise lookup
│   │   ├── results.js          # GET /api/results/:category/:modifier
│   │   ├── events.js           # GET /api/events – Eventbrite fetch + cache
│   │   ├── routes.js           # POST /api/routes – ORS route generation
│   │   ├── routesurvey.js      # POST /api/routesurvey – analytics persist
│   │   ├── shared-routes.js    # POST/GET /api/shared-routes – code sharing
│   │   ├── pois.js             # POST /api/pois – server-side Overpass proxy (unused)
│   │   └── example.js          # Scaffold smoke-test – not used in production
│   └── utils/
│       └── scoring.js          # Wellness scoring algorithm
│
├── public/                     # Static assets served as-is
├── package.json                # Frontend dependencies
├── vite.config.js              # Vite configuration
└── MAINTENANCE.md              # This document
```

---

## 5. Local Development Setup

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- A MySQL 8 database (local, PlanetScale, or Railway)
- API keys for Mapbox, OpenRouteService, and Eventbrite (see §6)

### Step 1 – Clone and install dependencies

```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### Step 2 – Configure environment variables

```bash
cd backend
cp .env.example .env
# Edit .env with your values (see §6)
```

### Step 3 – Run database migrations

Open a MySQL client (e.g. DBeaver or MySQL Workbench) and run the migration files **in order**:

```
backend/migration.sql       ← run first
backend/migration_v2.sql    ← then this
backend/migration_v3.sql    ← then this
backend/migration_v4.sql    ← then this
```

Each file targets the `ta15` database. Change `USE ta15;` to your database name if different.

### Step 4 – Start the servers

```bash
# Terminal 1 – Backend API (http://localhost:3000)
cd backend
npm run dev

# Terminal 2 – Frontend dev server (http://localhost:5173)
npm run dev
```

The frontend Vite dev server proxies are **not** configured — the frontend calls the backend directly. Ensure `FRONTEND_URL=http://localhost:5173` is set in backend `.env` so CORS allows the connection.

---

## 6. Environment Variables

All backend secrets are loaded via `.env` (locally) or Vercel Environment Variables (production). **Never commit `.env` to version control.**

| Variable | Required | Description | Example |
|---|---|---|---|
| `DB_HOST` | Yes | MySQL hostname | `aws.connect.psdb.cloud` |
| `DB_PORT` | Yes | MySQL port | `3306` |
| `DB_USER` | Yes | MySQL username | `activeageing_user` |
| `DB_PASSWORD` | Yes | MySQL password | `••••••••` |
| `DB_NAME` | Yes | Database name | `ta15` |
| `PORT` | No | Local server port (default 3000) | `3000` |
| `FRONTEND_URL` | Yes | Allowed CORS origin | `https://your-app.vercel.app` |
| `ORS_API_KEY` | Yes | OpenRouteService API key | `5b3ce3597...` |
| `EVENTBRITE_TOKEN` | Yes | Eventbrite private token | `ABCDEF123...` |

Frontend-side keys (Mapbox) are embedded directly in [Planner.vue](src/views/Planner.vue) at the top of the `<script setup>` block. For production, move these to Vite environment variables (`VITE_MAPBOX_TOKEN`) and access via `import.meta.env.VITE_MAPBOX_TOKEN`.

---

## 7. Database Schema

The database contains five tables. All are created by the migration files in `backend/`.

### `user_checkins`
Stores one row per completed wellness survey submission. Used for analytics.

| Column | Type | Notes |
|---|---|---|
| `id` | INT AUTO_INCREMENT | Primary key |
| `exercise_frequency` | VARCHAR(100) | Raw answer label from Q1 |
| `session_duration` | VARCHAR(100) | Raw answer label from Q2 |
| `inactivity_level` | VARCHAR(100) | Raw answer label from Q3 |
| `sleep_hours` | VARCHAR(100) | Raw answer label from Q4 |
| `restedness` | VARCHAR(100) | Raw answer label from Q5 |
| `activity_score` | INT | Computed score (range 2–8) |
| `modifier_score` | INT | Computed score (range 3–12) |
| `category_name` | VARCHAR(50) | e.g. "Building Momentum" |
| `modifier_name` | VARCHAR(50) | e.g. "standard" |
| `created_at` | TIMESTAMP | Auto-set on insert |

### `category_thresholds`
Defines the three wellness tiers and their descriptions.

| Column | Notes |
|---|---|
| `category_name` | "Just Getting Started" / "Building Momentum" / "Thriving" |
| `min_score`, `max_score` | Activity score range that maps to this category |
| `description` | Human-readable description shown on the Results page |

### `exercise_recommendations`
Holds the exercise library. Each exercise is scoped to a `category_name` × `modifier_name` combination (9 combinations total, 3 exercises each = 27 rows).

| Column | Notes |
|---|---|
| `category_name` | Must match a value in `category_thresholds` |
| `modifier_name` | "standard" / "lighter" / "gentle_short" |
| `exercise_name` | Display name |
| `duration_minutes` | Shown in the exercise timer |
| `instructions` | Step-by-step instructions displayed during session |
| `gif_url` | Optional animated GIF URL (nullable) |

### `route_survey_responses`
Stores route survey submissions for analytics. Not read back by the frontend.

| Column | Notes |
|---|---|
| `activity_type` | "walking" / "jogging" / "cycling" |
| `duration_minutes` | 15 / 30 / 45 / 60 |
| `preferred_pace` | "easy" / "moderate" / "brisk" |
| `environment_pref` | "parks" / "streets" / "mix" |
| `start_address` | Suburb string from Nominatim autocomplete |
| `start_lat`, `start_lng` | DECIMAL(10,7) coordinates |

### `shared_routes`
Stores shared route events, looked up by the 6-character code.

| Column | Notes |
|---|---|
| `code` | VARCHAR(8) UNIQUE — 6-char base36 uppercase |
| `expires_at` | 48 hours after scheduled event date |
| `route_geometry` | LONGTEXT — JSON-serialised GeoJSON LineString |
| `survey_data` | TEXT — JSON-serialised route survey answers |

---

## 8. API Reference

All endpoints are under the base URL `/api/`.

### `POST /api/survey`
Scores the wellness survey and returns exercise recommendations.

**Request body:**
```json
{ "answers": ["A few times a week", "15 to 30 minutes", "Some of the day", "7 to 8 hours", "Fairly rested"] }
```

**Response:**
```json
{
  "activityScore": 5,
  "modifierScore": 4,
  "categoryName": "Building Momentum",
  "modifierName": "standard",
  "chartPercent": 63,
  "category": { "category_name": "Building Momentum", "description": "..." },
  "exercises": [{ "exercise_name": "Brisk Walking", "duration_minutes": 10, "instructions": "..." }]
}
```

**Resilience:** If the database is unavailable, scores are still returned with hardcoded fallback exercises. The endpoint never returns a 500 to the user.

---

### `GET /api/results/:categoryName/:modifierName`
Fetches category description and all exercises for a given tier/modifier. Used when re-fetching results from localStorage after a page refresh.

---

### `GET /api/events`
Returns up to 50 upcoming Melbourne senior wellness events from Eventbrite. Results are cached in-memory for 30 minutes.

**Response:**
```json
{ "events": [{ "id": "...", "title": "...", "time": "...", "location": "...", "url": "...", "is_free": true }] }
```

**To add a new event organiser:** Add their Eventbrite organiser ID to `MELBOURNE_ORGANISER_IDS` in [backend/routes/events.js](backend/routes/events.js:118).

---

### `POST /api/routes`
Generates up to 3 round-trip route variants using OpenRouteService.

**Request body:**
```json
{ "activity_type": "walking", "duration_minutes": 30, "preferred_pace": "moderate", "start_lat": -37.8, "start_lng": 144.9 }
```

**Response:**
```json
{ "routes": [{ "index": 0, "geometry": { "type": "LineString", "coordinates": [[...]] }, "distance_label": "2.8 km", "duration_label": "34 min" }] }
```

---

### `POST /api/routes/waypoint`
Calculates a custom route through provided waypoints (used when user selects POIs on the map). Appends the start coordinate at the end to close the loop.

---

### `POST /api/routesurvey`
Persists a completed route survey for analytics. Called fire-and-forget by the frontend — a failure here does not block the user.

---

### `POST /api/shared-routes`
Creates a shared route event. Returns a 6-character code and an expiry timestamp.

**Request body:**
```json
{ "scheduled_date": "2026-06-15", "activity_type": "walking", "route_geometry": {...}, "survey_data": {...} }
```

### `GET /api/shared-routes/:code`
Returns a shared route by code. Returns 404 if expired or not found.

---

## 9. Frontend Features & Pages

### Wellness Check-in Flow

```
/snapshot  →  /survey  →  /results  →  /exercise  →  /break  →  /celebration
```

| Page | File | Key behaviour |
|---|---|---|
| Snapshot | SnapshotView.vue | Shows previous results from localStorage; clears old data before new survey |
| Survey | Survey.vue | 5-question survey; auto-advances on answer; scores sent to backend |
| Results | Results.vue | SVG circle chart; session points badge (read-once from localStorage); 3 exercise cards |
| Exercise Session | ExerciseSession.vue | Timer per exercise; MediaPipe pose detection overlay |
| Break | BreakPage.vue | Rest timer between exercises |
| Celebration | Celebration.vue | Completion screen; awards points stored in localStorage |

**Scoring algorithm** (see [backend/utils/scoring.js](backend/utils/scoring.js)):

```
Activity score  = Q1 + Q2        (range 2–8)
Modifier score  = Q3 + Q4 + Q5   (range 3–12)

Activity score → Category:
  2–3  →  Just Getting Started
  4–6  →  Building Momentum
  7–8  →  Thriving

Modifier score → Exercise intensity:
  3–5  →  standard
  6–8  →  lighter
  9–12 →  gentle_short
```

### Route Planning Flow

```
/routeplan  →  /routesurvey  →  /planner
```

| Page | File | Key behaviour |
|---|---|---|
| Route Plan | RoutePlan.vue | Entry point; user can start new plan or enter a share code |
| Route Survey | RouteSurvey.vue | Captures suburb (Nominatim autocomplete), activity, duration, pace, environment, rest stops |
| Planner | Planner.vue | Mapbox map; 3 route variants; POI overlay (benches, water, toilets, landmarks); route sharing; PDF/Google Maps export |

**Route naming:** Route names are derived from the suburb in the user's `start_address` (e.g. `"Fitzroy – Route 1"`). If no address is available, falls back to activity + pace (e.g. `"Moderate Walking – Route 2"`).

### Community Events

`/events` — Fetches from the backend Eventbrite cache. Events are filtered to upcoming Melbourne/VIC events, sorted by date, and displayed with difficulty classification (inferred from keywords in the event title).

### Static Pages

`/help`, `/terms`, `/privacy`, `/contact` — Static content pages. No backend calls. Content is hardcoded in the Vue template. Update directly in the respective `.vue` file.

---

## 10. Third-Party Integrations

### Mapbox GL JS
- **Used in:** Planner.vue
- **Purpose:** Renders the interactive route map and thumbnail maps for each route variant.
- **Key note:** The map instance is stored in a plain `let` variable (not a Vue `ref`) because Vue's Proxy wrapping breaks Mapbox GL's internal WebGL state.
- **PDF export note:** The map is initialised with `preserveDrawingBuffer: true` so `getCanvas().toDataURL()` can capture the WebGL canvas for PDF generation.
- **Key setting:** `VITE_MAPBOX_TOKEN` (currently hardcoded — see §6 for production recommendation).
- **Docs:** https://docs.mapbox.com/mapbox-gl-js/

### OpenRouteService (ORS)
- **Used in:** backend/routes/routes.js
- **Purpose:** Generates walking/jogging/cycling round-trip routes from a start coordinate.
- **Profile note:** Both "walking" and "jogging" activity types use the `foot-walking` ORS profile. Speed differences are handled client-side via the `SPEEDS` table.
- **Seed parameter:** Seeds `0`, `1`, `2` produce three distinct loop shapes of the same target length.
- **Rate limits:** Free tier allows 500 requests/day. Monitor usage in the ORS dashboard.
- **Docs:** https://openrouteservice.org/dev/#/api-docs

### Nominatim (OpenStreetMap Geocoding)
- **Used in:** RouteSurvey.vue (client-side, directly)
- **Purpose:** Autocomplete suburb search and reverse-geocoding when user grants location permission.
- **Usage policy:** Nominatim's usage policy requires a valid `User-Agent` header and prohibits bulk requests. The frontend adds a 300ms debounce before querying. Do not remove this debounce.
- **No API key required**, but heavy usage may trigger rate limiting.
- **Docs:** https://nominatim.org/release-docs/latest/api/Search/

### Overpass API (OpenStreetMap POIs)
- **Used in:** Planner.vue (client-side, directly)
- **Purpose:** Fetches points of interest (benches, water fountains, toilets, landmarks, parks) within a 60-metre buffer around the generated route.
- **Mirrors:** Three Overpass mirrors are tried in sequence (`overpass-api.de`, `overpass.kumi.systems`, `maps.mail.ru`) to handle downtime.
- **Note:** A server-side proxy (`backend/routes/pois.js`) exists but is currently unused.

### Eventbrite
- **Used in:** backend/routes/events.js
- **Purpose:** Fetches upcoming events from a curated list of Melbourne senior wellness organisers.
- **Caching:** Results are cached in-memory for 30 minutes to respect the free-tier rate limit.
- **To add an organiser:** Find their Eventbrite URL (`eventbrite.com.au/o/{name}-XXXXXXX`) and add the trailing numeric ID to `MELBOURNE_ORGANISER_IDS` in [backend/routes/events.js](backend/routes/events.js).
- **Token:** Set via `EVENTBRITE_TOKEN` environment variable.

### MediaPipe Pose
- **Used in:** ExerciseSession.vue
- **Purpose:** Real-time pose landmark detection via the device camera during exercise sessions.
- **Privacy note:** Camera frames are processed entirely on-device (client-side ML). No video data is transmitted to any server.

---

## 11. Security Measures

### CORS Restriction
The backend restricts cross-origin requests to a single allowed origin defined in `FRONTEND_URL`. Only the deployed frontend (or `localhost:5173` in development) can call the API. This is enforced in [backend/server.js](backend/server.js).

> **Maintenance action:** When redeploying the frontend to a new domain, update `FRONTEND_URL` in the backend's Vercel environment variables.

### Input Validation
- **Survey endpoint** (`/api/survey`): Validates that exactly 5 answers are provided. Unknown answer labels default to a mid-range score rather than crashing.
- **Route survey endpoint** (`/api/routesurvey`): Uses an allowlist for all five survey fields. Any value not in the allowlist returns HTTP 400.
- **Shared routes endpoint**: `scheduled_date` is required; all other fields are nullable.

### Parameterised Queries
All database queries use parameterised statements (`?` placeholders via `mysql2`). There are no string-concatenated SQL queries in the codebase, preventing SQL injection.

### No Stored PII
The application does not collect names, email addresses, or device identifiers. Survey responses store only answer labels and computed scores. Location data (suburb name, lat/lng) is stored only in `route_survey_responses` for analytics and is not linked to any individual.

### Password Gate
The `PasswordGate` component in [src/components/PasswordGate.vue](src/components/PasswordGate.vue) is a **soft demo gate only**. It is not a security control — the password is hardcoded in the client-side JavaScript and is visible to anyone who inspects the source. Do not rely on it to protect sensitive data.

### HTTPS
Both the frontend and backend are served exclusively over HTTPS via Vercel. Vercel enforces HTTPS by default and redirects HTTP requests.

### API Keys
- Backend API keys (`ORS_API_KEY`, `EVENTBRITE_TOKEN`, `DB_PASSWORD`) are stored as Vercel Environment Variables and are never exposed to the browser.
- The Mapbox token is currently hardcoded in `Planner.vue`. **Recommended action:** Move to a Vite environment variable (`VITE_MAPBOX_TOKEN`) so it is at least separated from source code, and restrict the token's allowed URLs in the Mapbox dashboard to the production domain.

### Camera Access
MediaPipe pose detection requires camera permission. The browser prompts the user; the application does not request camera access until the user begins an exercise session. No video frames leave the device.

---

## 12. Deployment

### Frontend (Vercel Static)

The frontend is a Vite-built static site. Vercel detects it automatically.

```bash
# Build locally to verify
npm run build
# Output is in dist/
```

Vercel deployment settings:
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Framework preset:** Vue (or Vite)

Because Vue Router uses HTML5 History mode (`createWebHistory`), the Vercel project must be configured to rewrite all paths to `index.html`. Add a `vercel.json` in the project root if not already present:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Backend (Vercel Serverless)

The backend has its own `vercel.json` at `backend/vercel.json` which routes all requests to `server.js` as a serverless Node function.

```bash
cd backend
vercel deploy
```

Set all environment variables listed in §6 in the Vercel dashboard under **Settings → Environment Variables**.

**Serverless cold-start note:** In-memory cache (Eventbrite events) is cleared on each cold start. The first request after a cold start will make a live Eventbrite API call; subsequent requests within 30 minutes will be served from cache.

---

## 13. Common Maintenance Tasks

### Update exercise content

1. Write an `UPDATE` or `INSERT` SQL statement targeting `exercise_recommendations`.
2. Verify the `category_name` and `modifier_name` values match exactly (case-sensitive).
3. Ensure each `category_name` × `modifier_name` combination has exactly 3 exercises (the frontend always displays 3).
4. Run the SQL against the production database.

```sql
-- Example: update instructions for an exercise
UPDATE exercise_recommendations
SET instructions = 'New instructions here.'
WHERE exercise_name = 'Brisk Walking' AND category_name = 'Building Momentum';
```

### Add a new community event organiser

1. Find the organiser's Eventbrite page URL: `eventbrite.com.au/o/{name}-XXXXXXX`
2. Copy the trailing numeric ID (e.g. `12345678901`).
3. Add it to `MELBOURNE_ORGANISER_IDS` in [backend/routes/events.js](backend/routes/events.js:118).
4. If the organiser runs mixed-topic events and only some are relevant, add a title filter to `ORGANISER_TITLE_FILTERS` (see the existing `"Over60 programs"` example).
5. Redeploy the backend.

### Add a new page/route

1. Create `src/views/NewPage.vue`.
2. Import and add a route entry in [src/router/index.js](src/router/index.js).
3. Link to it from wherever appropriate in the navigation.

### Rotate an API key

1. Generate a new key in the provider's dashboard.
2. Update the corresponding Vercel Environment Variable.
3. Trigger a redeployment (or the new variable takes effect on next cold start).
4. Revoke the old key only after confirming the new deployment is live.

### Run database migrations

Connect to the production database and run the relevant `.sql` file. All migration files are idempotent (`CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`) and safe to re-run. The `shared_routes` table is created automatically at runtime by `ensureTable()` in [backend/routes/shared-routes.js](backend/routes/shared-routes.js) — no manual migration needed for that table.

---

## 14. Troubleshooting

### Events page shows no events

1. Check `EVENTBRITE_TOKEN` is set and valid: `GET /api/events/test` returns your Eventbrite user profile if the token is correct.
2. Check that the organisers in `MELBOURNE_ORGANISER_IDS` still have active events: `GET /api/events/test-organiser?id=<ID>`.
3. The in-memory cache survives for 30 minutes — restart the serverless function or wait for cache expiry if you updated organiser data.

### Routes are not generating

1. Check `ORS_API_KEY` is valid and within rate limits (500 requests/day on free tier).
2. Check the ORS dashboard for quota usage.
3. The backend logs `ORS seed X error:` to the console when ORS returns an error — check Vercel function logs.
4. Ensure `start_lat` and `start_lng` are valid decimal numbers (not strings).

### Map does not load

1. Verify the Mapbox token in `Planner.vue` is valid and not expired.
2. In the Mapbox dashboard, confirm the token's allowed URLs include the deployment domain.
3. `preserveDrawingBuffer: true` on the map constructor is required — do not remove it, as it enables PDF export.

### Database connection errors

1. Confirm all five `DB_*` environment variables are set correctly in Vercel.
2. Check that the database host allows connections from Vercel's IP ranges (or set to allow all for PlanetScale/Railway managed services).
3. Connection pool limit is 10 (`connectionLimit: 10` in `db.js`). If the database's `max_connections` is lower, reduce this value.

### Survey results not persisting after page refresh

Results are stored in `localStorage` under the key `surveyResult`. If a user clears browser storage or uses private/incognito mode, results will not persist. This is expected behaviour — the application does not require an account.

### POIs not appearing on the route map

1. Overpass API may be temporarily unavailable. The frontend tries three mirrors in sequence; if all fail, no POIs are shown (non-critical failure — the route still works).
2. Check the browser console for `Overpass error` messages.
3. The route buffer filter is 60 metres — POIs further than 60m from the route line will not appear even if they are nearby.

---

## 15. Regulatory Compliance

### Privacy Act 1988 (Australia) & Australian Privacy Principles (APPs)

The application does not collect personal information as defined by the Privacy Act (names, email addresses, phone numbers, government identifiers). Survey responses and location data are stored without any link to an individual identity. No data is shared with third parties for marketing purposes.

> **Recommended action:** If a contact form or user account feature is added in future, a formal Privacy Impact Assessment will be required and the Privacy Policy (`/privacy`) must be updated.

### Health Information

Exercise recommendations provided by the application are general wellness suggestions, not medical advice. The Terms of Service (`/terms`) should include a health disclaimer advising users to consult a healthcare professional before beginning any new exercise program. Verify this disclaimer is present and reviewed by a qualified legal or health professional.

### Accessibility – WCAG 2.1

The application targets older adults (65+) and should comply with WCAG 2.1 Level AA. Key areas to review:
- Colour contrast ratios for all text elements (minimum 4.5:1 for normal text).
- All interactive elements accessible via keyboard navigation.
- All images include meaningful `alt` attributes.
- Font sizes should remain readable at default zoom levels (minimum 16px body text recommended for this audience).

### OpenStreetMap / Nominatim Usage Policy

Nominatim requires:
- A valid `User-Agent` header identifying the application.
- No bulk or automated querying.
- The 300ms debounce in `RouteSurvey.vue` satisfies the "no automated querying" requirement. Do not remove it.
- Attribution: OpenStreetMap data is © OpenStreetMap contributors (ODbL licence). The map tiles and geocoding results must be attributed accordingly in the UI.

### Mapbox Terms of Service

Mapbox usage is governed by the Mapbox Terms of Service. The free tier (Mapbox Free) includes 50,000 map loads/month. Monitor usage in the Mapbox dashboard. Exceeding the free tier incurs charges.

### OpenRouteService Terms

ORS free tier allows 500 route requests/day and 40 requests/minute. Usage is tied to the `ORS_API_KEY`. Monitor in the ORS dashboard and upgrade the plan if usage grows.

### Eventbrite API Terms

The Eventbrite API is used to fetch publicly available event data from curated organisers. No user Eventbrite accounts are accessed. Ensure the `EVENTBRITE_TOKEN` used is a private token belonging to an authorised account, and that the account has agreed to Eventbrite's API Terms.

---

## 16. Recommended Future Improvements

The following items are not currently implemented but are recommended for a production-grade deployment:

| Priority | Item | Rationale |
|---|---|---|
| High | Move Mapbox token to Vite environment variable | Prevents token from being visible in source code; restrict domain in Mapbox dashboard |
| High | Add HTTPS-only cookies / session management if login is added | Required for any feature that stores user-specific data server-side |
| High | Replace PasswordGate with proper authentication | Current gate is cosmetic only and provides no security |
| Medium | Add rate limiting to backend API endpoints | Prevents abuse of ORS quota and DB connections |
| Medium | Add structured logging (e.g. Winston or Pino) | `console.log` is lost after serverless cold-start; structured logs enable monitoring dashboards |
| Medium | Add a CI/CD pipeline with automated tests | Catch regressions before deployment |
| Medium | Move Eventbrite cache to a persistent store (Redis) | In-memory cache is lost on every cold start, causing unnecessary Eventbrite API calls |
| Low | Remove or mount `backend/routes/example.js` | Scaffold file is mounted but serves no production purpose |
| Low | Delete `src/components/HelloWorld.vue` | Vite scaffold component, unused in production |
| Low | Add `gif_url` content for exercise animations | Column exists in the schema but is currently null for all exercises |

---

*This document should be reviewed and updated whenever a significant change is made to the application's architecture, dependencies, or data handling practices.*
