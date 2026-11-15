-- Seed data for GlobalDo development
-- This file uses CTEs to get UUIDs from auth.users and profiles

-- Create profiles for users (trigger will create them on signup, but we insert for seed)
-- Note: In production, profiles are created by handle_new_user trigger on auth.users insert

-- Insert sample countries (already done in migration)
-- INSERT INTO countries (iso2, name) VALUES ... ON CONFLICT DO NOTHING;

-- The following data will be inserted after auth users exist
-- For local development, you can run this after creating test users via Supabase Auth UI

-- Sample tasks (will work when users exist with these emails)
INSERT INTO tasks (owner_id, title, description, category, tags, location_mode, city, country, compensation_type, amount, currency, deadline, helpers_needed, status)
VALUES
  ((SELECT id FROM auth.users WHERE email = 'alice@example.com'), 'Help translate blog post', 'Need help translating a 500-word blog post from English to Spanish. Topic: travel and culture.', 'Writing & translation', ARRAY['translation', 'spanish', 'travel'], 'remote', NULL, 'ES', 'swap', NULL, 'USD', NOW() + INTERVAL '7 days', 1, 'open'),
  ((SELECT id FROM auth.users WHERE email = 'bob@example.com'), 'Debug React component', 'React component is throwing errors in useEffect. Need someone with React experience to help debug.', 'Tech & coding', ARRAY['react', 'javascript', 'debug'], 'remote', NULL, 'CA', 'paid', 50, 'USD', NOW() + INTERVAL '3 days', 1, 'open'),
  ((SELECT id FROM auth.users WHERE email = 'charlie@example.com'), 'Design logo for startup', 'Need a modern, minimalist logo for a tech startup. Looking for creative and original design concepts.', 'Design & creative', ARRAY['logo', 'branding', 'minimalist'], 'remote', NULL, 'ES', 'paid', 150, 'USD', NOW() + INTERVAL '10 days', 1, 'open'),
  ((SELECT id FROM auth.users WHERE email = 'diana@example.com'), 'Tutor in English conversation', 'Looking for a native English speaker to practice conversation with. 1 hour sessions, 2-3 times per week.', 'Tutoring & learning', ARRAY['english', 'conversation', 'practice'], 'in_person', 'Seoul', 'KR', 'swap', NULL, 'USD', NULL, 1, 'open'),
  ((SELECT id FROM auth.users WHERE email = 'alice@example.com'), 'Edit research paper', 'Need someone with academic writing experience to edit a 3000-word research paper for clarity and grammar.', 'Writing & translation', ARRAY['editing', 'academic', 'research'], 'remote', NULL, 'US', 'swap', NULL, 'USD', NOW() + INTERVAL '5 days', 1, 'open'),
  ((SELECT id FROM auth.users WHERE email = 'bob@example.com'), 'Build simple API endpoint', 'Need help building a REST API endpoint in Node.js/Express. Should connect to a database and handle CRUD operations.', 'Tech & coding', ARRAY['nodejs', 'express', 'api'], 'remote', NULL, 'CA', 'paid', 75, 'USD', NOW() + INTERVAL '4 days', 1, 'open'),
  ((SELECT id FROM auth.users WHERE email = 'charlie@example.com'), 'Create social media graphics', 'Need 5 social media posts for a coffee shop launch. Should be eye-catching and on-brand.', 'Design & creative', ARRAY['social-media', 'graphics', 'branding'], 'remote', NULL, 'ES', 'paid', 100, 'USD', NOW() + INTERVAL '6 days', 1, 'open'),
  ((SELECT id FROM auth.users WHERE email = 'diana@example.com'), 'Help with math homework', 'Looking for someone patient who can help with high school level algebra and geometry homework.', 'Tutoring & learning', ARRAY['math', 'algebra', 'geometry'], 'in_person', 'Seoul', 'KR', 'swap', NULL, 'USD', NULL, 1, 'open'),
  ((SELECT id FROM auth.users WHERE email = 'alice@example.com'), 'Proofread business proposal', 'Need someone detail-oriented to proofread a 10-page business proposal for grammar, spelling, and clarity.', 'Writing & translation', ARRAY['proofreading', 'business', 'professional'], 'remote', NULL, 'US', 'swap', NULL, 'USD', NOW() + INTERVAL '2 days', 1, 'open'),
  ((SELECT id FROM auth.users WHERE email = 'bob@example.com'), 'Set up GitHub Actions CI/CD', 'Need help setting up CI/CD pipeline for a Next.js project using GitHub Actions.', 'Tech & coding', ARRAY['github-actions', 'cicd', 'nextjs'], 'remote', NULL, 'CA', 'paid', 100, 'USD', NOW() + INTERVAL '8 days', 1, 'open'),
  ((SELECT id FROM auth.users WHERE email = 'charlie@example.com'), 'Design landing page', 'Need a clean, responsive landing page for a SaaS product. Figma design provided.', 'Design & creative', ARRAY['landing-page', 'figma', 'responsive'], 'remote', NULL, 'ES', 'paid', 200, 'USD', NOW() + INTERVAL '14 days', 1, 'open'),
  ((SELECT id FROM auth.users WHERE email = 'diana@example.com'), 'Spanish conversation practice', 'Looking for a native Spanish speaker to practice conversation. Intermediate level, 30 min sessions.', 'Tutoring & learning', ARRAY['spanish', 'conversation', 'intermediate'], 'remote', NULL, 'KR', 'swap', NULL, 'USD', NULL, 1, 'open'),
  ((SELECT id FROM auth.users WHERE email = 'alice@example.com'), 'Write product descriptions', 'Need 20 product descriptions for an e-commerce store. Each ~100 words, SEO optimized.', 'Writing & translation', ARRAY['copywriting', 'ecommerce', 'seo'], 'remote', NULL, 'US', 'paid', 150, 'USD', NOW() + INTERVAL '10 days', 2, 'open'),
  ((SELECT id FROM auth.users WHERE email = 'bob@example.com'), 'Fix TypeScript errors', 'Large codebase has ~50 TypeScript errors after upgrade. Need expert to fix systematically.', 'Tech & coding', ARRAY['typescript', 'refactoring', 'bug-fix'], 'remote', NULL, 'CA', 'paid', 200, 'USD', NOW() + INTERVAL '5 days', 1, 'open'),
  ((SELECT id FROM auth.users WHERE email = 'charlie@example.com'), 'Create brand style guide', 'Need comprehensive brand guidelines including colors, typography, logo usage, voice.', 'Design & creative', ARRAY['branding', 'style-guide', 'identity'], 'remote', NULL, 'ES', 'paid', 300, 'USD', NOW() + INTERVAL '21 days', 1, 'open'),
  ((SELECT id FROM auth.users WHERE email = 'diana@example.com'), 'Help with IELTS preparation', 'Need tutor for IELTS speaking and writing sections. Target band 7+. Online sessions.', 'Tutoring & learning', ARRAY['ielts', 'english', 'test-prep'], 'remote', NULL, 'KR', 'paid', 40, 'USD', NOW() + INTERVAL '30 days', 1, 'open'),
  ((SELECT id FROM auth.users WHERE email = 'alice@example.com'), 'Transcribe audio interviews', '10 hours of audio interviews need transcription. Clean verbatim, timestamped.', 'Writing & translation', ARRAY['transcription', 'audio', 'interviews'], 'remote', NULL, 'US', 'paid', 100, 'USD', NOW() + INTERVAL '7 days', 2, 'open'),
  ((SELECT id FROM auth.users WHERE email = 'bob@example.com'), 'Code review for React app', 'Need senior dev to review React/TypeScript codebase. Focus on performance and best practices.', 'Tech & coding', ARRAY['code-review', 'react', 'typescript'], 'remote', NULL, 'CA', 'paid', 150, 'USD', NOW() + INTERVAL '3 days', 1, 'open'),
  ((SELECT id FROM auth.users WHERE email = 'charlie@example.com'), 'Illustrate children book', 'Need 12 illustrations for a children''s picture book. Whimsical watercolor style.', 'Design & creative', ARRAY['illustration', 'children-book', 'watercolor'], 'remote', NULL, 'ES', 'paid', 500, 'USD', NOW() + INTERVAL '30 days', 1, 'open'),
  ((SELECT id FROM auth.users WHERE email = 'diana@example.com'), 'Korean language exchange', 'Looking for Korean speaker to practice English with. Mutual language exchange.', 'Tutoring & learning', ARRAY['korean', 'language-exchange', 'conversation'], 'in_person', 'Seoul', 'KR', 'swap', NULL, 'USD', NULL, 1, 'open'),
  ((SELECT id FROM auth.users WHERE email = 'alice@example.com'), 'Local: Grocery shopping help', 'Need someone to help with weekly grocery shopping for elderly neighbor. 2 hours/week.', 'Errands & local help', ARRAY['grocery', 'elderly-care', 'weekly'], 'in_person', 'New York', 'US', 'paid', 30, 'USD', NOW() + INTERVAL '1 day', 1, 'open')
ON CONFLICT DO NOTHING;

-- Note: For local development, create test users via:
-- 1. Go to Supabase Studio (http://localhost:54323)
-- 2. Authentication > Users > Add user
-- 3. Create users: alice@example.com, bob@example.com, charlie@example.com, diana@example.com, admin@example.com
-- 4. Then run this seed or use the dashboard to insert data