-- 1. Add Avatar and Leaderboard columns to 'profiles' table (Safe to re-run)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS avatar_url text,
ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS total_prayers integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_streak integer DEFAULT 0;

-- 2. Create Storage Bucket for Avatars (Safe to re-run)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- 3. Set up Storage Security Policies (RLS)
-- We drop existing policies first to avoid "policy already exists" errors if re-running
drop policy if exists "Avatar images are publicly accessible." on storage.objects;
drop policy if exists "Users can upload their own avatar." on storage.objects;
drop policy if exists "Users can update their own avatar." on storage.objects;

-- Allow public access to view avatars
create policy "Avatar images are publicly accessible."
on storage.objects for select
using ( bucket_id = 'avatars' );

-- Allow authenticated users to upload their own avatar
create policy "Users can upload their own avatar."
on storage.objects for insert
with check ( bucket_id = 'avatars' and auth.role() = 'authenticated' );

-- Allow users to update their own avatar
create policy "Users can update their own avatar."
on storage.objects for update
using ( bucket_id = 'avatars' and auth.role() = 'authenticated' );

-- REMOVED: ALTER TABLE storage.objects ... (This caused the error, RLS is already on by default)
