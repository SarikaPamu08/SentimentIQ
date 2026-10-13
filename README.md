# SentimentIQ — AI Sentiment Tracker for Social Media

**SentimentIQ** is a production-quality, full-stack AI analytics platform designed to monitor, classify, and extract actionable brand intelligence from social media mentions across X, Reddit, Instagram, YouTube, LinkedIn, and Facebook.

Built with **Next.js (App Router, TypeScript)**, **Tailwind CSS**, **Recharts**, **Supabase (PostgreSQL & Auth)**, and the official **Google Gen AI SDK (`@google/genai`)**.

---

## Key Features

- **Real-Time Sentiment Classification**: Powered by Gemini 2.5 Flash, extracting structured sentiment category (Positive, Neutral, Negative), numeric score ($-1.0$ to $+1.0$), confidence estimates, detected emotions, extracted keywords, and natural language explanations.
- **Sarcasm & Nuance Detection**: Accurately recognizes irony and sarcastic praise (e.g., *"Oh brilliant, another bug post-update! 👏🙄"*), assigning negative scores and highlighting sarcasm warnings.
- **Interactive Analytics**: Interactive Recharts visualizations including Sentiment Distribution (Donut), 7-day Sentiment Trajectory (Area Chart), Network Breakdown (Stacked Bar), Emotion Profiling (Horizontal Bar), and Sentiment-Coded Keyword Tags.
- **Multi-Source Ingestion**:
  - Manual post modal with validation.
  - CSV drag-and-drop batch upload with PapaParse, column mapping preview, duplicate detection, and downloadable template CSV.
- **AI Executive Insights**: Synthesizes aggregate brand reports highlighting major positive praise clusters, high-impact recurring complaints, emerging discussion topics, and prioritized brand recommendations (Immediate, Strategic, Communication).
- **AI-Drafted Response Templates**: Contextual response drafts tailored for customer success and social media managers to handle critical or inquiring feedback with one-click copy.
- **Multi-Format Export**: Filtered CSV export, structured JSON export, and print-ready executive reports.
- **Supabase PostgreSQL with RLS**: Strict Row Level Security policies ensuring 100% data isolation between user accounts.
- **One-Click Demo Experience**: Explore features instantly using the pre-loaded NovaWatch Pro smartwatch launch dataset without requiring upfront credentials.

---

## Architecture & Technology Stack

- **Framework**: Next.js 16 (App Router, Turbopack, React 19, TypeScript)
- **Styling**: Tailwind CSS with custom dark SaaS tokens
- **Visualizations**: Recharts
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) & `@supabase/ssr` cookies
- **AI Engine**: Google Gemini API via official `@google/genai` SDK
- **Data Validation**: Zod runtime schema verification
- **File Parsing**: PapaParse (CSV)

---

## Getting Started Locally

### 1. Prerequisites
- Node.js 18+ (tested on Node v24)
- npm 10+
- (Optional) A free [Supabase account](https://supabase.com) and [Google AI Studio API key](https://aistudio.google.com)

### 2. Installation
```bash
git clone https://github.com/your-username/SentimentIQ.git
cd SentimentIQ
npm install
```

### 3. Environment Variables Setup
Copy the example environment file:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-server-only

# Google Gemini AI Configuration
GEMINI_API_KEY=your-google-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash

# App Canonical URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note**: SentimentIQ includes an automatic offline demo fallback. If you launch without API keys, the application automatically activates demo mode with complete local mock analysis so you can test all interfaces immediately!

### 4. Supabase Database Setup
1. Create a new project in the [Supabase Dashboard](https://supabase.com).
2. Go to **SQL Editor** in your Supabase project.
3. Open `supabase/schema.sql` from this repository, paste its contents into the SQL Editor, and click **Run**.
   - This creates `profiles`, `projects`, `posts`, `sentiment_analyses`, and `ai_insights` tables with all triggers and Row Level Security (RLS) policies.
4. (Optional) Run `supabase/seed.sql` to populate sample database records linked to your Supabase auth account.

### 5. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Production Build
```bash
npm run build
npm run start
```

---

## Database Schema & Row-Level Security

```
profiles: id (PK, references auth.users), full_name, avatar_url, created_at, updated_at
projects: id (PK), user_id (FK), name, description, brand_or_topic, keywords, created_at
posts: id (PK), project_id (FK), user_id (FK), content, platform, author, post_url, published_at, status
sentiment_analyses: id (PK), post_id (FK, UNIQUE), sentiment, sentiment_score, confidence, emotions, keywords, explanation, language, sarcasm_detected
ai_insights: id (PK), project_id (FK), user_id (FK), title, summary, positive_themes, negative_themes, emerging_topics, recommendations, suggested_responses
```

All tables have RLS enabled with policies verifying `auth.uid() = user_id`.

---

## Deployment to Vercel

1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com) and click **Add New > Project**.
3. Import your `SentimentIQ` repository.
4. In the **Environment Variables** section, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
   - `GEMINI_MODEL` (`gemini-2.5-flash`)
   - `NEXT_PUBLIC_APP_URL` (Your Vercel deployment URL)
5. Click **Deploy**.
