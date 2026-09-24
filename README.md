# 🧭 NextMarga

### Your personalized opportunity & career roadmap for students

**NextMarga** is a student-focused platform that helps learners discover relevant **scholarships, competitions, examinations, internships, research opportunities, hackathons, jobs, and career pathways** in one place.

> **Discover opportunities. Build your path. Move forward.**

---

## ✨ What is NextMarga?

Students often have to search across dozens of websites to find opportunities that match their class, interests, location, skills, and career goals. NextMarga brings that journey into a single, personalized experience.

The platform combines a student profile, opportunity discovery, personalized matching, applications, a career dossier, roadmap guidance, and AI-powered career assistance.

---

## 🚀 Key Features

### 🎯 Personalized Opportunity Discovery
- Search scholarships, exams, internships, competitions, research programs, hackathons, jobs, and more.
- Filter and explore opportunities based on student needs.
- Personalized matching using profile information.
- Verified opportunity indicators and deadline information.

### 🧑‍🎓 Student Profile
Build a profile containing:
- Education and academic stage
- Location
- Interests and skills
- Career goals
- Preferred opportunity categories

### 🗺️ Career Roadmap
Turn long-term goals into practical next steps with a personalized path designed around the student's current stage and interests.

### 📄 Applications & Dossier
Keep track of opportunities and build a structured student dossier containing important application and achievement information.

### 🤖 CareerAI
NextMarga includes an AI career-assistance layer designed to provide structured, encouraging guidance around:
- Career exploration
- Scholarships and competitions
- Olympiads and examinations
- Skills and projects
- Roadmap planning

### 🔐 Authentication & Data
The application uses Supabase for authentication and persistent application data, with protected database access and production-oriented security rules.

### 📱 Modern Student Experience
- Responsive web interface
- Dark, focused visual design
- Mobile-friendly navigation
- PWA support
- Fast opportunity discovery

---

## 🧩 Main User Journey

```text
Login
  ↓
Profile
  ↓
Explore
  ↓
Opportunity
  ↓
Apply
  ↓
Applications
  ↓
Dossier
  ↓
Settings
  ↓
Logout
```

---

## 🏗️ Architecture Overview

NextMarga separates the student-facing UI from server-side AI operations and persistent data access.

```text
React + TypeScript UI
        │
        ├── Profile / Explore / Applications / Roadmap
        │
        └── CareerAI requests
                 │
                 ▼
          Server API boundary
                 │
          ┌──────┴──────┐
          ▼             ▼
      Gemini AI      Supabase
                       │
                Auth + application data
```

The server boundary is responsible for validating request payloads before forwarding supported inputs to external AI services. Client code should never contain service-role credentials or private API keys.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Backend / Data | Supabase |
| Authentication | Supabase Auth |
| AI | AI-powered career assistance |
| Deployment | Vercel |
| Repository | GitHub |
| PWA | Web App Manifest + Service Worker |

---

## 📁 Project Structure

```text
NextMarga/
├── src/
│   ├── components/
│   ├── screens/
│   ├── lib/
│   └── main.tsx
├── public/
├── supabase/
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

---

## ⚙️ Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/rkaif8314-a11y/NextMarga.git
cd NextMarga
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file with the required configuration:

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` | Browser Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Browser-safe Supabase key |
| `SUPABASE_URL` | Server Supabase URL |
| `SUPABASE_ANON_KEY` | Server auth lookup key |
| `GEMINI_API_KEY` | Server-side CareerAI credential |
| `GEMINI_MODEL` | Optional Gemini model override |

Use `.env.example` as the template.

**Never commit production secrets or API keys to GitHub.**

### 4. Start development server

```bash
npm run dev
```

### 5. Create a production build

```bash
npm run build
```

---

## 🌐 Production

The production application is deployed through Vercel and connected to the project's GitHub repository.

**Live application:** https://next-marga.vercel.app/

**Source code:** https://github.com/rkaif8314-a11y/NextMarga

---

## 🔒 Security Notes

- Keep API keys and service-role credentials out of source control.
- Use environment variables for production secrets.
- Keep Supabase Row Level Security enabled for protected data.
- Verify opportunity information and eligibility against official sources before applying.

---

## 🧪 Development Checks

Before opening a pull request, run the project's dependency installation and production build locally:

```bash
npm install
npm run build
```

When changing API request handling, also manually exercise the affected success and validation paths. Inputs coming from forms or network requests should be treated as untrusted and tested with empty, malformed, and unexpectedly long values.

---

## 🧭 Project Vision

NextMarga aims to become a trusted starting point for students who want to move from **"What opportunities are available to me?"** to **"What should I do next?"**.

The goal is not simply to list opportunities. The goal is to help students understand **which opportunities fit them, why they matter, what to prepare, and what action to take next.**

---

## 👨‍💻 About the Creator

**Kaif Ali** — Creator & Developer of NextMarga.

NextMarga is being built as a student-first platform focused on making opportunities easier to discover, understand, and act on.

- Instagram: **[@kaif9.645](https://instagram.com/kaif9.645)**
- GitHub: **[@rkaif8314-a11y](https://github.com/rkaif8314-a11y)**

---

## 📜 Status

NextMarga is an actively developed project. Features and opportunity coverage continue to evolve as the platform moves toward a broader production-ready student opportunity ecosystem.

---

### ⭐ If NextMarga helps you, consider starring the repository.

**NextMarga — Find your opportunity. Build your roadmap. Shape your future.**


## Product Scope

NextMarga is organized around four connected student workflows: discover an opportunity, understand eligibility and preparation, track an application, and build a longer-term roadmap. The product is designed so that discovery does not end at a search result; each opportunity should lead to a clear next action.


## CareerAI Guidance Model

CareerAI is intended to support students with explanations, planning, and structured next steps. AI-generated guidance should be treated as assistance rather than an authoritative source for eligibility, deadlines, admissions, or financial decisions. Time-sensitive opportunity details should be checked against the relevant official source before a student acts on them.


## Environment Configuration

Keep local configuration in an untracked environment file. Public client configuration and server-only secrets must be treated differently: browser-exposed values should never be used as a substitute for server-side authorization, and private AI credentials must remain outside client bundles. When adding a new environment variable, document its purpose and whether it is safe for browser exposure.


## Validation Checklist

For changes affecting forms, API routes, authentication, or opportunity data, verify at least: valid input, missing input, malformed input, unexpectedly long input, unauthorized access, loading state, error state, and successful recovery. Production builds should also be run before release so TypeScript and bundling problems are caught before deployment.


## Contribution Workflow

1. Create a focused branch for one change.
2. Keep the change small enough to review.
3. Run the relevant checks locally.
4. Confirm that secrets and generated files are not included.
5. Open a pull request with a concise description of the behavior changed and the validation performed.

Prefer changes that improve reliability, accessibility, security, or the student journey rather than adding complexity without a clear user benefit.
