-- ==========================================================
-- SentimentIQ: Complete Database Schema & Row-Level Security
-- Execute this script in your Supabase SQL Editor
-- ==========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Linked to Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger to automatically create a profile row whenever a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Analyst'),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if already exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. PROJECTS TABLE
create table if not exists public.projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  brand_or_topic text not null,
  keywords text[] default '{}'::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_projects_user_id on public.projects(user_id);

-- 3. POSTS TABLE
create table if not exists public.posts (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  platform text not null check (platform in ('X', 'Instagram', 'Facebook', 'YouTube', 'LinkedIn', 'Reddit', 'Other')),
  author text,
  post_url text,
  published_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  error_message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_posts_project_id on public.posts(project_id);
create index if not exists idx_posts_user_id on public.posts(user_id);
create index if not exists idx_posts_status on public.posts(status);

-- 4. SENTIMENT ANALYSES TABLE
create table if not exists public.sentiment_analyses (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.posts(id) on delete cascade not null unique,
  sentiment text not null check (sentiment in ('Positive', 'Neutral', 'Negative')),
  sentiment_score numeric(4,3) not null check (sentiment_score between -1.0 and 1.0),
  confidence numeric(4,3) not null check (confidence between 0.0 and 1.0),
  emotions text[] default '{}'::text[],
  keywords text[] default '{}'::text[],
  explanation text not null,
  language text default 'en',
  sarcasm_detected boolean default false,
  raw_response jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_sentiment_analyses_post_id on public.sentiment_analyses(post_id);
create index if not exists idx_sentiment_analyses_sentiment on public.sentiment_analyses(sentiment);

-- 5. AI INSIGHTS TABLE
create table if not exists public.ai_insights (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  summary text not null,
  positive_themes jsonb default '[]'::jsonb,
  negative_themes jsonb default '[]'::jsonb,
  emerging_topics jsonb default '[]'::jsonb,
  recommendations jsonb default '[]'::jsonb,
  suggested_responses jsonb default '[]'::jsonb,
  post_count_analyzed integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_ai_insights_project_id on public.ai_insights(project_id);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict isolation ensuring users only view and edit their own data
-- ==========================================================

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.posts enable row level security;
alter table public.sentiment_analyses enable row level security;
alter table public.ai_insights enable row level security;

-- Profiles Policies
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Projects Policies
create policy "Users can view own projects" on public.projects
  for select using (auth.uid() = user_id);
create policy "Users can insert own projects" on public.projects
  for insert with check (auth.uid() = user_id);
create policy "Users can update own projects" on public.projects
  for update using (auth.uid() = user_id);
create policy "Users can delete own projects" on public.projects
  for delete using (auth.uid() = user_id);

-- Posts Policies
create policy "Users can view own posts" on public.posts
  for select using (auth.uid() = user_id);
create policy "Users can insert own posts" on public.posts
  for insert with check (auth.uid() = user_id);
create policy "Users can update own posts" on public.posts
  for update using (auth.uid() = user_id);
create policy "Users can delete own posts" on public.posts
  for delete using (auth.uid() = user_id);

-- Sentiment Analyses Policies
create policy "Users can view analyses of their posts" on public.sentiment_analyses
  for select using (
    exists (
      select 1 from public.posts
      where posts.id = sentiment_analyses.post_id and posts.user_id = auth.uid()
    )
  );
create policy "Users can insert analyses for their posts" on public.sentiment_analyses
  for insert with check (
    exists (
      select 1 from public.posts
      where posts.id = sentiment_analyses.post_id and posts.user_id = auth.uid()
    )
  );
create policy "Users can update analyses of their posts" on public.sentiment_analyses
  for update using (
    exists (
      select 1 from public.posts
      where posts.id = sentiment_analyses.post_id and posts.user_id = auth.uid()
    )
  );
create policy "Users can delete analyses of their posts" on public.sentiment_analyses
  for delete using (
    exists (
      select 1 from public.posts
      where posts.id = sentiment_analyses.post_id and posts.user_id = auth.uid()
    )
  );

-- AI Insights Policies
create policy "Users can view own insights" on public.ai_insights
  for select using (auth.uid() = user_id);
create policy "Users can insert own insights" on public.ai_insights
  for insert with check (auth.uid() = user_id);
create policy "Users can delete own insights" on public.ai_insights
  for delete using (auth.uid() = user_id);
