\documentclass[12pt,a4paper]{article}

% ── Packages ──────────────────────────────────────────────────────────────────
\usepackage[a4paper, margin=2.5cm]{geometry}
\usepackage[T1]{fontenc}
\usepackage[utf8]{inputenc}
\usepackage{lmodern}
\usepackage{microtype}
\usepackage{hyperref}
\usepackage{booktabs}
\usepackage{longtable}
\usepackage{array}
\usepackage{xcolor}
\usepackage{listings}
\usepackage{enumitem}
\usepackage{titlesec}
\usepackage{fancyhdr}
\usepackage{graphicx}
\usepackage{parskip}

% ── Colours ───────────────────────────────────────────────────────────────────
\definecolor{codebg}{HTML}{F5F5F5}
\definecolor{codeframe}{HTML}{CCCCCC}
\definecolor{linkcolor}{HTML}{1A5C8A}
\definecolor{notecolor}{HTML}{FFF8DC}
\definecolor{noteframe}{HTML}{DAA520}

% ── Hyperref ──────────────────────────────────────────────────────────────────
\hypersetup{
  colorlinks  = true,
  linkcolor   = linkcolor,
  urlcolor    = linkcolor,
  citecolor   = linkcolor,
  pdftitle    = {ActiveAgeing -- Maintenance Handover Document},
  pdfauthor   = {Sudhira Subramaniam, Noel Benson Swarna, Abhay Ramachandra, Chengtai Lyu, Maozhemian Ma},
}

% ── Code listing style ────────────────────────────────────────────────────────
\lstdefinestyle{codestyle}{
  backgroundcolor  = \color{codebg},
  frame            = single,
  rulecolor        = \color{codeframe},
  basicstyle       = \ttfamily\small,
  breaklines       = true,
  breakatwhitespace= true,
  keepspaces       = true,
  showstringspaces = false,
  tabsize          = 2,
  aboveskip        = 8pt,
  belowskip        = 8pt,
}
\lstset{style=codestyle}

% ── Section formatting ────────────────────────────────────────────────────────
\titleformat{\section}{\large\bfseries}{}{0em}{}[\titlerule]
\titleformat{\subsection}{\normalsize\bfseries}{}{0em}{}
\titleformat{\subsubsection}{\normalsize\itshape}{}{0em}{}

% ── Header / Footer ───────────────────────────────────────────────────────────
\pagestyle{fancy}
\fancyhf{}
\lhead{\small ActiveAgeing -- Maintenance Handover Document}
\rhead{\small v1.0}
\rfoot{\small Page \thepage}
\lfoot{\small Confidential -- Sponsor / Technical Staff}

% ── Column type for tables ────────────────────────────────────────────────────
\newcolumntype{L}[1]{>{\raggedright\arraybackslash}p{#1}}

% ──────────────────────────────────────────────────────────────────────────────
\begin{document}

% ── Title page ────────────────────────────────────────────────────────────────
\begin{titlepage}
  \centering
  \vspace*{3cm}
  {\Huge\bfseries ActiveAgeing\par}
  \vspace{0.5cm}
  {\Large Maintenance Handover Document\par}
  \vspace{2cm}
  \begin{tabular}{ll}
    \textbf{Version:}       & 1.0 \\[4pt]
    \textbf{Last Updated:}  & May 2026 \\[4pt]
    \textbf{Prepared for:}  & Sponsor / Technical Staff \\[4pt]
    \textbf{Application:}   & ActiveAgeing -- Senior Wellness \& Route Planning Web Application \\
  \end{tabular}
  \vfill
  {\small This document should be reviewed and updated whenever a significant change is made\\
  to the application's architecture, dependencies, or data handling practices.}
\end{titlepage}

% ── Table of Contents ─────────────────────────────────────────────────────────
\tableofcontents
\newpage

% ──────────────────────────────────────────────────────────────────────────────
\section{Application Overview}

ActiveAgeing is a web application designed to support older adults (65+) in Melbourne, Victoria,
in maintaining and improving their physical activity. It provides:

\begin{itemize}[leftmargin=1.5em]
  \item A \textbf{wellness check-in survey} that scores activity levels and recommends
        personalised exercises.
  \item A \textbf{guided exercise session} with timer-based routines and a break/celebration flow.
  \item A \textbf{route planning tool} that generates personalised walking, jogging, or cycling
        routes using the user's suburb and preferences, overlaid with points of interest
        (benches, water fountains, landmarks, restrooms).
  \item A \textbf{community events page} that surfaces curated upcoming senior wellness events
        from Eventbrite.
  \item A \textbf{route sharing feature} that lets users create a short code to share a planned
        route with friends.
\end{itemize}

The application targets non-technical users on mobile and desktop browsers. No login or account
is required.

% ──────────────────────────────────────────────────────────────────────────────
\section{Maintenance Team Composition}

The following roles are recommended for ongoing maintenance of the ActiveAgeing application.
These do not need to be separate individuals --- roles may be combined depending on team size.

\begin{longtable}{L{3.2cm} L{5cm} L{5.3cm}}
  \toprule
  \textbf{Role} & \textbf{Responsibilities} & \textbf{Required Skills} \\
  \midrule
  \endhead
  Product Owner / Project Manager
    & Prioritise feature backlog; coordinate with stakeholders; define acceptance criteria; manage release schedule
    & Project management; domain knowledge of senior wellness; stakeholder communication \\[4pt]
  Frontend Developer
    & Maintain and extend Vue 3 SPA; update UI components; ensure mobile responsiveness; integrate new APIs
    & Vue 3 (Composition API), JavaScript, CSS, Mapbox GL JS, Vite \\[4pt]
  Backend Developer
    & Maintain Express.js API; update database schema; manage third-party API integrations; monitor Vercel logs
    & Node.js, Express.js, MySQL, REST APIs, Vercel serverless \\[4pt]
  QA / Test Engineer
    & Write and execute test cases; perform regression testing before releases; document defects
    & Manual and automated web testing; familiarity with Vue and REST APIs \\[4pt]
  Database Administrator
    & Monitor database performance; apply migrations; manage backups; tune connection pool settings
    & MySQL 8, PlanetScale or Railway, SQL query optimisation \\[4pt]
  Security Specialist
    & Review API key exposure; audit input validation; monitor CORS configuration; review third-party ToS compliance
    & Web application security, OWASP Top 10, HTTPS/TLS configuration \\
  \bottomrule
\end{longtable}

% ──────────────────────────────────────────────────────────────────────────────
\section{Development Cycle}

\subsection{Methodology}

The team follows an \textbf{Agile / Scrum} framework with two-week sprints. Work items are
managed on a \textbf{Miro Kanban board} with the following columns:

\begin{itemize}[leftmargin=1.5em]
  \item \textbf{Backlog} --- All identified tasks and feature requests
  \item \textbf{To Do} --- Tasks committed for the current sprint
  \item \textbf{In Progress} --- Tasks actively being worked on
  \item \textbf{In Review} --- Awaiting code review or QA approval
  \item \textbf{Done} --- Completed and deployed tasks
\end{itemize}

\subsection{Ceremonies}

\begin{itemize}[leftmargin=1.5em]
  \item \textbf{Daily Standup (15 min):} Each team member reports: what was done yesterday,
        what is planned today, and any blockers.
  \item \textbf{Sprint Planning:} Tasks are estimated (story points) and pulled from the
        backlog into the current sprint.
  \item \textbf{Sprint Review / Retrospective:} Completed work is demonstrated to stakeholders;
        team reflects on process improvements.
\end{itemize}

\subsection{Version Control Workflow}

The project uses Git hosted on GitHub. The branching strategy is:

\begin{enumerate}[leftmargin=1.5em]
  \item \textbf{Create a feature branch} from \texttt{main}:
        \texttt{git checkout -b feature/your-feature-name}
  \item \textbf{Commit with descriptive messages} following the convention:\\
        \texttt{type: short description}
        (e.g.\ \texttt{feat: add route sharing}, \texttt{fix: resolve POI filter bug})
  \item \textbf{Open a Pull Request} on GitHub targeting \texttt{main}.
  \item \textbf{Code review:} At least one team member must approve before merging.
  \item \textbf{Merge to main:} Squash-and-merge preferred for a clean history.
  \item \textbf{Auto-deploy:} Vercel automatically deploys on every push to \texttt{main}.
\end{enumerate}

\textbf{Branch protection recommendation:} Enable branch protection on \texttt{main} ---
require pull request reviews, require status checks to pass, and disallow force-push.

% ──────────────────────────────────────────────────────────────────────────────
\section{Product Features}

The table below maps each epic and user story to the acceptance criteria used to verify
correct behaviour.

\begin{longtable}{L{1cm} L{4.5cm} L{8cm}}
  \toprule
  \textbf{US} & \textbf{User Story} & \textbf{Acceptance Criteria} \\
  \midrule
  \endhead

  \multicolumn{3}{l}{\textbf{1.0 --- Wellness Check-in \& Onboarding}} \\[2pt]
  1.1 & Getting started page for ActiveAgeing
    & Landing page renders all sections; navigation links work; hero CTA navigates user to the wellness check-in flow \\[2pt]
  1.2 & Wellness check-in
    & 5-question survey displays one question at a time; page auto-advances on answer selection; progress is preserved if user navigates back \\[2pt]
  1.3 & Submit wellness check-in
    & Survey answers submitted to \texttt{/api/survey}; activityScore and modifierScore returned; user navigated to Results page on success \\[6pt]

  \multicolumn{3}{l}{\textbf{2.0 --- Personalised Insights (Wellness Snapshot)}} \\[2pt]
  2.1 & View wellness snapshot
    & Previous survey results (category, score, 3 recommended exercises) displayed on Snapshot page before the user starts a new survey \\[2pt]
  2.2 & Guided next steps
    & Results page shows clear CTAs to start the exercise session, browse all exercises, or view community events based on the user's category \\[6pt]

  \multicolumn{3}{l}{\textbf{3.0 --- Guided Action (Exercise \& Events)}} \\[2pt]
  3.1 & Guided exercise session
    & Timer counts down for each recommended exercise; exercise name, duration, and step-by-step instructions displayed; pose overlay activates when camera is granted \\[2pt]
  3.2 & Complete exercise session
    & Break screen shown between exercises; Celebration screen shown after the final exercise; session points awarded and stored in \texttt{localStorage} \\[2pt]
  3.3 & View suggested events
    & Community Events page reachable from Results page; upcoming Melbourne senior wellness events displayed with title, date, location, and free/paid badge \\[6pt]

  \multicolumn{3}{l}{\textbf{4.0 --- Route Planning and Activity Generation}} \\[2pt]
  4.1 & Access to ``Plan My Activity''
    & Route Plan entry page loads; user can choose to start a new plan or enter a share code to load an existing route \\[2pt]
  4.2 & Find my route (survey questions)
    & Route survey captures suburb (Nominatim autocomplete, 300\,ms debounce), activity type, duration, pace, and environment preference \\[2pt]
  4.3 & Route results page
    & Up to 3 distinct round-trip route variants displayed with distance label and estimated time for each \\[2pt]
  4.4 & Reasoning for route recommendation
    & Each route variant displays a brief explanation of why it matches the user's stated preferences (activity, pace, duration) \\[2pt]
  4.5 & View route map
    & Selected route rendered on an interactive Mapbox map; POI overlay shows benches, water fountains, toilets, parks, and landmarks within 60\,m \\[2pt]
  4.6 & View selected route in Google Maps
    & ``Open in Google Maps'' link launches Google Maps with the route start coordinates correctly populated \\[2pt]
  4.7 & Invite others
    & User can generate a share code for their planned route so others can load and join the same activity \\[6pt]

  \multicolumn{3}{l}{\textbf{5.0 --- Private Event Creation and Sharing}} \\[2pt]
  5.1 & Create private event
    & User selects a scheduled date for the route activity; date is stored alongside the route geometry and survey data \\[2pt]
  5.2 & Create shareable link and event code
    & A unique 6-character base36 code is generated; shareable link and code displayed with a copy-to-clipboard action \\[2pt]
  5.3 & Open shared link
    & Recipient enters code on \texttt{/routeplan}; matching route and survey data load correctly on the Planner map \\[2pt]
  5.4 & Events expiry
    & Codes expire 48 hours after the scheduled event date; expired codes return an informative error message; API returns HTTP~404 \\[6pt]

  \multicolumn{3}{l}{\textbf{6.0 --- Health \& Wellness Trivia}} \\[2pt]
  6.1 & Access ``Did You Know?'' trivia on exercise cards
    & A trivia fact is displayed on each exercise card during the guided session \\[2pt]
  6.2 & View exercise-specific health benefits
    & Each exercise card includes a brief health benefit statement relevant to the specific exercise \\[2pt]
  6.3 & Clarity of trivia message
    & Trivia text is written in plain language accessible to seniors (65+); no unexplained medical jargon \\[2pt]
  6.4 & Access to credible health \& wellness resources
    & Trivia section includes a link or reference to a credible health source (e.g.\ Better Health Channel, Australian Department of Health) \\[6pt]

  \multicolumn{3}{l}{\textbf{7.0 --- Enhanced Event Discovery and Filtering}} \\[2pt]
  7.1 & View personalised event recommendations
    & Events page highlights events matching the user's recent wellness category or activity type \\[2pt]
  7.2 & Browse all available events
    & Full event list displays title, date, location, difficulty badge, and free/paid indicator for each event \\[2pt]
  7.3 & Filter events by difficulty level
    & Selecting Easy / Moderate / Challenging narrows the event list to matching events only \\[2pt]
  7.4 & Search for events by keyword
    & Keyword search field filters visible events to those whose title contains the entered text \\[2pt]
  7.5 & Clear or reset all filters
    & ``Clear Filter'' / ``Reset'' control removes all active filters and restores the complete event list \\[2pt]
  7.6 & Access event details and external links
    & Each event card includes a link that opens the full event details on Eventbrite in a new tab \\[6pt]

  \multicolumn{3}{l}{\textbf{8.0 --- Interactive Exercise Pose Estimation}} \\[2pt]
  8.1 & Request camera access
    & Browser permission prompt is shown before any camera access; exercise session proceeds fully without camera if permission is denied \\[2pt]
  8.2 & Interactive mode activation
    & User can toggle interactive (pose detection) mode on or off during the exercise session without disrupting the timer \\[2pt]
  8.3 & Real-time pose detection
    & MediaPipe landmark skeleton is rendered over the live camera feed with low latency; all processing occurs on-device with no video data transmitted to the server \\[2pt]
  8.4 & Correct posture feedback
    & Visual or text feedback is provided when the detected pose deviates from the expected exercise form \\
  \bottomrule
\end{longtable}

% ──────────────────────────────────────────────────────────────────────────────
\section{Architecture Diagram}

\begin{lstlisting}
+----------------------------------------------------------------------+
|                          USER BROWSER                                |
|                                                                      |
|  Vue 3 SPA (Vite build, served via https://activeageing.vercel.app/) |
|  +-----------+  +------------+  +-------------+  +--------------+   |
|  | Wellness  |  |   Route    |  |   Events    |  |   Exercise   |   |
|  | Check-in  |  |  Planner   |  |    Page     |  |   Session    |   |
|  +-----+-----+  +-----+------+  +------+------+  +------+-------+   |
+--------+--------------+-----------------+----------------+-----------+
         |  HTTPS/JSON  |                 |                |
         v              v                 v                |
+---------------------------------------------------+      |
|        Express API (Vercel Serverless Node)        |      | (client-side only:
|                                                   |      |  MediaPipe Pose)
|  /api/survey      /api/routes     /api/events     |      |
|  /api/results     /api/routesurvey                |      v
|  /api/shared-routes                               |  +------------------+
+-------------+--------------+---------------------+  |  Device Camera   |
              |              |                         |  (on-device ML,  |
              v              v                         |  no data sent)   |
      +--------------+  +-----------------------------++------------------+
      |  MySQL DB    |  |      External APIs           |
      | (PlanetScale |  |                              |
      |  / Railway)  |  |  OpenRouteService (routes)   |
      |              |  |  Nominatim (geocoding)       |
      | Tables:      |  |  Overpass (POIs)             |
      | user_checkins|  |  Eventbrite (events)         |
      | exercise_rec |  |  Mapbox GL (map tiles)       |
      | category_thr |  +------------------------------+
      | shared_routes|
      | route_survey |
      +--------------+
\end{lstlisting}

% ──────────────────────────────────────────────────────────────────────────────
\section{Technology Stack}

\begin{longtable}{L{3cm} L{3cm} L{1.5cm} L{6cm}}
  \toprule
  \textbf{Layer} & \textbf{Technology} & \textbf{Version} & \textbf{Purpose} \\
  \midrule
  \endhead
  Frontend framework    & Vue 3             & 3.5  & Reactive UI, single-page application \\
  Frontend build tool   & Vite              & 8.0  & Dev server, production bundler \\
  Client-side routing   & Vue Router        & 5.0  & Page navigation without full reloads \\
  Map rendering         & Mapbox GL JS      & 3.23 & Interactive route and POI maps \\
  Pose detection        & MediaPipe Pose    & 0.5  & Exercise session motion tracking \\
  Backend framework     & Express.js        & 4.19 & REST API server \\
  Backend runtime       & Node.js           & 18+                  & Serverless function runtime on Vercel \\
  Database client       & mysql2/promise    & 3.9  & Async MySQL queries \\
  Database              & MySQL 8           & ---                  & Persistent data storage \\
  Deployment -- frontend & Vercel (CDN)     & ---                  & Static site hosting \\
  Deployment -- backend  & Vercel (Serverless) & ---               & API function hosting \\
  CORS                  & cors npm package  & 2.8  & Cross-origin request control \\
  Environment config    & dotenv            & 16.4 & Local \texttt{.env} loading \\
  \bottomrule
\end{longtable}

% ──────────────────────────────────────────────────────────────────────────────
\section{Operating Environment}

\begin{longtable}{L{4cm} L{9.5cm}}
  \toprule
  \textbf{Requirement} & \textbf{Detail} \\
  \midrule
  \endhead
  Operating Systems
    & Windows 10+, macOS 11 (Big Sur)+, Linux (Ubuntu 20.04+) \\[2pt]
  Supported Browsers
    & Google Chrome 100+, Mozilla Firefox 100+, Microsoft Edge 100+, Safari 15+ \\[2pt]
  Mobile Platforms
    & Android 10+ (Chrome), iOS 14+ (Safari); application is mobile-responsive \\[2pt]
  Network
    & Active internet connection required; all API calls are live. Offline mode is not supported \\[2pt]
  JavaScript
    & Must be enabled; the application is a client-side SPA and will not function without JavaScript \\[2pt]
  Camera (optional)
    & Required only for pose detection during exercise sessions; standard webcam or smartphone camera \\[2pt]
  Screen resolution
    & Minimum 360\,px wide (mobile); optimised for 375\,px--1440\,px viewport widths \\[2pt]
  Cookies / Storage
    & \texttt{localStorage} must be available; used to persist survey results between sessions \\[2pt]
  Security (HTTPS)
    & Application is served exclusively over HTTPS via Vercel (TLS 1.2+); HTTP requests are redirected \\[2pt]
  Backend hosting
    & Vercel Serverless (Node.js 18); no self-hosted infrastructure required for deployment \\[2pt]
  Database hosting
    & MySQL 8 on PlanetScale or Railway; database must be accessible from Vercel's egress IP ranges \\
  \bottomrule
\end{longtable}

% ──────────────────────────────────────────────────────────────────────────────
\section{Repository Structure}

\begin{lstlisting}
ActiveAgeing/
+-- src/                        Vue frontend source
|   +-- main.js                 App entry point - mounts Vue, registers router
|   +-- router/
|   |   +-- index.js            All client-side routes defined here
|   +-- views/                  One file per page/route
|   |   +-- Home.vue            Landing page
|   |   +-- SnapshotView.vue    Wellness history summary
|   |   +-- Survey.vue          Wellness check-in (5 questions)
|   |   +-- Results.vue         Scored results + exercise recommendations
|   |   +-- ExerciseSession.vue Guided timer-based exercise session
|   |   +-- BreakPage.vue       Rest break between exercises
|   |   +-- Celebration.vue     Session completion screen
|   |   +-- RoutePlan.vue       Route feature landing (enter code or plan)
|   |   +-- RouteSurvey.vue     Route preference survey
|   |   +-- Planner.vue         Main map planner + POI overlay + sharing
|   |   +-- EventsPage.vue      Community events listing
|   |   +-- AllExercisesPage.vueBrowse full exercise library
|   |   +-- HelpPage.vue        Help / FAQ
|   |   +-- ContactPage.vue     Contact information
|   |   +-- TermsPage.vue       Terms of Service
|   |   +-- PrivacyPage.vue     Privacy Policy
|   +-- components/
|       +-- PasswordGate.vue    Demo soft-gate (not a security boundary)
|       +-- HelloWorld.vue      Vite scaffold - unused, safe to delete
|
+-- backend/
|   +-- server.js               Express entry point + route mounting
|   +-- db.js                   MySQL connection pool
|   +-- vercel.json             Vercel serverless deployment config
|   +-- .env.example            Template for required environment variables
|   +-- migration.sql           DB schema v1 + seed data
|   +-- migration_v2.sql        Adds gif_url + extra exercises
|   +-- migration_v3.sql        Exercise content refresh
|   +-- migration_v4.sql        Exercise name corrections
|   +-- routes/
|   |   +-- survey.js           POST /api/survey
|   |   +-- results.js          GET /api/results/:category/:modifier
|   |   +-- events.js           GET /api/events - Eventbrite fetch + cache
|   |   +-- routes.js           POST /api/routes - ORS route generation
|   |   +-- routesurvey.js      POST /api/routesurvey - analytics persist
|   |   +-- shared-routes.js    POST/GET /api/shared-routes - code sharing
|   |   +-- pois.js             POST /api/pois - Overpass proxy (unused)
|   |   +-- example.js          Scaffold smoke-test - not production use
|   +-- utils/
|       +-- scoring.js          Wellness scoring algorithm
|
+-- public/                     Static assets served as-is
+-- package.json                Frontend dependencies
+-- vite.config.js              Vite configuration
+-- MAINTENANCE.md              Maintenance documentation
\end{lstlisting}

% ──────────────────────────────────────────────────────────────────────────────
\section{Local Development Setup}

\subsection{Prerequisites}

\begin{itemize}[leftmargin=1.5em]
  \item Node.js 18 or higher
  \item npm 9 or higher
  \item A MySQL 8 database (local, PlanetScale, or Railway)
  \item API keys for Mapbox, OpenRouteService, and Eventbrite (see Section~\ref{sec:envvars})
\end{itemize}

\subsection{Step 1 -- Clone and Install Dependencies}

\begin{lstlisting}[language=bash]
# Frontend
npm install

# Backend
cd backend
npm install
\end{lstlisting}

\subsection{Step 2 -- Configure }

\begin{lstlisting}[language=bash]
cd backend
cp .env.example .env
# Edit .env with your values (see Section 6)
\end{lstlisting}

\subsection{Step 3 -- Run Database Migrations}

Open a MySQL client (e.g.\ DBeaver or MySQL Workbench) and run the migration files
\textbf{in order}:

\begin{lstlisting}
backend/migration.sql       <- run first
backend/migration_v2.sql    <- then this
backend/migration_v3.sql    <- then this
backend/migration_v4.sql    <- then this
\end{lstlisting}

Each file targets the \texttt{ta15} database. Change \texttt{USE ta15;} to your database name
if different.

\subsection{Step 4 -- Start the Servers}

\begin{lstlisting}[language=bash]
# Terminal 1 - Backend API (http://localhost:3000)
cd backend
npm run dev

# Terminal 2 - Frontend dev server (http://localhost:5173)
npm run dev
\end{lstlisting}

The frontend Vite dev server proxies are \textbf{not} configured -- the frontend calls the
backend directly. Ensure \texttt{FRONTEND\_URL=http://localhost:5173} is set in the backend
\texttt{.env} so CORS allows the connection.

% ──────────────────────────────────────────────────────────────────────────────
\section{Environment Variables}
\label{sec:envvars}

All backend secrets are loaded via \texttt{.env} (locally) or Vercel Environment Variables
(production). \textbf{Never commit \texttt{.env} to version control.}

\begin{longtable}{L{3.5cm} L{1.5cm} L{5cm} L{3.5cm}}
  \toprule
  \textbf{Variable} & \textbf{Required} & \textbf{Description} & \textbf{Example} \\
  \midrule
  \endhead
  \texttt{DB\_HOST}          & Yes & MySQL hostname              & \texttt{aws.connect.psdb.cloud} \\
  \texttt{DB\_PORT}          & Yes & MySQL port                  & \texttt{3306} \\
  \texttt{DB\_USER}          & Yes & MySQL username              & \texttt{activeageing\_user} \\
  \texttt{DB\_PASSWORD}      & Yes & MySQL password              & \texttt{**********} \\
  \texttt{DB\_NAME}          & Yes & Database name               & \texttt{ta15} \\
  \texttt{PORT}              & No  & Local server port (default 3000) & \texttt{3000} \\
  \texttt{FRONTEND\_URL}     & Yes & Allowed CORS origin         & \texttt{https://activeageing.
  vercel.app/} \\
  \texttt{ORS\_API\_KEY}     & Yes & OpenRouteService API key    & \texttt{eyJvcm...} \\
  \texttt{EVENTBRITE\_TOKEN} & Yes & Eventbrite private token    & \texttt{MUV232...} \\
  \bottomrule
\end{longtable}

Frontend-side keys (Mapbox) are embedded directly in \texttt{Planner.vue} at the top of the
\texttt{<script setup>} block. For production, move these to Vite environment variables
(\texttt{VITE\_MAPBOX\_TOKEN}) and access via \texttt{import.meta.env.VITE\_MAPBOX\_TOKEN}.

% ──────────────────────────────────────────────────────────────────────────────
\section{Database Schema}

The database contains five tables. All are created by the migration files in \texttt{backend/}.

\subsection{\texttt{user\_checkins}}

Stores one row per completed wellness survey submission. Used for analytics.

\begin{longtable}{L{4cm} L{3.5cm} L{6cm}}
  \toprule
  \textbf{Column} & \textbf{Type} & \textbf{Notes} \\
  \midrule
  \endhead
  \texttt{id}                 & INT AUTO\_INCREMENT & Primary key \\
  \texttt{exercise\_frequency}& VARCHAR(100)        & Raw answer label from Q1 \\
  \texttt{session\_duration}  & VARCHAR(100)        & Raw answer label from Q2 \\
  \texttt{inactivity\_level}  & VARCHAR(100)        & Raw answer label from Q3 \\
  \texttt{sleep\_hours}       & VARCHAR(100)        & Raw answer label from Q4 \\
  \texttt{restedness}         & VARCHAR(100)        & Raw answer label from Q5 \\
  \texttt{activity\_score}    & INT                 & Computed score (range 2--8) \\
  \texttt{modifier\_score}    & INT                 & Computed score (range 3--12) \\
  \texttt{category\_name}     & VARCHAR(50)         & e.g.\ ``Building Momentum'' \\
  \texttt{modifier\_name}     & VARCHAR(50)         & e.g.\ ``standard'' \\
  \texttt{created\_at}        & TIMESTAMP           & Auto-set on insert \\
  \bottomrule
\end{longtable}

\subsection{\texttt{category\_thresholds}}

Defines the three wellness tiers and their descriptions.

\begin{longtable}{L{4cm} L{9.5cm}}
  \toprule
  \textbf{Column} & \textbf{Notes} \\
  \midrule
  \endhead
  \texttt{category\_name}         & ``Just Getting Started'' / ``Building Momentum'' / ``Thriving'' \\
  \texttt{min\_score}, \texttt{max\_score} & Activity score range that maps to this category \\
  \texttt{description}            & Human-readable description shown on the Results page \\
  \bottomrule
\end{longtable}

\subsection{\texttt{exercise\_recommendations}}

Holds the exercise library. Each exercise is scoped to a \texttt{category\_name} $\times$
\texttt{modifier\_name} combination (9 combinations total, 3 exercises each = 27 rows).

\begin{longtable}{L{4cm} L{9.5cm}}
  \toprule
  \textbf{Column} & \textbf{Notes} \\
  \midrule
  \endhead
  \texttt{category\_name}  & Must match a value in \texttt{category\_thresholds} \\
  \texttt{modifier\_name}  & ``standard'' / ``lighter'' / ``gentle\_short'' \\
  \texttt{exercise\_name}  & Display name \\
  \texttt{duration\_minutes} & Shown in the exercise timer \\
  \texttt{instructions}    & Step-by-step instructions displayed during session \\
  \texttt{gif\_url}        & Optional animated GIF URL (nullable) \\
  \bottomrule
\end{longtable}

\subsection{\texttt{route\_survey\_responses}}

Stores route survey submissions for analytics. Not read back by the frontend.

\begin{longtable}{L{4cm} L{9.5cm}}
  \toprule
  \textbf{Column} & \textbf{Notes} \\
  \midrule
  \endhead
  \texttt{activity\_type}    & ``walking'' / ``jogging'' / ``cycling'' \\
  \texttt{duration\_minutes} & 15 / 30 / 45 / 60 \\
  \texttt{preferred\_pace}   & ``easy'' / ``moderate'' / ``brisk'' \\
  \texttt{environment\_pref} & ``parks'' / ``streets'' / ``mix'' \\
  \texttt{start\_address}    & Suburb string from Nominatim autocomplete \\
  \texttt{start\_lat}, \texttt{start\_lng} & DECIMAL(10,7) coordinates \\
  \bottomrule
\end{longtable}

\subsection{\texttt{shared\_routes}}

Stores shared route events, looked up by the 6-character code.

\begin{longtable}{L{4cm} L{9.5cm}}
  \toprule
  \textbf{Column} & \textbf{Notes} \\
  \midrule
  \endhead
  \texttt{code}            & VARCHAR(8) UNIQUE --- 6-char base36 uppercase \\
  \texttt{expires\_at}     & 48 hours after scheduled event date \\
  \texttt{route\_geometry} & LONGTEXT --- JSON-serialised GeoJSON LineString \\
  \texttt{survey\_data}    & TEXT --- JSON-serialised route survey answers \\
  \bottomrule
\end{longtable}

% ──────────────────────────────────────────────────────────────────────────────
\section{Data Sources \& Management}

\subsection{Data Sources}

\begin{longtable}{L{2.4cm} L{2.8cm} L{2.2cm} L{2cm} L{4.1cm}}
  \toprule
  \textbf{Source} & \textbf{Data Type} & \textbf{Access Method} & \textbf{Update Freq.} & \textbf{Licence / Terms} \\
  \midrule
  \endhead
  Eventbrite API
    & Upcoming community events (title, date, location, URL, free/paid)
    & HTTPS REST (server-side, per organiser)
    & 30-min in-memory cache; live on cold start
    & Eventbrite API Terms; public event data only \\[4pt]
  Overpass / OSM
    & POIs: benches, drinking water, toilets, parks, landmarks
    & HTTPS REST (client-side, 3-mirror fallback)
    & On-demand per route load; no local caching
    & ODbL licence; attribution required in UI \\[4pt]
  Nominatim / OSM
    & Suburb / address geocoding and reverse-geocoding
    & HTTPS REST (client-side, 300ms debounced)
    & On-demand per user search
    & ODbL; Nominatim Usage Policy (no bulk requests, valid User-Agent header required) \\[4pt]
  OpenRouteService
    & Walking / jogging / cycling route geometry
    & HTTPS REST (server-side)
    & On-demand per user request
    & ORS API Terms; free tier: 500 req/day, 40 req/min \\[4pt]
  Mapbox
    & Map tiles and base map rendering
    & Mapbox GL JS (client-side, WebGL)
    & Tile streaming per viewport
    & Mapbox ToS; free tier: 50,000 map loads/month \\[4pt]
  MySQL DB (internal)
    & Wellness responses, exercise library, shared routes, route analytics
    & mysql2 connection pool (server-side)
    & Persistent; written on each survey or route-share event
    & Internal; no third-party licence \\
  \bottomrule
\end{longtable}

\subsection{Data Maintenance}

\begin{itemize}[leftmargin=1.5em]
  \item \textbf{Exercise library:} Update via SQL \texttt{UPDATE}/\texttt{INSERT} on
        \texttt{exercise\_recommendations} (see the Common Maintenance Tasks section).
  \item \textbf{Wellness thresholds:} Modify \texttt{category\_thresholds} rows in the
        database. No code change required unless score ranges change.
  \item \textbf{Event organisers:} Add or remove Eventbrite organiser IDs in
        \texttt{backend/routes/events.js} (see the Common Maintenance Tasks section).
  \item \textbf{Shared routes:} Rows in \texttt{shared\_routes} expire automatically after
        48 hours (enforced by \texttt{WHERE expires\_at > NOW()} in the GET handler).
        Optionally run the following monthly to reclaim storage:
        \texttt{DELETE FROM shared\_routes WHERE expires\_at < NOW();}
  \item \textbf{Analytics data:} \texttt{user\_checkins} and \texttt{route\_survey\_responses}
        are append-only. No automatic purge is implemented --- review and archive or purge rows
        periodically according to your data retention policy.
\end{itemize}

% ──────────────────────────────────────────────────────────────────────────────
\section{API Reference}

All endpoints are under the base URL \texttt{/api/}.

\subsection{\texttt{POST /api/survey}}

Scores the wellness survey and returns exercise recommendations.

\textbf{Request body:}
\begin{lstlisting}[language={}]
{
  "answers": [
    "A few times a week",
    "15 to 30 minutes",
    "Some of the day",
    "7 to 8 hours",
    "Fairly rested"
  ]
}
\end{lstlisting}

\textbf{Response:}
\begin{lstlisting}[language={}]
{
  "activityScore": 5,
  "modifierScore": 4,
  "categoryName": "Building Momentum",
  "modifierName": "standard",
  "chartPercent": 63,
  "category": { "category_name": "Building Momentum", "description": "..." },
  "exercises": [{ "exercise_name": "Brisk Walking", "duration_minutes": 10 }]
}
\end{lstlisting}

\textbf{Resilience:} If the database is unavailable, scores are still returned with hardcoded
fallback exercises. The endpoint never returns HTTP~500 to the user.

\subsection{\texttt{GET /api/results/:categoryName/:modifierName}}

Fetches category description and all exercises for a given tier/modifier. Used when
re-fetching results from \texttt{localStorage} after a page refresh.

\subsection{\texttt{GET /api/events}}

Returns up to 50 upcoming Melbourne senior wellness events from Eventbrite. Results are
cached in-memory for 30 minutes.

\textbf{Response:}
\begin{lstlisting}[language={}]
{
  "events": [{
    "id": "...", "title": "...", "time": "...",
    "location": "...", "url": "...", "is_free": true
  }]
}
\end{lstlisting}

\textbf{To add a new event organiser:} Add their Eventbrite organiser ID to
\texttt{MELBOURNE\_ORGANISER\_IDS} in \texttt{backend/routes/events.js}.

\subsection{\texttt{POST /api/routes}}

Generates up to 3 round-trip route variants using OpenRouteService.

\textbf{Request body:}
\begin{lstlisting}[language={}]
{
  "activity_type": "walking",
  "duration_minutes": 30,
  "preferred_pace": "moderate",
  "start_lat": -37.8,
  "start_lng": 144.9
}
\end{lstlisting}

\textbf{Response:}
\begin{lstlisting}[language={}]
{
  "routes": [{
    "index": 0,
    "geometry": { "type": "LineString", "coordinates": [[...]] },
    "distance_label": "2.8 km",
    "duration_label": "34 min"
  }]
}
\end{lstlisting}

\subsection{\texttt{POST /api/routes/waypoint}}

Calculates a custom route through provided waypoints (used when the user selects POIs on
the map). Appends the start coordinate at the end to close the loop.

\subsection{\texttt{POST /api/routesurvey}}

Persists a completed route survey for analytics. Called fire-and-forget by the frontend
--- a failure here does not block the user.

\subsection{\texttt{POST /api/shared-routes}}

Creates a shared route event. Returns a 6-character code and an expiry timestamp.

\textbf{Request body:}
\begin{lstlisting}[language={}]
{
  "scheduled_date": "2026-06-15",
  "activity_type": "walking",
  "route_geometry": {...},
  "survey_data": {...}
}
\end{lstlisting}

\subsection{\texttt{GET /api/shared-routes/:code}}

Returns a shared route by code. Returns HTTP~404 if expired or not found.

% ──────────────────────────────────────────────────────────────────────────────
\section{Frontend Features \& Pages}

\subsection{Wellness Check-in Flow}

\begin{center}
\texttt{/snapshot $\rightarrow$ /survey $\rightarrow$ /results $\rightarrow$
/exercise $\rightarrow$ /break $\rightarrow$ /celebration}
\end{center}

\begin{longtable}{L{3cm} L{4cm} L{6.5cm}}
  \toprule
  \textbf{Page} & \textbf{File} & \textbf{Key Behaviour} \\
  \midrule
  \endhead
  Snapshot         & SnapshotView.vue     & Shows previous results from \texttt{localStorage}; clears old data before new survey \\
  Survey           & Survey.vue           & 5-question survey; auto-advances on answer; scores sent to backend \\
  Results          & Results.vue          & SVG circle chart; session points badge (read-once from \texttt{localStorage}); 3 exercise cards \\
  Exercise Session & ExerciseSession.vue  & Timer per exercise; MediaPipe pose detection overlay \\
  Break            & BreakPage.vue        & Rest timer between exercises \\
  Celebration      & Celebration.vue      & Completion screen; awards points stored in \texttt{localStorage} \\
  \bottomrule
\end{longtable}

\textbf{Scoring algorithm} (see \texttt{backend/utils/scoring.js}):

\begin{lstlisting}
Activity score  = Q1 + Q2        (range 2-8)
Modifier score  = Q3 + Q4 + Q5   (range 3-12)

Activity score -> Category:
  2-3  ->  Just Getting Started
  4-6  ->  Building Momentum
  7-8  ->  Thriving

Modifier score -> Exercise intensity:
  3-5  ->  standard
  6-8  ->  lighter
  9-12 ->  gentle_short
\end{lstlisting}

\subsection{Route Planning Flow}

\begin{center}
\texttt{/routeplan $\rightarrow$ /routesurvey $\rightarrow$ /planner}
\end{center}

\begin{longtable}{L{3cm} L{4cm} L{6.5cm}}
  \toprule
  \textbf{Page} & \textbf{File} & \textbf{Key Behaviour} \\
  \midrule
  \endhead
  Route Plan    & RoutePlan.vue    & Entry point; user can start new plan or enter a share code \\
  Route Survey  & RouteSurvey.vue  & Captures suburb (Nominatim autocomplete), activity, duration, pace, environment, rest stops \\
  Planner       & Planner.vue      & Mapbox map; 3 route variants; POI overlay; route sharing; PDF/Google Maps export \\
  \bottomrule
\end{longtable}

\textbf{Route naming:} Route names are derived from the suburb in the user's
\texttt{start\_address} (e.g.\ ``Fitzroy -- Route 1''). If no address is available, falls
back to activity + pace (e.g.\ ``Moderate Walking -- Route 2'').

\subsection{Community Events}

\texttt{/events} --- Fetches from the backend Eventbrite cache. Events are filtered to
upcoming Melbourne/VIC events, sorted by date, and displayed with difficulty classification
(inferred from keywords in the event title).

\subsection{Static Pages}

\texttt{/help}, \texttt{/terms}, \texttt{/privacy}, \texttt{/contact} --- Static content
pages with no backend calls. Update content directly in the respective \texttt{.vue} file.

% ──────────────────────────────────────────────────────────────────────────────
\section{Third-Party Integrations}

\subsection{Mapbox GL JS}
\begin{itemize}[leftmargin=1.5em]
  \item \textbf{Used in:} \texttt{Planner.vue}
  \item \textbf{Purpose:} Renders the interactive route map and thumbnail maps for each route variant.
  \item \textbf{Key note:} The map instance is stored in a plain \texttt{let} variable (not a
        Vue \texttt{ref}) because Vue's Proxy wrapping breaks Mapbox GL's internal WebGL state.
  \item \textbf{PDF export:} The map is initialised with \texttt{preserveDrawingBuffer: true}
        so \texttt{getCanvas().toDataURL()} can capture the WebGL canvas for PDF generation.
  \item \textbf{Key setting:} \texttt{VITE\_MAPBOX\_TOKEN} (currently hardcoded --- see
        Section~\ref{sec:envvars} for production recommendation).
\end{itemize}

\subsection{OpenRouteService (ORS)}
\begin{itemize}[leftmargin=1.5em]
  \item \textbf{Used in:} \texttt{backend/routes/routes.js}
  \item \textbf{Purpose:} Generates walking/jogging/cycling round-trip routes from a start coordinate.
  \item \textbf{Profile note:} Both ``walking'' and ``jogging'' use the \texttt{foot-walking}
        ORS profile. Speed differences are handled client-side via the \texttt{SPEEDS} table.
  \item \textbf{Seed parameter:} Seeds \texttt{0}, \texttt{1}, \texttt{2} produce three
        distinct loop shapes of the same target length.
  \item \textbf{Rate limits:} Free tier allows 500 requests/day. Monitor in the ORS dashboard.
\end{itemize}

\subsection{Nominatim (OpenStreetMap Geocoding)}
\begin{itemize}[leftmargin=1.5em]
  \item \textbf{Used in:} \texttt{RouteSurvey.vue} (client-side, directly)
  \item \textbf{Purpose:} Autocomplete suburb search and reverse-geocoding when user grants
        location permission.
  \item \textbf{Usage policy:} Requires a valid \texttt{User-Agent} header and prohibits bulk
        requests. The frontend adds a 300\,ms debounce before querying.
        \textbf{Do not remove this debounce.}
  \item No API key required, but heavy usage may trigger rate limiting.
\end{itemize}

\subsection{Overpass API (OpenStreetMap POIs)}
\begin{itemize}[leftmargin=1.5em]
  \item \textbf{Used in:} \texttt{Planner.vue} (client-side, directly)
  \item \textbf{Purpose:} Fetches points of interest within a 60-metre buffer around the
        generated route.
  \item \textbf{Mirrors:} Three Overpass mirrors are tried in sequence
        (\texttt{overpass-api.de}, \texttt{overpass.kumi.systems}, \texttt{maps.mail.ru})
        to handle downtime.
  \item A server-side proxy (\texttt{backend/routes/pois.js}) exists but is currently unused.
\end{itemize}

\subsection{Eventbrite}
\begin{itemize}[leftmargin=1.5em]
  \item \textbf{Used in:} \texttt{backend/routes/events.js}
  \item \textbf{Purpose:} Fetches upcoming events from a curated list of Melbourne senior
        wellness organisers.
  \item \textbf{Caching:} Results are cached in-memory for 30 minutes to respect the
        free-tier rate limit.
  \item \textbf{Token:} Set via \texttt{EVENTBRITE\_TOKEN} environment variable.
\end{itemize}

\subsection{MediaPipe Pose}
\begin{itemize}[leftmargin=1.5em]
  \item \textbf{Used in:} \texttt{ExerciseSession.vue}
  \item \textbf{Purpose:} Real-time pose landmark detection via the device camera during
        exercise sessions.
  \item \textbf{Privacy note:} Camera frames are processed entirely on-device (client-side ML).
        No video data is transmitted to any server.
\end{itemize}

% ──────────────────────────────────────────────────────────────────────────────
\section{Security Measures}

\subsection{CORS Restriction}
The backend restricts cross-origin requests to a single allowed origin defined in
\texttt{FRONTEND\_URL}. Only the deployed frontend (or \texttt{localhost:5173} in
development) can call the API.

\textbf{Maintenance action:} When redeploying the frontend to a new domain, update
\texttt{FRONTEND\_URL} in the backend's Vercel environment variables.

\subsection{Input Validation}
\begin{itemize}[leftmargin=1.5em]
  \item \textbf{Survey endpoint} (\texttt{/api/survey}): Validates that exactly 5 answers are
        provided. Unknown answer labels default to a mid-range score rather than crashing.
  \item \textbf{Route survey endpoint} (\texttt{/api/routesurvey}): Uses an allowlist for all
        five survey fields. Any value not in the allowlist returns HTTP~400.
  \item \textbf{Shared routes endpoint}: \texttt{scheduled\_date} is required; all other
        fields are nullable.
\end{itemize}

\subsection{Parameterised Queries}
All database queries use parameterised statements (\texttt{?} placeholders via
\texttt{mysql2}). There are no string-concatenated SQL queries in the codebase, preventing
SQL injection.

\subsection{No Stored PII}
The application does not collect names, email addresses, or device identifiers. Survey
responses store only answer labels and computed scores. Location data is stored only in
\texttt{route\_survey\_responses} for analytics and is not linked to any individual.

\subsection{Password Gate}
The \texttt{PasswordGate} component is a \textbf{soft demo gate only}. It is not a security
control --- the password is hardcoded in client-side JavaScript and is visible to anyone
who inspects the source. Do not rely on it to protect sensitive data.

\subsection{HTTPS}
Both the frontend and backend are served exclusively over HTTPS via Vercel. Vercel enforces
HTTPS by default and redirects HTTP requests.

\subsection{API Keys}
\begin{itemize}[leftmargin=1.5em]
  \item Backend API keys (\texttt{ORS\_API\_KEY}, \texttt{EVENTBRITE\_TOKEN},
        \texttt{DB\_PASSWORD}) are stored as Vercel Environment Variables and are never
        exposed to the browser.
  \item The Mapbox token is currently hardcoded in \texttt{Planner.vue}.
        \textbf{Recommended action:} Move to a Vite environment variable
        (\texttt{VITE\_MAPBOX\_TOKEN}) and restrict the token's allowed URLs in the Mapbox
        dashboard to the production domain.
\end{itemize}

\subsection{Camera Access}
MediaPipe pose detection requires camera permission. The browser prompts the user; the
application does not request camera access until the user begins an exercise session.
No video frames leave the device.

% ──────────────────────────────────────────────────────────────────────────────
\section{Deployment}

\subsection{Frontend (Vercel Static) - https://activeageing.vercel.app/}

The frontend is a Vite-built static site. Vercel detects it automatically.

\begin{lstlisting}[language=bash]
# Build locally to verify
npm run build
# Output is in dist/
\end{lstlisting}

Vercel deployment settings:
\begin{itemize}[leftmargin=1.5em]
  \item \textbf{Build command:} \texttt{npm run build}
  \item \textbf{Output directory:} \texttt{dist}
  \item \textbf{Framework preset:} Vue (or Vite)
\end{itemize}

Because Vue Router uses HTML5 History mode (\texttt{createWebHistory}), the Vercel project
must rewrite all paths to \texttt{index.html}. Add a \texttt{vercel.json} in the project
root if not already present:

\begin{lstlisting}[language={}]
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
\end{lstlisting}

\subsection{Backend (Vercel Serverless) - https://activeageing-backend.vercel.app/}

The backend has its own \texttt{vercel.json} at \texttt{backend/vercel.json} which routes
all requests to \texttt{server.js} as a serverless Node function.

\begin{lstlisting}[language=bash]
cd backend
vercel deploy
\end{lstlisting}

Set all environment variables listed in Section~\ref{sec:envvars} in the Vercel dashboard
under \textbf{Settings $\rightarrow$ Environment Variables}.

\textbf{Serverless cold-start note:} In-memory cache (Eventbrite events) is cleared on
each cold start. The first request after a cold start will make a live Eventbrite API call;
subsequent requests within 30 minutes will be served from cache.

% ──────────────────────────────────────────────────────────────────────────────
\section{Common Maintenance Tasks}

\subsection{Update Exercise Content}

\begin{enumerate}[leftmargin=1.5em]
  \item Write an \texttt{UPDATE} or \texttt{INSERT} SQL statement targeting
        \texttt{exercise\_recommendations}.
  \item Verify the \texttt{category\_name} and \texttt{modifier\_name} values match exactly
        (case-sensitive).
  \item Ensure each \texttt{category\_name} $\times$ \texttt{modifier\_name} combination has
        exactly 3 exercises (the frontend always displays 3).
  \item Run the SQL against the production database.
\end{enumerate}

\begin{lstlisting}[language=sql]
-- Example: update instructions for an exercise
UPDATE exercise_recommendations
SET instructions = 'New instructions here.'
WHERE exercise_name = 'Brisk Walking'
  AND category_name = 'Building Momentum';
\end{lstlisting}

\subsection{Add a New Community Event Organiser}

\begin{enumerate}[leftmargin=1.5em]
  \item Find the organiser's Eventbrite page URL:
        \texttt{eventbrite.com.au/o/\{name\}-XXXXXXX}
  \item Copy the trailing numeric ID (e.g.\ \texttt{12345678901}).
  \item Add it to \texttt{MELBOURNE\_ORGANISER\_IDS} in
        \texttt{backend/routes/events.js}.
  \item If the organiser runs mixed-topic events, add a title filter to
        \texttt{ORGANISER\_TITLE\_FILTERS}.
  \item Redeploy the backend.
\end{enumerate}

\subsection{Add a New Page / Route}

\begin{enumerate}[leftmargin=1.5em]
  \item Create \texttt{src/views/NewPage.vue}.
  \item Import and add a route entry in \texttt{src/router/index.js}.
  \item Link to it from wherever appropriate in the navigation.
\end{enumerate}

\subsection{Rotate an API Key}

\begin{enumerate}[leftmargin=1.5em]
  \item Generate a new key in the provider's dashboard.
  \item Update the corresponding Vercel Environment Variable.
  \item Trigger a redeployment (or the new variable takes effect on next cold start).
  \item Revoke the old key only after confirming the new deployment is live.
\end{enumerate}

\subsection{Run Database Migrations}

Connect to the production database and run the relevant \texttt{.sql} file. All migration
files are idempotent (\texttt{CREATE TABLE IF NOT EXISTS}, \texttt{ADD COLUMN IF NOT EXISTS})
and safe to re-run. The \texttt{shared\_routes} table is created automatically at runtime by
\texttt{ensureTable()} in \texttt{backend/routes/shared-routes.js} --- no manual migration
needed for that table.

% ──────────────────────────────────────────────────────────────────────────────
\section{Troubleshooting}

\subsection{Events Page Shows No Events}

\begin{enumerate}[leftmargin=1.5em]
  \item Check \texttt{EVENTBRITE\_TOKEN} is set and valid:
        \texttt{GET /api/events/test} returns your Eventbrite user profile if the token is
        correct.
  \item Check that the organisers in \texttt{MELBOURNE\_ORGANISER\_IDS} still have active
        events: \texttt{GET /api/events/test-organiser?id=<ID>}.
  \item The in-memory cache survives for 30 minutes --- restart the serverless function or
        wait for cache expiry if you updated organiser data.
\end{enumerate}

\subsection{Routes Are Not Generating}

\begin{enumerate}[leftmargin=1.5em]
  \item Check \texttt{ORS\_API\_KEY} is valid and within rate limits (500 requests/day on
        free tier).
  \item Check the ORS dashboard for quota usage.
  \item The backend logs \texttt{ORS seed X error:} to the console when ORS returns an error
        --- check Vercel function logs.
  \item Ensure \texttt{start\_lat} and \texttt{start\_lng} are valid decimal numbers (not
        strings).
\end{enumerate}

\subsection{Map Does Not Load}

\begin{enumerate}[leftmargin=1.5em]
  \item Verify the Mapbox token in \texttt{Planner.vue} is valid and not expired.
  \item In the Mapbox dashboard, confirm the token's allowed URLs include the deployment
        domain.
  \item \texttt{preserveDrawingBuffer: true} on the map constructor is required --- do not
        remove it, as it enables PDF export.
\end{enumerate}

\subsection{Database Connection Errors}

\begin{enumerate}[leftmargin=1.5em]
  \item Confirm all five \texttt{DB\_*} environment variables are set correctly in Vercel.
  \item Check that the database host allows connections from Vercel's IP ranges.
  \item Connection pool limit is 10 (\texttt{connectionLimit: 10} in \texttt{db.js}). If the
        database's \texttt{max\_connections} is lower, reduce this value.
\end{enumerate}

\subsection{Survey Results Not Persisting After Page Refresh}

Results are stored in \texttt{localStorage} under the key \texttt{surveyResult}. If a user
clears browser storage or uses private/incognito mode, results will not persist. This is
expected behaviour --- the application does not require an account.

\subsection{POIs Not Appearing on the Route Map}

\begin{enumerate}[leftmargin=1.5em]
  \item Overpass API may be temporarily unavailable. The frontend tries three mirrors in
        sequence; if all fail, no POIs are shown (non-critical failure --- the route still
        works).
  \item Check the browser console for \texttt{Overpass error} messages.
  \item The route buffer filter is 60 metres --- POIs further than 60\,m from the route line
        will not appear even if they are nearby.
\end{enumerate}

% ──────────────────────────────────────────────────────────────────────────────
\section{Test Specifications}

Testing was performed across two iterations by Tester: Abhay Ramachandra (Team TA015).
\textbf{Iteration 2} covered smoke testing and navigation validation (06 May 2025, Chrome,
desktop view). \textbf{Iteration 3} covered full functional testing (17--18 May 2026, Chrome /
Safari / Edge, desktop + mobile + tablet).

\subsection{Iteration 2 --- Smoke \& Navigation Testing}

\textbf{Environment:} Chrome browser, laptop, desktop view.
\textbf{Result: 23 / 23 passed (100\%).}

\begin{longtable}{L{1.5cm} L{3.5cm} L{5.5cm} L{1cm} L{1cm} L{1cm}}
  \toprule
  \textbf{Test ID} & \textbf{Test Area} & \textbf{Description} & \textbf{Tests} & \textbf{Pass} & \textbf{Fail} \\
  \midrule
  \endhead
  SM-01--03 & Application stability
    & App loads without blank screen or crash; homepage refresh reloads correctly; no blocking console errors
    & 3 & 3 & 0 \\[2pt]
  NAV-01--05 & Homepage elements
    & Page title/hero visible; ``Get Started'' and ``Plan an Activity'' buttons clickable; no text overlap; scroll works
    & 5 & 5 & 0 \\[2pt]
  NAV-06--08 & Get Started flow
    & ``Get Started'' navigates to Wellness Check-in; first question visible; browser back returns to homepage
    & 3 & 3 & 0 \\[2pt]
  NAV-09--11 & Plan Activity flow
    & ``Plan an Activity'' opens Route Preference Form; all form options visible; return to homepage without breakage
    & 3 & 3 & 0 \\[2pt]
  NAV-12--15 & Route Results flow
    & ``Find My Route'' opens Route Results; route cards visible; map loads; ``Invite Others'' opens event creation page
    & 4 & 4 & 0 \\[2pt]
  NAV-16--17 & External navigation (Google Maps)
    & ``Open in Google Maps'' opens in new tab; returning to app tab preserves application state
    & 2 & 2 & 0 \\[2pt]
  NAV-18--20 & Mobile responsiveness
    & Homepage layout intact in dev tools mobile view; main buttons visible and tappable; pages open correctly
    & 3 & 3 & 0 \\
  \midrule
  \multicolumn{3}{l}{\textbf{Iteration 2 Total}} & \textbf{23} & \textbf{23} & \textbf{0} \\
  \bottomrule
\end{longtable}

\subsection{Iteration 3 --- Functional Testing}

\textbf{Environment:} Chrome, Safari, Edge; laptop, desktop, mobile, tablet views.
\textbf{Result: 118 / 121 passed (97.5\%). 3 failures documented on LeanKit.}

\begin{longtable}{L{1.5cm} L{3.5cm} L{5cm} L{1cm} L{1cm} L{1.5cm}}
  \toprule
  \textbf{Test Group} & \textbf{Test Area} & \textbf{Description} & \textbf{Tests} & \textbf{Pass} & \textbf{Fail / Issues} \\
  \midrule
  \endhead
  WCI & Wellness check-in flow
    & Flow initiation, question navigation, answer selection, required field validation, progress tracking, back navigation, refresh handling, console check
    & 10 & 10 & 0 \\[2pt]
  WCL & Wellness category logic
    & Correct category assigned for low / moderate / high activity profiles (all 3 tiers); consistency on repeated inputs; results explanation clarity
    & 8 & 8 & 0 \\[2pt]
  GEF & Guided exercise flow
    & Exercise section access, card display, navigation between exercises, session completion, return to dashboard, refresh handling, console errors
    & 11 & 9 & \textbf{2} \\[2pt]
  TRP & Health \& wellness trivia popups
    & Button visibility on exercise cards, popup open/close, trivia relevance and readability, click-outside dismissal, multi-exercise variation, flow continuity
    & 12 & 12 & 0 \\[2pt]
  HWR & Health \& wellness resources
    & Resources section access, topic-based organisation, external link functionality and validity, session not lost on external link
    & 12 & 12 & 0 \\[2pt]
  RPF & Route planning flow
    & Form access, activity / duration / pace / environment / rest-stop selection, required field validation, 3 route options displayed with plain-language explanations
    & 15 & 15 & 0 \\[2pt]
  IMP & Interactive map \& route selection
    & Map loading, default route display, path and marker visibility (start/end, rest stops, green space), route switching, zoom and pan
    & 14 & 14 & 0 \\[2pt]
  GMN & Google Maps navigation
    & ``Open in Google Maps'' for all route options, route/location details passed correctly, waypoint inclusion, popup blocker fallback, console check
    & 9 & 9 & 0 \\[2pt]
  PES & Private event sharing flow
    & Event creation from route, route data carryover, required field validation, code/link generation, invitee page access, join functionality, PDF download, expired link handling
    & 18 & 17 & \textbf{1} \\[2pt]
  PER & Personalised event recommendations
    & Events page access after check-in, recommended section visibility, recommendations for low / moderate / active profiles, interest alignment, empty state handling, layout readability
    & 12 & 12 & 0 \\
  \midrule
  \multicolumn{3}{l}{\textbf{Iteration 3 Total}} & \textbf{121} & \textbf{118} & \textbf{3} \\
  \bottomrule
\end{longtable}

\subsection{Known Failures (Raised on LeanKit)}

\begin{longtable}{L{2cm} L{3cm} L{8.5cm}}
  \toprule
  \textbf{Test ID} & \textbf{Area} & \textbf{Issue} \\
  \midrule
  \endhead
  GEF-10 & Guided Exercise & App does not handle page refresh during an active exercise session correctly --- session state is lost on refresh \\[2pt]
  GEF-11 & Guided Exercise & Blocking console error appears during the exercise flow --- root cause under investigation \\[2pt]
  PES-08 & Private Event Sharing & Share link does not correctly open the invitee page --- recipient cannot load the shared route via the generated link \\
  \bottomrule
\end{longtable}

\subsection{Test Checklists}

Use the following checklist before each release and after any configuration or content change.

\begin{longtable}{L{5cm} L{2.5cm} L{6cm}}
  \toprule
  \textbf{Test Item} & \textbf{When to Run} & \textbf{Pass Condition} \\
  \midrule
  \endhead
  Home page loads without errors               & Every deploy    & No console errors; all sections visible \\[2pt]
  Wellness survey submits successfully          & Every deploy    & HTTP 200 from \texttt{/api/survey}; results page displays \\[2pt]
  Exercise session timer functions             & Every deploy    & Timer advances; break screen then celebration appear \\[2pt]
  Exercise page refresh handled correctly      & Every deploy    & GEF-10 fix verified --- session state survives refresh \\[2pt]
  No blocking console errors in exercise flow  & Every deploy    & GEF-11 fix verified --- browser console clean during session \\[2pt]
  Share link opens invitee page correctly      & Every deploy    & PES-08 fix verified --- recipient loads shared route via link \\[2pt]
  Route generation returns $\geq$1 route       & Every deploy    & At least 1 route displayed on map \\[2pt]
  Events page loads at least 1 event          & Every deploy    & Event cards render; no ``Failed to load'' error \\[2pt]
  Share code create and retrieve              & Every deploy    & Code generated; same route loaded via code on \texttt{/routeplan} \\[2pt]
  Mobile layout at 375\,px                    & Every deploy    & No horizontal scroll; all buttons tappable \\[2pt]
  Exercise trivia popups open and close        & After content update & Popup opens on button click; closes on close button and click-outside \\[2pt]
  Wellness category logic correct              & After scoring change & Low / moderate / high profiles map to correct categories \\[2pt]
  Exercise content correct                    & After DB update & Exercises match expected category/modifier combination \\[2pt]
  New event organiser returns results         & After organiser change & At least 1 event from new organiser appears \\[2pt]
  New API key is active                       & After key rotation & Affected feature works end-to-end in production \\[2pt]
  Database migration applies cleanly          & After migration  & No SQL errors; new columns / tables exist \\[2pt]
  HTTPS enforced (HTTP redirects)             & After deployment & \texttt{http://} URL redirects to \texttt{https://} with 301 \\[2pt]
  Expired share code returns 404              & Periodically    & Code past 48\,h expiry returns HTTP 404 \\[2pt]
  \texttt{localStorage} cleared between runs  & Before test run & Previous survey results do not carry into new session \\
  \bottomrule
\end{longtable}

% ──────────────────────────────────────────────────────────────────────────────
\section{Regulatory Compliance}

\subsection{Privacy Act 1988 (Australia) \& Australian Privacy Principles (APPs)}

The application does not collect personal information as defined by the Privacy Act (names,
email addresses, phone numbers, government identifiers). Survey responses and location data
are stored without any link to an individual identity. No data is shared with third parties
for marketing purposes.

\textbf{Recommended action:} If a contact form or user account feature is added in future,
a formal Privacy Impact Assessment will be required and the Privacy Policy (\texttt{/privacy})
must be updated.

\subsection{Health Information}

Exercise recommendations provided by the application are general wellness suggestions, not
medical advice. The Terms of Service (\texttt{/terms}) should include a health disclaimer
advising users to consult a healthcare professional before beginning any new exercise program.
Verify this disclaimer is present and reviewed by a qualified legal or health professional.

\subsection{Accessibility -- WCAG 2.1}

The application targets older adults (65+) and should comply with WCAG 2.1 Level AA.
Key areas to review:
\begin{itemize}[leftmargin=1.5em]
  \item Colour contrast ratios for all text elements (minimum 4.5:1 for normal text).
  \item All interactive elements accessible via keyboard navigation.
  \item All images include meaningful \texttt{alt} attributes.
  \item Font sizes should remain readable at default zoom levels (minimum 16\,px body text
        recommended for this audience).
\end{itemize}

\subsection{OpenStreetMap / Nominatim Usage Policy}

Nominatim requires:
\begin{itemize}[leftmargin=1.5em]
  \item A valid \texttt{User-Agent} header identifying the application.
  \item No bulk or automated querying.
  \item The 300\,ms debounce in \texttt{RouteSurvey.vue} satisfies the ``no automated
        querying'' requirement. \textbf{Do not remove it.}
  \item Attribution: OpenStreetMap data is \textcopyright{} OpenStreetMap contributors
        (ODbL licence). The map tiles and geocoding results must be attributed accordingly
        in the UI.
\end{itemize}

\subsection{Mapbox Terms of Service}

Mapbox usage is governed by the Mapbox Terms of Service. The free tier (Mapbox Free)
includes 50,000 map loads/month. Monitor usage in the Mapbox dashboard. Exceeding the free
tier incurs charges.

\subsection{OpenRouteService Terms}

ORS free tier allows 500 route requests/day and 40 requests/minute. Usage is tied to the
\texttt{ORS\_API\_KEY}. Monitor in the ORS dashboard and upgrade the plan if usage grows.

\subsection{Eventbrite API Terms}

The Eventbrite API is used to fetch publicly available event data from curated organisers.
No user Eventbrite accounts are accessed. Ensure the \texttt{EVENTBRITE\_TOKEN} used is a
private token belonging to an authorised account, and that the account has agreed to
Eventbrite's API Terms.

% ──────────────────────────────────────────────────────────────────────────────
\section{Future Plan}

The following roadmap outlines the strategic direction for the ActiveAgeing platform beyond
the current v1.0 release, prioritised by impact on the target demographic (seniors 65+).

\subsection{Short-Term (1--3 Months)}

\begin{itemize}[leftmargin=1.5em]
  \item \textbf{Move Mapbox token to environment variable} --- Replace the hardcoded token in
        \texttt{Planner.vue} with \texttt{VITE\_MAPBOX\_TOKEN} and restrict the token's allowed
        URLs to the production domain in the Mapbox dashboard.
  \item \textbf{Add backend rate limiting} --- Protect ORS quota and database connections from
        abuse by adding \texttt{express-rate-limit} middleware to the API server.
  \item \textbf{Add basic CI/CD} --- Configure GitHub Actions to run lint and smoke-tests on
        each pull request so regressions are caught before merging to \texttt{main}.
  \item \textbf{Purge expired shared routes} --- Schedule a monthly cleanup:
        \texttt{DELETE FROM shared\_routes WHERE expires\_at < NOW();} to prevent unbounded growth.
\end{itemize}

\subsection{Medium-Term (3--6 Months)}

\begin{itemize}[leftmargin=1.5em]
  \item \textbf{Persistent Eventbrite cache (Redis)} --- Replace in-memory caching with a Redis
        instance so the 30-minute cache survives Vercel cold starts, reducing unnecessary API calls.
  \item \textbf{Accessibility audit (WCAG 2.1 AA)} --- Commission a structured accessibility
        review with screen-reader and keyboard-navigation testing, specific to the senior user
        demographic (minimum 16\,px body text, 4.5:1 contrast ratio).
  \item \textbf{Cycling route UI} --- The ORS backend already supports cycling; expose it as a
        selectable option in the Route Survey frontend (currently hidden from the UI).
  \item \textbf{Wellness history dashboard} --- Allow users to view past check-in scores over
        time using an anonymous session token stored in \texttt{localStorage}.
\end{itemize}

\subsection{Long-Term (6+ Months)}

\begin{itemize}[leftmargin=1.5em]
  \item \textbf{Optional user accounts} --- Introduce opt-in accounts for cross-device progress
        tracking, route history, and saved events. Requires a formal Privacy Impact Assessment
        before implementation.
  \item \textbf{Carer / family portal} --- Allow a family member or carer to view a senior's
        wellness check-in history and upcoming planned routes.
  \item \textbf{Expanded exercise library} --- Partner with physiotherapy organisations to add
        video content and condition-specific programs (e.g.\ low-impact for arthritis, balance
        training for fall prevention).
  \item \textbf{Multilingual support} --- Provide the application in languages spoken by
        Melbourne's senior migrant communities (e.g.\ Mandarin, Greek, Italian, Vietnamese).
  \item \textbf{Telehealth integration} --- Provide an export mechanism so GP software or
        community health platforms can ingest anonymised activity data with user consent.
\end{itemize}

% ──────────────────────────────────────────────────────────────────────────────
\section{Recommended Future Improvements}

The following items are not currently implemented but are recommended for a
production-grade deployment:

\begin{longtable}{L{1.5cm} L{5.5cm} L{6.5cm}}
  \toprule
  \textbf{Priority} & \textbf{Item} & \textbf{Rationale} \\
  \midrule
  \endhead
  High   & Add HTTPS-only cookies / session management if login is added
         & Required for any feature that stores user-specific data server-side \\
  Medium & Add rate limiting to backend API endpoints
         & Prevents abuse of ORS quota and DB connections \\
Medium & Add a CI/CD pipeline with automated tests
         & Catch regressions before deployment \\
  Medium & Move Eventbrite cache to a persistent store (Redis)
         & In-memory cache is lost on every cold start, causing unnecessary Eventbrite API calls \\
  \bottomrule
\end{longtable}

% ──────────────────────────────────────────────────────────────────────────────
\vspace{2cm}
\hrule
\vspace{0.4cm}
{\small\itshape This document should be reviewed and updated whenever a significant change
is made to the application's architecture, dependencies, or data handling practices.}

\end{document}
