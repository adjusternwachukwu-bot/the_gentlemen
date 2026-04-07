-- The Gentlemen - Database Schema
-- Run this in Supabase SQL Editor

-- Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  date_of_birth date,
  insurance_provider text,
  insurance_id text,
  tier text check (tier in ('starter', 'member', 'gentleman')),
  stripe_customer_id text,
  role text default 'member' check (role in ('member', 'admin')),
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Profiles policy
create policy "Profiles are viewable by users and admins" on public.profiles
  for select using (auth.uid() = id or role = 'admin');

create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Intake responses
create table public.intake_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  question text not null,
  answer text not null,
  step_number int,
  created_at timestamptz default now()
);

-- Intake responses policy
create policy "Users can view their own intake responses" on public.intake_responses
  for select using (auth.uid() = user_id);

create policy "Users can insert their own intake responses" on public.intake_responses
  for insert with check (auth.uid() = user_id);

-- Subscriptions (Lemon Squeezy)
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  lemonsqueezy_subscription_id text unique,
  tier text not null,
  status text default 'active',
  current_period_end timestamptz,
  created_at timestamptz default now()
);

-- Subscriptions policy
create policy "Users can view their own subscription" on public.subscriptions
  for select using (auth.uid() = user_id);

create policy "Users can insert their own subscription" on public.subscriptions
  for insert with check (auth.uid() = user_id);

-- Appointments
create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  provider_id text,
  provider_name text,
  scheduled_at timestamptz,
  status text default 'pending',
  video_link text,
  notes text,
  created_at timestamptz default now()
);

-- Appointments policy
create policy "Users can view their own appointments" on public.appointments
  for select using (auth.uid() = user_id);

create policy "Users can insert their own appointments" on public.appointments
  for insert with check (auth.uid() = user_id);

-- Performance tracking (check-ins)
create table public.check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  mood int check (mood between 1 and 10),
  energy int check (energy between 1 and 10),
  focus int check (focus between 1 and 10),
  notes text,
  created_at timestamptz default now()
);

-- Check-ins policy
create policy "Users can view their own check-ins" on public.check_ins
  for select using (auth.uid() = user_id);

create policy "Users can insert their own check-ins" on public.check_ins
  for insert with check (auth.uid() = user_id);

-- Messages
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references profiles(id),
  receiver_id uuid references profiles(id),
  content text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- Messages policy
create policy "Users can view their own messages" on public.messages
  for select using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can send messages" on public.messages
  for insert with check (auth.uid() = sender_id);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Indexes for performance
create index idx_intake_responses_user_id on intake_responses(user_id);
create index idx_subscriptions_user_id on subscriptions(user_id);
create index idx_appointments_user_id on appointments(user_id);
create index idx_check_ins_user_id on check_ins(user_id);
create index idx_messages_sender_id on messages(sender_id);
create index idx_messages_receiver_id on messages(receiver_id);