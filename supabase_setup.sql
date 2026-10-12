-- Run once in Supabase > SQL Editor
create table regions (id serial primary key, name text not null, description text);
create table destinations (id serial primary key, region_id int references regions(id), name text not null, icon text);
create table reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  region text not null,
  destination text not null,
  hazard_type text not null check (hazard_type in ('Landslide','Flooding','Road Closed','Other')),
  severity text not null check (severity in ('Low','Medium','High')),
  description text not null,
  created_at timestamptz default now()
);
alter table regions enable row level security;
alter table destinations enable row level security;
alter table reports enable row level security;

insert into regions (name, description) values
 ('Karnali','Remote western hills'),('Gandaki','Annapurna & Pokhara region'),
 ('Koshi','Eastern Nepal, Everest area'),('Bagmati','Kathmandu Valley'),('Lumbini','Birthplace of Buddha');
insert into destinations (region_id, name, icon) values
 (1,'Jumla Bazaar','🏪'),(1,'Rara Lake','🏞️'),(1,'Surkhet Highway','🛣️'),(1,'Dolpa District Office','🏛️'),
 (2,'Pokhara Lakeside','🏞️'),(2,'Annapurna Base Camp Trail','🥾'),(3,'Lukla Airport Road','🛣️'),
 (4,'Kathmandu Ring Road','🛣️'),(5,'Lumbini Sacred Garden','🏛️');
