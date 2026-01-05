-- 1. Add 'proofs' column to 'prayers' table to store photo URLs (JSONB: { "fajr": "url", ... })
ALTER TABLE prayers 
ADD COLUMN IF NOT EXISTS proofs jsonb DEFAULT '{}'::jsonb;

-- 2. Create Storage Bucket for Prayer Proofs
insert into storage.buckets (id, name, public)
values ('prayer-proofs', 'prayer-proofs', true)
on conflict (id) do nothing;

-- 3. Set up Storage Security Policies (RLS)
drop policy if exists "Proofs are publicly accessible." on storage.objects;
drop policy if exists "Users can upload their own proofs." on storage.objects;
drop policy if exists "Users can update their own proofs." on storage.objects;

-- Allow public access to view proofs
create policy "Proofs are publicly accessible."
on storage.objects for select
using ( bucket_id = 'prayer-proofs' );

-- Allow authenticated users to upload their own proofs
create policy "Users can upload their own proofs."
on storage.objects for insert
with check ( bucket_id = 'prayer-proofs' and auth.role() = 'authenticated' );

-- Allow users to update their own proofs
create policy "Users can update their own proofs."
on storage.objects for update
using ( bucket_id = 'prayer-proofs' and auth.role() = 'authenticated' );
