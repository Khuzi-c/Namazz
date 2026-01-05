-- Function to increment total prayers
create or replace function increment_total_prayers(uid uuid)
returns void as $$
begin
  update profiles
  set total_prayers = total_prayers + 1
  where id = uid;
end;
$$ language plpgsql security definer;

-- Function to decrement total prayers
create or replace function decrement_total_prayers(uid uuid)
returns void as $$
begin
  update profiles
  set total_prayers = total_prayers - 1
  where id = uid;
end;
$$ language plpgsql security definer;

-- Function to calculate and update streak
-- This is a simplified version. A robust streak needs complex query on 'prayers' table.
-- Streak = consecutive days with at least 1 prayer (or all 5? Let's say all 5 for 'Perfect Streak' or just 1 for 'Active Streak').
-- Let's define Streak as: Consecutive days where at least 1 prayer was performed.
create or replace function update_streak(uid uuid)
returns void as $$
declare
  v_streak integer;
begin
  -- Calculate streak
  -- This query finds the gap in dates where no prayer was recorded
  -- Simplified: We will just count consecutive days backwards from today
  
  with user_dates as (
    select date 
    from prayers 
    where user_id = uid 
    and (fajr or zuhr or asr or maghrib or isha) -- At least one prayer done
    and date <= current_date
    order by date desc
  ),
  groups as (
    select date,
           date - (row_number() over (order by date))::integer as grp
    from user_dates
  )
  select count(*) into v_streak
  from groups
  where grp = (select grp from groups order by date desc limit 1);

  -- Handle case where streak is null (0)
  if v_streak is null then 
    v_streak := 0;
  end if;

  update profiles
  set current_streak = v_streak
  where id = uid;
end;
$$ language plpgsql security definer;
