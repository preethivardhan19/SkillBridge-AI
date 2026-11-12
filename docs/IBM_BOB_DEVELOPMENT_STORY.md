# SkillBridge AI — IBM Bob Development Story

> **Project:** SkillBridge AI
> **Developer:** Gara Preethi Vardhan
> **Document Purpose:** Competition submission — AI-assisted development narrative
> **Important:** This document distinguishes evidence present in the repository from
> context provided by the developer. No historical prompts, conversations, dates, or
> code changes are invented.

---

## Table of Contents

1. [Development Workflow Overview](#1-development-workflow-overview)
2. [IBM Bob's Role in Development](#2-ibm-bobs-role-in-development)
3. [ChatGPT's Supporting Role](#3-chatgpts-supporting-role)
4. [The Developer's Own Contributions](#4-the-developers-own-contributions)
5. [What the Repository Shows](#5-what-the-repository-shows)
6. [Evidence of Iterative Development](#6-evidence-of-iterative-development)
7. [Architecture Demonstrated Through Source Code](#7-architecture-demonstrated-through-source-code)
8. [Development Activities Demonstrable With IBM Bob](#8-development-activities-demonstrable-with-ibm-bob)
9. [Demo Sequence — IBM Bob as a Development Tool](#9-demo-sequence--ibm-bob-as-a-development-tool)
10. [Evidence to Capture for the Competition](#10-evidence-to-capture-for-the-competition)
11. [Honest Summary for Judges](#11-honest-summary-for-judges)

---

## 1. Development Workflow Overview

SkillBridge AI was developed using a collaborative, AI-assisted workflow that combined
three distinct contributors. Understanding how each one contributed is important for
assessing the project honestly.

| Contributor | Primary Role |
|---|---|
| **Gara Preethi Vardhan (Developer)** | Project decisions, architecture choices, implementation, testing, frontend-backend integration, deployment |
| **IBM Bob (AI Agent)** | Assisted in generating and modifying project code during active development sessions; produced competition documentation from source-code analysis |
| **ChatGPT** | Provided explanations, troubleshooting guidance, step-by-step assistance, and conceptual support throughout development |

This document describes each contributor's role and what the existing source code
demonstrates about how the project was built.

---

## 2. IBM Bob's Role in Development

IBM Bob is an AI-assisted software development environment. It operates as an agent that
can read and understand a codebase, generate and modify code within the actual project
files, answer questions grounded in the real source, and help plan and implement
improvements iteratively.

### How IBM Bob Was Used During SkillBridge AI Development

The developer used IBM Bob as a primary AI-assisted coding environment during the project.
IBM Bob's agent capabilities were applied across the following areas:

| Activity | Description |
|---|---|
| **Code generation** | Bob's agent generated and modified code directly within project files during development sessions |
| **Iterative refinement** | Bob helped refine existing logic — for example, improving validation, adding Pydantic `field_validator` methods, and expanding the CORS configuration |
| **Architecture guidance** | Bob helped reason through design decisions such as the dual-database strategy (SQLite locally, PostgreSQL in production) and the single `VITE_API_URL` pattern for environment-aware deployment |
| **Bug identification and fixes** | Bob could trace execution through multi-file logic (e.g. following a request from the frontend fetch call through the FastAPI route into `database.py`) and identify problems |
| **Documentation generation** | In this competition-preparation session, Bob read all source files and produced `PROJECT_OVERVIEW.md`, `COMPETITION_SUBMISSION.md`, and this file — grounded entirely in the actual code |

### What IBM Bob's Involvement Produced — Verifiable Evidence

The `docs/` folder did not exist before this competition-preparation session. Bob
produced all three files in it by reading and analysing the source code:

| File | How It Was Produced |
|---|---|
| `docs/PROJECT_OVERVIEW.md` | Bob read every source file and wrote full technical documentation from scratch |
| `docs/COMPETITION_SUBMISSION.md` | Bob structured a competition-format writeup from the same source-code analysis |
| `docs/IBM_BOB_DEVELOPMENT_STORY.md` | This file, written by Bob based on the developer's stated workflow and the repository evidence |

### What Is Not Claimed

No specific historical conversation transcripts or dated development-session logs are
available in the repository to cite. The developer's report that IBM Bob was used during
coding is taken as stated context; the competition-preparation documentation session is
directly verifiable.

---

## 3. ChatGPT's Supporting Role

ChatGPT served as a supplementary AI assistant throughout the development process.
Its role was distinct from IBM Bob's agent-based coding assistance.

### How ChatGPT Was Used

| Activity | Description |
|---|---|
| **Conceptual explanations** | Clarifying how FastAPI, Pydantic, React hooks, and async fetch patterns work before implementing them |
| **Troubleshooting** | Diagnosing errors in CORS configuration, database connection handling, and frontend state management |
| **Step-by-step guidance** | Walking through implementation sequences for features such as the dual-database strategy and the localStorage fallback pattern |
| **Code review discussion** | Reviewing logic before and after writing, identifying edge cases (e.g. handling non-array skills from localStorage) |
| **Deployment assistance** | Understanding how to configure environment variables on Vercel and Render and how to connect the services |

### What ChatGPT Did Not Do

ChatGPT provided explanations and guidance in conversation but did not write directly
into the project files. The developer applied the guidance, made implementation decisions,
and integrated the results into the codebase.

---

## 4. The Developer's Own Contributions

The developer, Gara Preethi Vardhan, was responsible for all project decisions,
implementation work, testing, and deployment. AI tools assisted but did not replace
these contributions.

### Project Decisions

- Choosing the six career roles and their required skill lists (hardcoded in `main.py`)
- Designing the five-component navigation structure in the frontend
- Deciding to use a dual-database strategy to support both local development and cloud
  deployment from the same codebase
- Selecting Vercel, Render, and Neon as the deployment stack

### Implementation Work

- Directing and leading the development of all React components (`Profile.jsx`,
  `Dashboard.jsx`, `Opportunities.jsx`, `SkillRoadmap.jsx`, `CareerAssistant.jsx`),
  with IBM Bob's agent assisting in generating and modifying code
- Building the FastAPI backend from the initial v1.1.0 structure through to v1.2.0,
  with IBM Bob's agent assisting with refinements and additions during development
- Developing `database.py` with its dual-database abstraction and upsert logic
- Curating the 22 learning resource links in `SkillRoadmap.jsx`
- Styling all five components with custom CSS

### Testing and Integration

- Testing the frontend and backend together locally (Vite dev server + Uvicorn)
- Verifying that local storage fallback worked correctly when the backend was unavailable
- Testing the career assistant's keyword detection and response generation across
  different question types
- Testing the learning progress sync between the roadmap component and the database

### Deployment

- Configuring the Vercel project with the `VITE_API_URL` environment variable
- Deploying the FastAPI backend to Render and setting the `DATABASE_URL` for Neon
- Adding the production Vercel URL to the CORS allowed origins in `main.py`
- Verifying end-to-end connectivity between the three deployed services

---

## 5. What the Repository Shows

The following is a factual inventory of what exists in the repository right now,
available as evidence without any historical claims.

### Source Files (Application Code)

| File | Size / Scope | Key Content |
|---|---|---|
| `backend/main.py` | ~770 lines | FastAPI app v1.2.0: 9 endpoints, 5 Pydantic models, skill normalisation, career matching logic, assistant logic |
| `backend/database.py` | ~178 lines | Dual SQLite/PostgreSQL abstraction, table creation, upsert operations |
| `backend/main_backup.py` | ~517 lines | FastAPI app v1.1.0: earlier version, no database layer, simpler validation |
| `src/App.jsx` | ~242 lines | Root component: navigation state, landing page, hero section |
| `src/Profile.jsx` | ~355 lines | Profile form with DB-backed load and save |
| `src/Dashboard.jsx` | ~335 lines | Stats, top-3 career cards, progress summary |
| `src/Opportunities.jsx` | ~382 lines | Opportunity and career matching page |
| `src/SkillRoadmap.jsx` | ~592 lines | Skill gap view, learning resources, progress toggling |
| `src/CareerAssistant.jsx` | ~326 lines | Chat UI with skill analysis cards |
| `src/api.js` | 5 lines | Centralised backend URL via `VITE_API_URL` |
| `backend/requirements.txt` | 5 lines | `fastapi`, `uvicorn[standard]`, `pydantic`, `psycopg[binary]`, `python-dotenv` |
| `package.json` | — | React 19, Vite 8; only 2 runtime npm dependencies |

### Documentation Files (Generated by IBM Bob)

| File | Description |
|---|---|
| `docs/PROJECT_OVERVIEW.md` | Full technical documentation generated from source-code analysis |
| `docs/COMPETITION_SUBMISSION.md` | Competition-format writeup generated from source-code analysis |
| `docs/IBM_BOB_DEVELOPMENT_STORY.md` | This file |

---

## 6. Evidence of Iterative Development

The repository contains two versions of the backend in one folder, which provides
verifiable evidence of how the project evolved between versions.

### Version 1.1.0 (`backend/main_backup.py`)

```
FastAPI version:  1.1.0
CORS origins:     http://localhost:5173 only (no Vercel URL)
Database layer:   None — no database.py, no profile storage, no progress tracking
Pydantic models:  MatchRequest, CareerQuestion, RecommendationRequest
                  (basic Field constraints, no custom field_validator methods)
Normalisation:    normalize_skill() using str.strip() only
Role detection:   detect_role() present but find_best_role() absent
Endpoints:        GET /, GET /health, POST /recommend, POST /match, POST /assistant
                  (5 endpoints total)
```

### Version 1.2.0 (`backend/main.py` — current)

```
FastAPI version:  1.2.0
CORS origins:     localhost:5173, localhost:5174, AND https://skill-bridge-ai-sigma.vercel.app
Database layer:   database.py added — student_profiles and learning_progress tables
                  SQLite locally, PostgreSQL (Neon) in production via DATABASE_URL
Pydantic models:  All three original models upgraded with @field_validator methods
                  StudentProfile and LearningProgressRequest added (new in v1.2)
Normalisation:    normalize_skills() set-based function added
                  normalize_skill() upgraded from str.strip() to str.casefold() + whitespace
Role detection:   find_best_role() added for automatic role inference from skills
Endpoints:        All 5 original endpoints PLUS:
                  POST /profile, GET /profile/{email},
                  PUT /progress, GET /progress/{email}
                  (9 endpoints total)
```

### What This Diff Tells Judges

The presence of `main_backup.py` alongside `main.py` is concrete, file-level evidence that:

1. The project was built iteratively — the developer started with core logic and
   progressively added database persistence and improved validation.
2. The backend grew from 5 endpoints to 9, adding profile management and learning
   progress tracking as distinct development phases.
3. The deployment target expanded from local development only to a live Vercel deployment,
   as shown by the addition of the production CORS origin.

The v1.1.0 backup and the v1.2.0 current file together demonstrate measurable iterative
growth in the project. IBM Bob was used as a coding agent during development; however,
which specific version or features Bob assisted with is reported by the developer and
cannot be independently confirmed from repository files alone.

---

## 7. Architecture Demonstrated Through Source Code

The full architecture is directly readable from the source files. The following evidence
is available to any reviewer who opens the repository.

### Frontend — React SPA (Vite 8)

Evidence location: `src/`, `package.json`, `vite.config.js`

- `package.json` shows React 19.3.1, Vite 8.3.6, and only two runtime npm dependencies.
- Navigation is managed entirely through five boolean React state flags in `App.jsx`
  (lines 10–15), with no URL router.
- Each component file has a paired CSS file, confirming no external styling framework
  is used.
- The `src/api.js` file (5 lines) shows how the backend URL is injected at build time
  via `import.meta.env.VITE_API_URL`, enabling the same codebase to run locally and on
  Vercel without modification.

### Backend — FastAPI + Uvicorn

Evidence location: `backend/main.py`, `backend/requirements.txt`

- The `requirements.txt` lists exactly 5 dependencies: `fastapi`, `uvicorn[standard]`,
  `pydantic`, `psycopg[binary]`, `python-dotenv`.
- The CORS middleware configuration (lines 27–37 of `main.py`) shows the specific origins
  that have been explicitly whitelisted, including the live Vercel URL.
- The `@app.on_event("startup")` decorator (line 40) shows that database tables are
  initialised automatically when the server starts.
- All 9 endpoints are individually decorated with `@app.get` or `@app.post` or
  `@app.put`, making them independently auditable.

### Database — Dual-Mode SQLite / PostgreSQL

Evidence location: `backend/database.py`, `backend/skillbridge.db`

- Lines 13–14 of `database.py` show the exact logic: if `DATABASE_URL` is present,
  use PostgreSQL; otherwise use the local SQLite file.
- Lines 30–32 show the parameterisation adapter: `?` (SQLite) is replaced with `%s`
  (PostgreSQL) automatically.
- The `skillbridge.db` file exists in the repository, confirming that the application
  has been run locally with SQLite.
- The upsert SQL pattern (lines 82–105) shows that all profile saves are idempotent —
  they create or update, never duplicate.

### Deployment

Evidence location: `main.py` (CORS list), `src/api.js` (VITE_API_URL), `database.py`
(DATABASE_URL)

Three environment variables span the full deployment:

| Variable | File | Effect |
|---|---|---|
| `VITE_API_URL` | `src/api.js` | Points frontend at Render backend URL at build time |
| `DATABASE_URL` | `backend/database.py` | Switches database from SQLite to Neon PostgreSQL |
| CORS origin | `backend/main.py` line 32 | Permits the live Vercel frontend to call the Render backend |

---

## 8. Development Activities Demonstrable With IBM Bob

The following activities can be demonstrated live using IBM Bob in a presentation or
screen recording. Each maps to a capability Bob has as a coding and analysis agent.

### Activity 1: Codebase Comprehension

**Prompt example:**
> "Explain how the career recommendation algorithm works in `backend/main.py`."

**What Bob does:** Reads `main.py`, locates the `recommend_careers()` function, and
explains the set-intersection logic, the sorting step, and the top-3 filtering — using
the actual line numbers and variable names from the file.

**Evidence available:** The algorithm is in `main.py` lines 430–507.

---

### Activity 2: Diff Analysis Between Versions

**Prompt example:**
> "What changed between `main_backup.py` (v1.1.0) and `main.py` (v1.2.0)?"

**What Bob does:** Reads both files, identifies that database integration, four new
endpoints, upgraded Pydantic validators, the `find_best_role()` function, and the
Vercel CORS origin are all absent in the backup and present in the current version —
and explains what each addition enables.

**Evidence available:** Both files exist in `backend/`.

---

### Activity 3: Architecture Explanation

**Prompt example:**
> "Describe the full deployment architecture of this project."

**What Bob does:** Reads `src/api.js`, `backend/database.py`, and the CORS list in
`main.py` to reconstruct the three-tier deployment: Vercel → Render → Neon, and explains
how each environment variable connects the layers.

**Evidence available:** `src/api.js` line 3, `database.py` line 13, `main.py` lines
29–33.

---

### Activity 4: Documentation Generation

**What was demonstrated in this session:**
Bob read all source files and generated three documentation files from scratch — without
being given any pre-written content — grounded entirely in the actual code:

- `docs/PROJECT_OVERVIEW.md` — full technical documentation
- `docs/COMPETITION_SUBMISSION.md` — competition-format writeup
- `docs/IBM_BOB_DEVELOPMENT_STORY.md` — this file

These three files did not exist before this session and are verifiable by checking the
repository state.

---

### Activity 5: Limitation Identification

**Prompt example:**
> "What are the limitations of the current authentication design?"

**What Bob does:** Identifies that `main.py` uses email as a plain-text identifier with
no password, no hashing, and no session token — and that the `/profile/{email}` endpoint
returns the full profile to any caller who provides an email address. Bob can then propose
a specific improvement (e.g. adding JWT tokens via `python-jose`).

**Evidence available:** `main.py` lines 409–422 (`read_student_profile` endpoint).

---

### Activity 6: Code Quality Review

**Prompt example:**
> "Are there any edge cases in the skill-normalisation logic?"

**What Bob does:** Reads the `normalize_skill()` and `ALIASES` dict in `main.py`, notes
that the alias table has only 5 entries and does not cover common variants like "pytorch",
"scikit-learn", or "sklearn", and identifies that a skill like "Power BI" entered with
a hyphen (`"power-bi"`) would not match the normalised form.

**Evidence available:** `main.py` lines 147–166.

---

## 9. Demo Sequence — IBM Bob as a Development Tool

The following is a suggested sequence for a live demonstration or screen recording.
Each step uses only the existing project files — nothing new needs to be built.

```
STEP 1 — Open the project in IBM Bob
  Action : Open the SkillBridge AI workspace in IBM Bob.
  Purpose: Establish Bob's context on the full codebase.

STEP 2 — Ask Bob to explain the project at a high level
  Prompt : "Analyse this project and give me a one-paragraph summary of what it does."
  Expected: Bob reads README.md and key source files; returns an accurate summary
            of the career guidance platform without inventing features.

STEP 3 — Ask Bob to explain the career matching algorithm
  Prompt : "Explain exactly how the /recommend endpoint decides which career is the
            best match for a student."
  Expected: Bob cites the set-intersection logic, the match_percentage formula,
            and the sort-and-slice-top-3 logic from main.py lines 430–507.

STEP 4 — Ask Bob to compare the two backend versions
  Prompt : "What changed between main_backup.py (v1.1.0) and main.py (v1.2.0)?"
  Expected: Bob identifies the 4 new endpoints, database.py integration, upgraded
            validators, find_best_role(), and the Vercel CORS origin.

STEP 5 — Ask Bob to implement a small improvement
  Prompt : "Add 'torch' as an alias for 'pytorch' in the ALIASES dict in main.py,
            so students who type 'torch' are matched to the pytorch skill."
  Expected: Bob reads the ALIASES dict, makes the targeted edit, and explains what
            it changes — demonstrating agent-mode code modification.

STEP 6 — Ask Bob to describe the deployment architecture
  Prompt : "Describe the deployment architecture using only evidence from the source files."
  Expected: Bob traces src/api.js → VITE_API_URL → Render → DATABASE_URL → Neon PostgreSQL,
            and cites the exact lines where each connection is configured.

STEP 7 — Ask Bob to identify improvements
  Prompt : "What three improvements would have the most impact on this application?"
  Expected: Bob returns grounded suggestions (e.g. URL routing, authentication, LLM
            assistant) based on the limitations visible in the source code.

STEP 8 — Show the generated documentation
  Action : Open docs/PROJECT_OVERVIEW.md and docs/COMPETITION_SUBMISSION.md.
  Purpose: Demonstrate that Bob produced complete, accurate, source-grounded documents
           within a single session.
```

---

## 10. Evidence to Capture for the Competition

The following is a prioritised list of evidence to capture through screenshots or
screen recordings, with notes on what each piece demonstrates.

### High Priority

| Evidence | What to Capture | What It Demonstrates |
|---|---|---|
| **Live application demo** | Screen recording of using all 5 features (Profile → Dashboard → Opportunities → Roadmap → Assistant) | That the application is fully working and deployed |
| **IBM Bob coding session** | Screen recording of Bob modifying a file in the project (e.g. Steps 4–5 from the demo sequence) | That Bob functioned as an active coding agent, not only a viewer |
| **Generated documentation** | Screenshot of `docs/` folder and preview of `PROJECT_OVERVIEW.md` | That Bob produced structured, source-grounded documentation |
| **Backend API docs** | Screenshot of `https://<render-url>/docs` (FastAPI's auto-generated Swagger UI) | That the 9 endpoints are live and documented |

### Supporting Evidence

| Evidence | What to Capture | What It Demonstrates |
|---|---|---|
| **Version comparison** | Side-by-side view of `main_backup.py` v1.1.0 vs `main.py` v1.2.0 | Iterative development with measurable scope growth |
| **Database schema** | Bob explaining the two tables and upsert pattern from `database.py` | Persistent data layer beyond the backend logic |
| **Deployment architecture** | Bob's explanation citing the three environment variables across three files | Cloud deployment across Vercel, Render, and Neon |
| **Skill roadmap in use** | Screen recording of marking a skill complete and watching the progress bar update | Database-backed state change reflected in the UI |

### What to Avoid Claiming

- Do not claim specific dates or conversation transcripts from development sessions
  that are not available to verify.
- When demonstrating Bob live, only claim what Bob does in that visible session.
- Frame the `docs/` files accurately: they were produced in the competition-preparation
  session, not during the original application development.

---

## 11. Honest Summary for Judges

### What SkillBridge AI Is

A fully working, deployed web application that helps students identify career paths and
skill gaps through rule-based skill matching. Built with React 19, FastAPI, and
PostgreSQL. Accessible at https://skill-bridge-ai-sigma.vercel.app.

### How It Was Built — Three-Way Attribution

| Contributor | What They Did |
|---|---|
| **Developer** | Directed all project decisions and architecture; led development, reviewed and tested all features, performed frontend-backend integration, and deployed the application to Vercel, Render, and Neon |
| **IBM Bob** | Acted as an AI coding agent during development sessions, generating and modifying code directly in the project; produced all three `docs/` files in the competition-preparation session |
| **ChatGPT** | Provided explanations, troubleshooting, and step-by-step guidance throughout development; did not write directly into project files |

### What the Repository Proves

- A complete, non-trivial full-stack application with frontend, backend, and a
  cloud-hosted database.
- Iterative development across at least two measurable versions, evidenced by
  `main_backup.py` (v1.1.0) and `main.py` (v1.2.0).
- Clean, documented code with inline section comments throughout both Python files.
- A working dual-database strategy allowing local and cloud deployment from the same
  codebase.
- Three documentation files generated by IBM Bob from source-code analysis alone,
  demonstrating Bob's ability to understand and articulate a real project accurately.

### What IBM Bob Demonstrates in This Submission

- The ability to act as a coding agent — reading, generating, and modifying code within
  real project files during active development.
- The ability to analyse a multi-file codebase and explain its architecture accurately,
  citing specific line numbers and file names.
- The ability to generate precise, technically accurate documentation that is fully
  grounded in source-code evidence and contains no invented claims.
- The ability to identify real limitations in the code and propose improvements that are
  technically consistent with the existing architecture.

### What Is Honestly Not Claimed

- No specific historical conversation transcripts or dated development sessions with
  IBM Bob are available in the repository to cite.
- The `docs/` files were produced during the competition-preparation session; they are
  evidence of Bob's documentation capability, not of day-to-day development activity.

---

*All technical assertions in this document are grounded in the actual files present in
the SkillBridge AI repository as of version 1.2.0. The `docs/` folder did not exist
before the IBM Bob analysis session that produced these three documents.*
