# SkillBridge AI — Project Overview

> **Version:** 1.2.0  
> **Developer:** Gara Preethi Vardhan  
> **Programme:** B.Tech Computer Science and Engineering, 2026  
> **GitHub:** https://github.com/preethivardhan19/SkillBridge-AI  
> **Live URL:** https://skill-bridge-ai-sigma.vercel.app

---

## Table of Contents

1. [Project Introduction and Problem Statement](#1-project-introduction-and-problem-statement)
2. [Target Users](#2-target-users)
3. [Key Features](#3-key-features)
4. [Frontend Architecture](#4-frontend-architecture)
5. [Backend Architecture](#5-backend-architecture)
6. [Database Design](#6-database-design)
7. [Career Matching Methodology](#7-career-matching-methodology)
8. [Technology Stack](#8-technology-stack)
9. [Deployment Architecture](#9-deployment-architecture)
10. [Limitations and Future Improvements](#10-limitations-and-future-improvements)

---

## 1. Project Introduction and Problem Statement

### Introduction

SkillBridge AI is a career guidance and skill development platform built for students and
fresh graduates. It helps users understand which technical careers their current skills
align with, identify exactly which skills they are missing, discover sample opportunities,
and follow a structured learning roadmap with curated resources.

The platform combines a React frontend with a Python FastAPI backend. All career
recommendations, skill-gap analysis, and assistant responses are produced by
**rule-based logic** — deterministic algorithms that compare the student's skills against
fixed career skill requirements using set intersection. No machine learning model or
generative AI service is used in the current version.

### Problem Statement

Students and fresh graduates face three common challenges when planning their careers:

1. **Lack of self-awareness** — They do not know which careers are a realistic match for
   their current skills.
2. **Unclear skill gaps** — They know they are "missing something" but cannot identify
   exactly what.
3. **Disorganised learning** — They find resources online but have no structured roadmap
   to follow and no way to track their own progress.

Career counselling services can be expensive or inaccessible. Generic career advice does
not account for an individual's actual skill set. SkillBridge AI addresses all three
challenges in a single, free, and personalised web application.

---

## 2. Target Users

| User Group | How They Benefit |
|---|---|
| Final-year engineering students | Understand career readiness before campus placements |
| Fresh graduates | Identify skill gaps and plan upskilling before job applications |
| Career changers | See how their existing skills map to new technical roles |
| Self-taught developers | Get a structured roadmap for a specific career path |

The application is designed to require no prior career knowledge. A user only needs to
enter their name, email, and a comma-separated list of technical skills to get started.

---

## 3. Key Features

### 3.1 Student Profile

- Create and update a personal profile with name, email, education, graduation year,
  technical skills, preferred career role, and preferred work location.
- Profile is saved to the backend database and retrieved on subsequent visits.
- Profile data is also cached in browser local storage for instant loading.

### 3.2 Career Dashboard

- Personalised overview of career readiness based on saved profile skills.
- Displays the top 3 recommended career paths with match percentages and progress bars.
- Shows completed learning skills retrieved from the database.
- Summary statistics: number of skills in profile, careers analysed, and average skill
  coverage across recommendations.
- Quick navigation buttons to all other platform features.

### 3.3 Opportunity Matching

- Enter skills and a preferred career role to see how well your skills match a set of
  sample opportunities.
- Each opportunity card shows the match percentage, matched skills, and skills to develop.
- Opportunities are sorted by role relevance first, then by skill match percentage.
- Career path recommendations (ranked across all 6 roles) are shown alongside opportunity
  results on the same page.

### 3.4 Skill Roadmap and Learning Progress

- Select a career role to see its full list of required skills.
- Skills are divided into those you already have (matched) and those you still need
  (missing).
- Each missing skill links to a curated, free learning resource (22 resources in total,
  one per skill).
- Mark any skill as "completed" to track your learning progress. Completed skills are
  saved to the backend database and synced across devices.
- A progress bar shows what percentage of a role's required skills you have covered
  (combining your existing skills and your marked learning completions).
- If the backend is unavailable, completed skills fall back to browser local storage.

### 3.5 Career Assistant

- A chat-style interface where students can ask career-related questions in plain English.
- The assistant uses **rule-based keyword detection** to identify the topic of the
  question and the relevant career role, then returns a personalised, templated response
  that includes the student's actual match percentage and missing skills.
- Supported question topics: career matching, skill gap analysis, skills to learn,
  learning roadmap, interview preparation, and resume writing.
- Chat history is persisted in browser local storage and restored on return visits.
- Suggested questions are shown when the chat is empty to help users get started.
- A retry button appears on failed requests so users do not have to retype their question.

---

## 4. Frontend Architecture

### Overview

The frontend is a **single-page application (SPA)** built with React 19 and bundled by
Vite 8. It communicates with the backend exclusively through HTTP requests using the
browser's built-in Fetch API.

### Navigation Model

There is no URL router in the current version. Navigation is managed by five boolean
state flags inside `src/App.jsx`:

```
showDashboard | showProfile | showMatches | showRoadmap | showAssistant
```

When a flag is `true`, its corresponding full-screen component is rendered. When all
flags are `false`, the landing page (hero section and feature cards) is shown. The
`onBack` prop on each component resets its flag to `false`, returning the user to the
landing page.

### Component Responsibilities

| File | Purpose | API Calls Made |
|---|---|---|
| `src/App.jsx` | Landing page, navigation state, hero section, feature cards | None |
| `src/Profile.jsx` | Profile creation and editing form | `GET /profile/{email}`, `POST /profile` |
| `src/Dashboard.jsx` | Career overview, recommendations, progress summary | `POST /recommend`, `GET /progress/{email}` |
| `src/Opportunities.jsx` | Skill-based opportunity and career discovery | `POST /match`, `POST /recommend` (parallel) |
| `src/SkillRoadmap.jsx` | Per-role skill gap display, learning resources, progress tracking | `GET /progress/{email}`, `PUT /progress` |
| `src/CareerAssistant.jsx` | Chat-based career Q&A interface | `POST /assistant` |
| `src/api.js` | Single source for the backend base URL | — |

### API Base URL Configuration

The backend URL is centralised in `src/api.js`:

```javascript
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
```

- In **local development**: the URL defaults to `http://127.0.0.1:8000`.
- In **production**: the `VITE_API_URL` environment variable is set in the Vercel
  dashboard to the Render backend URL. Vite replaces this value at build time.

### Local Storage Keys

| Key | Contents |
|---|---|
| `skillbridge-profile` | Serialised student profile object (cache + offline fallback) |
| `skillbridge-completed-skills` | JSON array of completed skill names (offline fallback) |
| `skillbridge-chat-history` | JSON array of chat messages (chat persistence) |

### Styling

Each component has a dedicated CSS file (e.g. `Dashboard.css`, `Profile.css`). No
external UI component library or CSS framework is used.

---

## 5. Backend Architecture

### Overview

The backend is a **Python FastAPI** application (`backend/main.py`, version 1.2.0) served
by the Uvicorn ASGI server. It exposes a REST API consumed by the React frontend.

### Application Startup

On startup, FastAPI calls `initialize_database()` from `backend/database.py`, which
creates the `student_profiles` and `learning_progress` tables if they do not already
exist.

### CORS Configuration

Cross-Origin Resource Sharing is explicitly configured to allow requests from:

```
http://localhost:5173          (Vite dev server, default port)
http://localhost:5174          (Vite dev server, alternate port)
https://skill-bridge-ai-sigma.vercel.app   (production frontend)
```

### API Endpoints

| Method | Endpoint | Purpose | Request Body |
|---|---|---|---|
| GET | `/` | Home — returns version info | — |
| GET | `/health` | Health check | — |
| POST | `/profile` | Create or update a student profile (upsert by email) | `StudentProfile` |
| GET | `/profile/{email}` | Retrieve a student profile by email | — |
| POST | `/recommend` | Generate ranked career recommendations | `skills[]` |
| POST | `/match` | Match student skills against sample opportunities | `skills[]`, `preferred_role` |
| POST | `/assistant` | Return a rule-based career assistant response | `question`, `skills[]`, `preferred_role` |
| PUT | `/progress` | Mark a skill as completed or not completed | `email`, `skill_name`, `completed` |
| GET | `/progress/{email}` | Retrieve all completed skill names for a student | — |

### Input Validation

All POST and PUT request bodies are validated using **Pydantic v2** models with
field-level validators:

- Maximum of 50 skills per request.
- Each skill name must be 60 characters or fewer.
- Skills with only whitespace are silently dropped.
- `preferred_role` defaults to `"Any"` if blank or whitespace-only.
- The `question` field for the assistant cannot be empty.

### Skill Normalisation

Before any comparison, all skills are normalised:

1. Whitespace is collapsed (multiple spaces become one).
2. The string is lowercased using Python's `str.casefold()` for Unicode safety.
3. An alias table maps common shorthand inputs to their canonical form:

| Input | Canonical Form |
|---|---|
| `ml` | `machine learning` |
| `py` | `python` |
| `js` | `javascript` |
| `powerbi` | `power bi` |
| `rest apis` | `rest api` |

---

## 6. Database Design

### Dual-Database Strategy

The application supports two databases controlled by a single environment variable:

```
DATABASE_URL set     →  PostgreSQL  (via psycopg3, used in production on Neon)
DATABASE_URL not set →  SQLite      (local file: backend/skillbridge.db)
```

The `database.py` module handles this transparently. It also adapts the SQL parameter
placeholder: `?` for SQLite and `%s` for PostgreSQL.

### Table: `student_profiles`

Stores one row per student. Email is the unique key; saving always performs an upsert.

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER / BIGSERIAL | Auto-increment primary key |
| `name` | TEXT NOT NULL | |
| `email` | TEXT NOT NULL UNIQUE | Stored lowercase; used as the lookup key |
| `education` | TEXT | e.g. "B.Tech Computer Science" |
| `graduation` | TEXT | Year as a string, e.g. "2026" |
| `skills` | TEXT | JSON array serialised as a string, e.g. `["python","sql"]` |
| `preferred_role` | TEXT | Defaults to `"Any"` |
| `location` | TEXT | e.g. "Hyderabad", "Remote" |
| `updated_at` | TIMESTAMP | Set on every insert or update |

### Table: `learning_progress`

Stores one row per (student, skill) pair. Toggling a skill always performs an upsert.

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER / BIGSERIAL | Auto-increment primary key |
| `student_email` | TEXT NOT NULL | References `student_profiles.email` by convention |
| `skill_name` | TEXT NOT NULL | Exact skill name as shown in the roadmap |
| `completed` | INTEGER (0 or 1) | Boolean stored as an integer for SQLite compatibility |
| `updated_at` | TIMESTAMP | Set on every insert or update |

A `UNIQUE(student_email, skill_name)` constraint prevents duplicate rows.

### Upsert Pattern

Both tables use SQL's `ON CONFLICT … DO UPDATE` syntax:

```sql
INSERT INTO student_profiles (name, email, ...)
VALUES (?, ?, ...)
ON CONFLICT(email) DO UPDATE SET
    name = excluded.name,
    ...
    updated_at = CURRENT_TIMESTAMP
```

This means a student can save their profile multiple times without creating duplicates.

---

## 7. Career Matching Methodology

> **Important:** All matching in the current version is **rule-based set comparison**.
> There is no machine learning model, neural network, or generative AI involved. The
> assistant comment in `main.py` itself states: *"Rule-based version — generative AI
> integration will be added in a later development phase."*

### Career Skill Requirements (hardcoded in `main.py`)

| Career Role | Required Skills |
|---|---|
| Data Analyst | python, sql, excel, power bi, statistics |
| Data Scientist | python, sql, statistics, machine learning, pandas, numpy |
| AI/ML Engineer | python, machine learning, deep learning, nlp, tensorflow, fastapi |
| Software Developer | python, java, sql, git, rest api, data structures |
| Cloud Engineer | python, linux, aws, networking, docker, sql |
| Product Manager | communication, sql, excel, problem solving, product strategy |

### POST /recommend — Career Recommendation Algorithm

```
For each of the 6 career roles:
    matched_skills  = student_skills ∩ role_skills
    missing_skills  = role_skills − student_skills
    match_percentage = len(matched_skills) / len(role_skills) × 100  (rounded)

Sort all roles by match_percentage descending.
Return the top 3 results.
```

Each result also includes a plain-English explanation generated from the counts, for
example: *"You match 3 out of 5 listed skills for Data Analyst. Learning power bi,
statistics could improve your skill coverage."*

### POST /match — Opportunity Matching Algorithm

```
For each of the 5 sample opportunities:
    matched_skills   = student_skills ∩ opportunity_skills
    missing_skills   = opportunity_skills − student_skills
    match_percentage = len(matched_skills) / len(opportunity_skills) × 100
    role_match       = True if opportunity.role == preferred_role (or preferred_role == "Any")

Sort by (role_match DESC, match_percentage DESC).
```

Role-relevant opportunities always appear before non-relevant ones, even if the skill
match is lower. This ensures students see the most applicable results first.

### POST /assistant — Rule-Based Career Assistant

The assistant follows a four-step process:

1. **Role detection** — Scan the question text for role keywords (e.g. "data scientist",
   "cloud engineer", "machine learning"). If found, use that role.
2. **Fallback** — If no role keyword is found, use the student's `preferred_role`.
   If that is `"Any"`, call `find_best_role()`, which picks the role with the highest
   skill intersection count from the student's profile skills.
3. **Topic detection** — Match the question against keyword groups:
   - `career match` / `suitable career` / `match my skills`
   - `missing` / `skill gap` / `gap analysis`
   - `which skills` / `what skills` / `learn next` / `skills should`
   - `roadmap` / `learning plan` / `how to become` / `become a`
   - `interview`
   - `resume`
4. **Response generation** — Return the template for the matched topic, with the
   student's actual match percentage, matched skills, and missing skills injected.
   If no topic matches, return a generic fallback.

### Skill Readiness Calculation (Skill Roadmap)

The Skill Roadmap component performs its own client-side calculation:

```
matched         = required_skills where skill is in student_skills
missing         = required_skills where skill is not in student_skills
completedCount  = skills that are in student_skills OR in completedSkills (from DB)
learningProgress = completedCount / len(required_skills) × 100
```

The `learningProgress` percentage is higher than the raw `skillMatchPercentage` because
it counts skills the student has explicitly marked as completed in the roadmap.

---

## 8. Technology Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | ^19.3.1 | UI framework |
| React DOM | ^19.3.1 | React renderer for the browser |
| Vite | ^8.3.6 | Development server and build tool |
| @vitejs/plugin-react | ^6.1.2 | React Fast Refresh support in Vite |
| ESLint | ^10.14.0 | Code linting |
| Plain CSS | — | Component styling (one file per component) |

The frontend has **no runtime dependencies beyond React**. No state management library,
no CSS framework, and no UI component library are used.

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Python | 3.x | Backend language |
| FastAPI | 0.162.5 | Web framework and automatic API docs |
| Uvicorn (standard) | 0.54.0 | ASGI server |
| Pydantic v2 | 2.14.3 | Request body validation |
| psycopg (binary) | 3.3.8 | PostgreSQL driver (psycopg3) |
| python-dotenv | 1.2.4 | Load environment variables from a `.env` file |
| sqlite3 | built-in | Local development database |

---

## 9. Deployment Architecture

The live application is deployed across three free-tier cloud services.

```
User's Browser
      │
      ▼
  VERCEL                        ← Hosts the compiled React static files
  skill-bridge-ai-sigma.vercel.app
      │  (HTTPS API requests to VITE_API_URL)
      ▼
  RENDER                        ← Runs the FastAPI + Uvicorn Python server
  (Python web service)
      │  (DATABASE_URL connection string)
      ▼
  NEON POSTGRESQL               ← Serverless PostgreSQL database
  (student_profiles + learning_progress tables)
```

### Service Responsibilities

| Service | Role | Configuration |
|---|---|---|
| **Vercel** | Hosts the compiled React SPA (static HTML + JS + CSS) | `VITE_API_URL` env var set to the Render backend URL; Vite replaces it at build time |
| **Render** | Runs the FastAPI backend as a Python web service | `DATABASE_URL` env var set to the Neon connection string; Vercel domain whitelisted in CORS |
| **Neon** | Serverless PostgreSQL database | Connection string provided via `DATABASE_URL`; tables created automatically on first startup |

### Local Development

No cloud services are needed to run the project locally:

```bash
# Terminal 1 — Frontend
npm install
npm run dev
# Opens at http://localhost:5173

# Terminal 2 — Backend
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1      # Windows
pip install -r requirements.txt
python -m uvicorn main:app --reload
# Runs at http://127.0.0.1:8000
# Interactive API docs at http://127.0.0.1:8000/docs
```

When `DATABASE_URL` is not set, the backend automatically uses
`backend/skillbridge.db` (SQLite). No database installation or configuration is required.

---

## 10. Limitations and Future Improvements

### Current Limitations

| # | Limitation | Detail |
|---|---|---|
| 1 | **Static career and opportunity data** | The 6 career roles and 5 sample opportunities are hardcoded directly in `main.py`. There is no admin panel, no database table for careers or opportunities, and no integration with real job boards. |
| 2 | **Rule-based assistant only** | The Career Assistant uses keyword matching and fixed response templates. The code itself comments that generative AI integration is planned for a later phase. |
| 3 | **No authentication** | Profiles are identified only by email address in plain text. There is no login, password hashing, or session system. Anyone who knows a student's email can read or overwrite their profile. |
| 4 | **No URL-based routing** | Navigation is managed through React state flags. The browser URL does not change between pages, so the browser back button does not navigate as expected and deep links to specific pages cannot be shared. |
| 5 | **Skills stored as a JSON string** | The `skills` column in `student_profiles` holds a serialised JSON array rather than a normalised table. Querying by skill (e.g. "find all students who know Python") requires application-level JSON parsing. |
| 6 | **Render free-tier cold starts** | The free Render plan spins down web services after a period of inactivity. The first API call after idle can take 30–60 seconds to respond. |
| 7 | **No referential integrity** | The `student_email` column in `learning_progress` is a naming convention, not a database-enforced foreign key. Deleting a profile row would leave orphaned progress rows. |

### Future Improvements

| # | Improvement | Description |
|---|---|---|
| 1 | **LLM-powered assistant** | Integrate a large language model API (e.g. IBM watsonx, Google Gemini, or OpenAI) to replace the fixed keyword templates with genuinely conversational, context-aware responses. |
| 2 | **Live job and internship data** | Connect to external APIs (e.g. Naukri, Internshala, LinkedIn) to replace the 5 hardcoded sample opportunities with real, up-to-date listings. |
| 3 | **Authentication** | Implement JWT-based login with password hashing so profiles are secure and accessible across devices. |
| 4 | **URL routing** | Adopt React Router so every page has a unique URL, enabling bookmarking, browser back/forward navigation, and shareable deep links. |
| 5 | **Expanded career database** | Add more career roles (e.g. DevOps Engineer, Cybersecurity Analyst, UX Designer), more skills per role, and make the data editable at runtime rather than hardcoded. |
| 6 | **Resume parsing** | Accept a PDF or plain-text resume, extract skills automatically using NLP, and pre-fill the profile form — removing the manual skill-entry step. |
| 7 | **Normalised skills table** | Move skills into a dedicated relational table so the backend can support skill-based queries, analytics, and trend reporting. |
| 8 | **Analytics dashboard** | Add charts showing skill coverage over time and learning progress history so students can track their growth visually. |

---

*This document was generated from a source-code analysis of the SkillBridge AI repository.
All technical details are grounded in the actual implementation as of version 1.2.0.*
