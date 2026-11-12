# SkillBridge AI — Competition Submission

> **Project Name:** SkillBridge AI  
> **Tagline:** Turn Your Skills Into Career Opportunities  
> **Version:** 1.2.0  
> **Developer:** Gara Preethi Vardhan  
> **Programme:** B.Tech Computer Science and Engineering, 2026  
> **Live Application:** https://skill-bridge-ai-sigma.vercel.app  
> **Source Code:** https://github.com/preethivardhan19/SkillBridge-AI

---

## 1. Problem

Students and fresh graduates in the technology sector frequently face a critical gap
between the skills they possess and the career paths available to them. This gap manifests
in three concrete ways:

### 1.1 Career Direction Uncertainty

Most students graduate knowing they want to work in technology but without a clear picture
of which specific role — Data Analyst, Software Developer, Cloud Engineer, or others —
is a realistic fit for their existing skill set. Career aptitude tests are generic and do
not account for technical knowledge. Formal career counselling is expensive and often
inaccessible to students in Tier 2 and Tier 3 cities.

### 1.2 Unidentified Skill Gaps

Even students who have a target career in mind often cannot answer the question:
*"Exactly which skills am I missing?"* They may know they want to become a Data Scientist
but do not know whether they need to learn NumPy before TensorFlow, or whether their
existing Excel skills are relevant at all. Without a precise gap analysis, self-study
becomes unfocused and time-consuming.

### 1.3 Absence of Structured Learning Accountability

Online learning resources are abundant, but they come without structure or accountability.
A student may watch tutorials across ten platforms and still not know how close they are
to being ready for a role. There is no mechanism to track what has been learned, what
still remains, and how overall readiness has changed over time.

### 1.4 Why Existing Tools Are Insufficient

Generic job portals show vacancies but do not tell a student what they are missing.
Social networking platforms offer career inspiration but not personalised gap analysis.
Self-assessment quizzes provide scores but not actionable skill lists. SkillBridge AI is
built specifically to fill this gap by combining self-assessment, gap analysis, a
structured roadmap, and progress tracking in a single free tool.

---

## 2. Target Users

SkillBridge AI is designed for three closely related user groups:

| User Group | Specific Need | How SkillBridge AI Helps |
|---|---|---|
| **Final-year students** | Understand readiness for campus placements | Instantly see how their current skills map to 6 technical career paths |
| **Fresh graduates** | Plan upskilling before applying for jobs | Identify exactly which skills to add, with direct links to free learning resources |
| **Early-career job seekers** | Evaluate a career pivot or specialisation | Compare skills against multiple roles and track learning progress as they upskill |

The application deliberately requires minimal input. A user needs only a name, an email
address, and a comma-separated list of their technical skills to receive personalised
career recommendations, a skill gap report, and a learning roadmap. No account creation,
no payment, and no prior career knowledge is required.

---

## 3. Our Solution

SkillBridge AI is a web application that connects a student's self-reported technical
skills to structured career information through five integrated features.

### 3.1 How It Works — The Core Flow

```
Student enters skills
        │
        ▼
Backend compares skills against career skill requirements
        │
        ├─► Career Recommendations   (which roles match best, and by how much)
        ├─► Skill Gap Report         (which skills are missing for each role)
        ├─► Opportunity Matching     (which sample opportunities are most relevant)
        ├─► Learning Roadmap         (what to study, with curated resource links)
        └─► Career Assistant         (answers to career questions about the student's specific situation)
```

### 3.2 What the Student Receives

After entering their skills, a student receives:

- A **ranked list of career paths** with a percentage showing how much of each role's
  skill requirements they already cover.
- A **side-by-side breakdown** of matched skills and missing skills for every role.
- A **learning roadmap** with one free, curated learning resource per missing skill
  (22 resources in total).
- A **progress tracker** where they can mark skills as completed and see their readiness
  percentage increase.
- A **career assistant** that answers questions about career choices, skill priorities,
  interview preparation, and resume writing — personalised to the student's own skill
  profile.

### 3.3 Accessibility

The application is deployed on free-tier cloud infrastructure and is accessible from any
modern web browser without installation. No login is required to use the core features.

---

## 4. Key Innovation

SkillBridge AI's innovation lies in combining four capabilities that typically exist in
separate tools, and making the result immediately actionable.

### 4.1 Personalised Skill Matching

The platform does not provide generic career advice. Every recommendation is computed
from the student's actual, self-reported skill list. Two students with different skills
will receive entirely different career rankings and gap reports.

Technically, this is achieved by normalising all skill inputs (lowercasing, whitespace
cleanup, and alias resolution — for example, a student typing "ML" is matched identically
to one who types "machine learning") and then computing the set intersection between the
student's skills and each career role's required skill list.

### 4.2 Precise Missing-Skill Identification

Rather than saying "you need to improve your data skills", the platform tells the student
exactly which named skills are missing. For example: *"You match 3 out of 5 listed skills
for Data Analyst. Learning Power BI and Statistics could improve your skill coverage."*
This specificity is what makes the gap analysis actionable.

### 4.3 Opportunity Matching with Role Relevance

When matching the student's skills against sample opportunities, the sorting algorithm
prioritises role relevance before skill coverage. This means a student who has selected
"Data Analyst" as their preferred role will always see Data Analyst opportunities at the
top, even if their raw skill-match percentage for a Software Developer listing is
slightly higher. This prevents the common problem of recommendation systems pulling
users away from their stated career goal.

### 4.4 Persistent, Database-Backed Learning Progress

Completed skills are saved to a PostgreSQL database on the backend (or SQLite in local
development). This means learning progress is preserved across devices and browser
sessions. The roadmap's progress bar updates in real time as skills are marked complete,
giving the student a visible, accumulating sense of progress.

### 4.5 Integrated Career Assistant

The career assistant answers career-specific questions using the student's actual skill
data. When a student asks about skill gaps, missing skills, interview preparation, or
their learning roadmap, the assistant's response is generated from the student's real
match percentage and missing skill list — not from a generic script.

> **Note on implementation:** The career assistant is **rule-based** — it uses keyword
> detection and response templates rather than a large language model or generative AI.
> This makes its responses predictable, fast, and transparent. Integration with a
> generative AI model is identified as a planned future enhancement.

---

## 5. Technical Feasibility

SkillBridge AI is a fully working application that is live and accessible today. Its
architecture uses well-established, production-grade technologies.

### 5.1 Architecture Overview

```
REACT FRONTEND (Vercel)
    │  HTTP / JSON
    ▼
FASTAPI BACKEND (Render)
    │  SQL
    ▼
POSTGRESQL DATABASE (Neon)
```

### 5.2 Frontend — React 19 + Vite 8

The frontend is a single-page application with five distinct views: Profile, Dashboard,
Opportunities, Skill Roadmap, and Career Assistant. It uses only two runtime
dependencies (`react` and `react-dom`) and communicates with the backend entirely
through standard browser Fetch API calls. There are no heavy third-party UI frameworks.

Browser local storage is used as a cache and offline fallback — if the backend is
temporarily unavailable, the student can still see their profile, their previously loaded
recommendations, and their completed skills.

### 5.3 Backend — Python FastAPI

The FastAPI backend exposes nine REST endpoints. Every request body is validated with
Pydantic v2 before processing, ensuring that invalid inputs (oversized skill lists,
excessively long skill names, blank questions) are rejected cleanly.

The backend is stateless between requests, making it straightforward to scale on any
cloud platform.

### 5.4 Database — Dual-Mode (SQLite ↔ PostgreSQL)

The same codebase supports both SQLite (for local development, zero configuration
required) and PostgreSQL (for production). The switch is controlled by a single
`DATABASE_URL` environment variable. All writes use upsert operations (`ON CONFLICT …
DO UPDATE`) so saving a profile or toggling a skill completion never creates duplicate
records.

### 5.5 Deployment

| Service | Role | Tier |
|---|---|---|
| Vercel | Hosts the compiled React static files | Free |
| Render | Runs the FastAPI + Uvicorn Python backend | Free |
| Neon | Provides the serverless PostgreSQL database | Free |

The entire stack is operational at zero cost, demonstrating that the solution is viable
for student and non-profit deployment without any infrastructure budget.

### 5.6 API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/profile` | Save or update a student profile |
| GET | `/profile/{email}` | Retrieve a student profile |
| POST | `/recommend` | Generate ranked career recommendations |
| POST | `/match` | Match skills against sample opportunities |
| POST | `/assistant` | Answer a career question |
| PUT | `/progress` | Mark a skill as completed or incomplete |
| GET | `/progress/{email}` | Retrieve all completed skills for a student |
| GET | `/health` | Backend health check |

---

## 6. Effectiveness

SkillBridge AI addresses each of the three problems identified in Section 1 directly and
measurably.

### 6.1 Resolving Career Direction Uncertainty

When a student enters their skills, the platform immediately returns a ranked list of
all six career roles sorted by match percentage. The student does not need to guess —
they can see at a glance that they are, for example, a 60% match for Data Analyst and
a 33% match for Cloud Engineer. This single view replaces hours of reading generic career
guides that cannot account for the student's individual skill set.

The recommended career is further reinforced by the Career Assistant, which answers the
question *"Which career matches my skills?"* using the student's actual data.

### 6.2 Resolving Unidentified Skill Gaps

Every career recommendation card explicitly lists two columns: skills the student already
has, and skills they need to acquire. The list is exact and named — not categories like
"data skills" but specific items like "Power BI" and "Statistics". This precision turns
a vague anxiety ("I'm not ready") into a concrete checklist ("I need to learn two more
skills").

### 6.3 Resolving Disorganised Learning

The Skill Roadmap converts the missing-skills list into an actionable learning plan.
Each missing skill is paired with a direct link to a free, high-quality learning resource
(e.g. Google's Machine Learning Crash Course for Machine Learning, SQLBolt for SQL,
AWS Skill Builder for AWS). The student does not need to evaluate or search for
resources — one recommended starting point is provided per skill.

Progress is tracked numerically. As the student marks skills complete, the progress
percentage rises. The Dashboard shows completed skills and average skill coverage across
the top career recommendations, giving the student a dashboard-level view of how far they
have come.

### 6.4 Organisational Value

The five features work together as a coherent workflow rather than isolated tools:

```
Profile  →  Dashboard  →  Opportunities  →  Roadmap  →  Assistant
(input)     (overview)    (matching)         (learn)      (guidance)
```

A student can enter their skills once in the Profile, see their standing in the Dashboard,
explore relevant opportunities, open the Roadmap to study the missing skills, and ask the
Assistant specific questions — all within the same application, without switching tools.

---

## 7. Measurable Impact

> **Transparency note:** SkillBridge AI is a prototype. The metrics below are proposed
> indicators for a structured pilot study. No actual user data, survey results, time
> savings, or adoption statistics exist at the time of this submission.

A meaningful pilot study with a group of final-year students could measure the following:

### 7.1 Engagement Metrics

| Metric | How to Measure |
|---|---|
| Profile completion rate | Percentage of visitors who save a complete profile |
| Return visit rate | Percentage of registered users who return within 30 days |
| Roadmap usage rate | Percentage of users who open the Skill Roadmap after viewing recommendations |
| Skill completion rate | Average number of skills marked complete per active user per week |
| Assistant usage | Number of assistant questions asked per user session |

### 7.2 Outcome Metrics (Self-Reported)

| Metric | How to Measure |
|---|---|
| Career clarity | Pre/post survey: "How confident are you about your target career role?" (1–5 scale) |
| Skill gap awareness | Pre/post survey: "Can you name the skills you need to learn for your target role?" |
| Study organisation | Pre/post survey: "Do you have a structured plan for your technical skill development?" |
| Resource discovery | Survey: "Did SkillBridge AI introduce you to a learning resource you were not previously aware of?" |

### 7.3 Longitudinal Metrics

| Metric | How to Measure |
|---|---|
| Skill profile growth | Compare a user's total skill count at registration vs. 60 days later |
| Roadmap progression | Track the average increase in a user's learning progress percentage over 30 days |
| Career match improvement | Track whether a user's top career match percentage increases as they add newly learned skills to their profile |

These metrics would allow a pilot study to evaluate whether SkillBridge AI concretely
improves a student's career preparation process, without relying on claims that cannot
yet be verified.

---

## 8. Limitations and Future Scope

### 8.1 Current Limitations

The following are honest constraints of the current version, verified from the source
code.

| Limitation | Detail |
|---|---|
| **Static career data** | Six career roles and their required skills are hardcoded in the backend. There is no admin panel or database table for managing roles or skills at runtime. |
| **Sample opportunities only** | The five opportunities shown in the Opportunity Matching feature are hardcoded demonstration records, not live or verified job listings. |
| **Rule-based assistant** | The Career Assistant uses keyword detection and fixed response templates. It does not use a generative AI model or large language model. The source code notes this is planned for a future phase. |
| **No user authentication** | Profiles are identified only by email address. There is no password, login session, or access control. |
| **No URL routing** | Navigation is managed through React state flags. The browser back button does not navigate between pages and direct deep links to specific pages are not supported. |
| **Render cold starts** | The backend is hosted on Render's free tier, which spins down after inactivity. The first request after an idle period may take up to 60 seconds to respond. |

### 8.2 Planned Future Enhancements

| Enhancement | Description |
|---|---|
| **Generative AI assistant** | Replace the rule-based keyword matcher with an LLM API call to enable genuinely conversational, open-ended responses. |
| **Live opportunity data** | Integrate with job and internship APIs (e.g. Naukri, Internshala) to replace the demonstration listings with real vacancies. |
| **User authentication** | Add JWT-based login with secure password storage so profiles are protected and accessible across devices. |
| **Resume parsing** | Accept a PDF or plain-text resume and extract skills automatically to pre-fill the profile, removing the manual entry step. |
| **Expanded career catalogue** | Add more roles (e.g. DevOps Engineer, Cybersecurity Analyst, UX Designer) and make role and skill data editable from an admin interface. |
| **URL-based routing** | Adopt a client-side router so every page has a unique URL, enabling bookmarking and standard browser navigation. |
| **Learning analytics** | Add visualisations showing how a student's skill coverage and learning progress have changed over time. |

### 8.3 Summary of What Exists vs. What Is Proposed

| Capability | Status |
|---|---|
| Student profile creation and storage | ✅ Implemented |
| Career recommendation (rule-based, 6 roles) | ✅ Implemented |
| Skill gap analysis (matched and missing skills) | ✅ Implemented |
| Sample opportunity matching (5 demo listings) | ✅ Implemented |
| Skill roadmap with curated learning links | ✅ Implemented |
| Database-backed learning progress tracking | ✅ Implemented |
| Offline fallback via browser local storage | ✅ Implemented |
| Rule-based career assistant | ✅ Implemented |
| Deployed live on Vercel + Render + Neon | ✅ Live |
| Generative AI assistant | 🔲 Planned |
| Live job and internship listings | 🔲 Planned |
| User authentication | 🔲 Planned |
| Resume parsing | 🔲 Planned |
| URL-based navigation | 🔲 Planned |

---

*All technical claims in this document are grounded in the actual source code of
SkillBridge AI version 1.2.0. Features marked as planned are not present in the
current codebase.*
