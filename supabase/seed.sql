-- ==========================================================
-- SentimentIQ: Seed Dataset
-- Run this optional script to populate sample projects and analyzed posts
-- ==========================================================

-- Replace 'YOUR_USER_UUID' with your actual Supabase auth.users ID
-- Or let the application's built-in demo loader create client-side records.

DO $$
DECLARE
  demo_user_id uuid;
  proj_id uuid;
  p1_id uuid;
  p2_id uuid;
  p3_id uuid;
BEGIN
  -- Grab first authenticated user if available
  SELECT id INTO demo_user_id FROM auth.users LIMIT 1;

  IF demo_user_id IS NOT NULL THEN
    -- Insert sample project
    INSERT INTO public.projects (id, user_id, name, description, brand_or_topic, keywords)
    VALUES (
      gen_random_uuid(),
      demo_user_id,
      'NovaWatch Pro Launch',
      'Public sentiment tracking for the NovaWatch Pro smartwatch release campaign.',
      'NovaWatch Pro',
      ARRAY['battery life', 'health tracking', 'display', 'pricing', 'update']
    )
    RETURNING id INTO proj_id;

    -- Insert Post 1
    INSERT INTO public.posts (id, project_id, user_id, content, platform, author, post_url, published_at, status)
    VALUES (
      gen_random_uuid(),
      proj_id,
      demo_user_id,
      'Just received my NovaWatch Pro! The OLED screen is breathtaking and sleep tracking is astonishingly accurate. Best smartwatch upgrade yet! 🌟',
      'X',
      '@tech_marcus',
      'https://x.com/tech_marcus/status/123456789',
      NOW() - INTERVAL '5 days',
      'completed'
    )
    RETURNING id INTO p1_id;

    INSERT INTO public.sentiment_analyses (post_id, sentiment, sentiment_score, confidence, emotions, keywords, explanation, language, sarcasm_detected)
    VALUES (
      p1_id,
      'Positive',
      0.88,
      0.94,
      ARRAY['Joy', 'Excitement', 'Satisfaction'],
      ARRAY['OLED screen', 'sleep tracking', 'smartwatch upgrade'],
      'High praise for hardware display quality and sensor tracking precision with clear intent to recommend.',
      'en',
      false
    );

    -- Insert Post 2
    INSERT INTO public.posts (id, project_id, user_id, content, platform, author, post_url, published_at, status)
    VALUES (
      gen_random_uuid(),
      proj_id,
      demo_user_id,
      'Day 3 with NovaWatch Pro. Battery drained from 100% to 15% in just 7 hours with GPS enabled. Totally unacceptable for a $350 flagship device.',
      'Reddit',
      'u/gadget_critique',
      'https://reddit.com/r/smartwatches/comments/xyz123',
      NOW() - INTERVAL '4 days',
      'completed'
    )
    RETURNING id INTO p2_id;

    INSERT INTO public.sentiment_analyses (post_id, sentiment, sentiment_score, confidence, emotions, keywords, explanation, language, sarcasm_detected)
    VALUES (
      p2_id,
      'Negative',
      -0.76,
      0.92,
      ARRAY['Frustration', 'Disappointment'],
      ARRAY['battery drain', 'GPS', 'pricing', 'flagship'],
      'Severe dissatisfaction regarding rapid battery depletion under GPS tracking relative to high device price point.',
      'en',
      false
    );

    -- Insert Post 3
    INSERT INTO public.posts (id, project_id, user_id, content, platform, author, post_url, published_at, status)
    VALUES (
      gen_random_uuid(),
      proj_id,
      demo_user_id,
      'Oh brilliant, another software update that fixes one bug and breaks bluetooth syncing completely. Top tier engineering as always! 👏🙄',
      'X',
      '@sarah_runner',
      'https://x.com/sarah_runner/status/987654321',
      NOW() - INTERVAL '3 days',
      'completed'
    )
    RETURNING id INTO p3_id;

    INSERT INTO public.sentiment_analyses (post_id, sentiment, sentiment_score, confidence, emotions, keywords, explanation, language, sarcasm_detected)
    VALUES (
      p3_id,
      'Negative',
      -0.82,
      0.89,
      ARRAY['Annoyance', 'Sarcasm', 'Anger'],
      ARRAY['software update', 'bluetooth sync', 'bug'],
      'Sarcastic praise used to voice severe irritation about broken Bluetooth connectivity following a patch release.',
      'en',
      true
    );

    -- Insert AI Insight
    INSERT INTO public.ai_insights (project_id, user_id, title, summary, positive_themes, negative_themes, emerging_topics, recommendations, post_count_analyzed)
    VALUES (
      proj_id,
      demo_user_id,
      'NovaWatch Pro Week 1 Launch Sentiment Intelligence',
      'Overall sentiment leans moderately positive with strong appreciation for display hardware and customer care, contrasted with urgent complaints concerning GPS battery life and Bluetooth syncing.',
      '[{"theme": "Premium Build & OLED Display", "frequency": "High", "description": "Users praise the lightweight titanium finish and bright OLED screen."}]'::jsonb,
      '[{"impact": "High", "complaint": "GPS Battery Drain", "suggested_action": "Tune sensor polling frequency in next firmware update."}]'::jsonb,
      '["Offline Spotify queries", "Marathon GPS benchmarks", "Strap compatibility"]'::jsonb,
      '[{"action": "Deploy Bluetooth patch announcement", "category": "Immediate", "rationale": "Halts negative viral compounding"}]'::jsonb,
      3
    );

  END IF;
END $$;
