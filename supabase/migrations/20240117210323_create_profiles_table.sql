create table if not exists profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  username varchar(255) not null unique,
  display_name text not null check (char_length(display_name) > 1),
  first_name text,
  last_name text
);

alter table profiles enable row level security;

create policy read_all on profiles for select to authenticated, anon using (true);
create policy insert_own on profiles for insert to authenticated with check (auth.uid() in (select account_id from public.users where id = user_id));
create policy update_own on profiles for update to authenticated using (auth.uid() in (select account_id from public.users where id = user_id));

create or replace function public.update_onboarded_status() returns trigger as $$
  begin
    update public.users
    set onboarded = true
    where id = new.user_id;
    return new;
  end;
$$ language plpgsql security definer;

create trigger on_profile_created
  after insert on public.profiles
  for each row execute procedure public.update_onboarded_status();
