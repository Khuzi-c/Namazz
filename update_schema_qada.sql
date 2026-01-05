-- Create a table to track missed prayers (Qada)
create table if not exists qada_tracking (
  user_id uuid references auth.users not null primary key,
  fajr int default 0,
  zuhr int default 0,
  asr int default 0,
  maghrib int default 0,
  isha int default 0,
  witr int default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS Policies
alter table qada_tracking enable row level security;

create policy "Users can view their own qada."
  on qada_tracking for select
  using ( auth.uid() = user_id );

create policy "Users can update their own qada."
  on qada_tracking for update
  using ( auth.uid() = user_id );

create policy "Users can insert their own qada."
  on qada_tracking for insert
  with check ( auth.uid() = user_id );
