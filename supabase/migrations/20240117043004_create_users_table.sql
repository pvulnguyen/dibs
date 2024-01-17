create table if not exists users (
  id uuid default gen_random_uuid() primary key,
  account_id uuid references auth.users(id) on delete set null,
  onboarded boolean not null default false,
  deactivated boolean not null default false
);

alter table users enable row level security;

create policy read_own on users for select to authenticated using (auth.uid() = account_id);
create policy insert_own on users for insert to authenticated with check (auth.uid() = account_id);
create policy update_own on users for update to authenticated using (auth.uid() = account_id);

create or replace function public.handle_new_user() returns trigger as $$
  begin
    insert into public.users (account_id, onboarded, deactivated)
    values (new.id, false, false);
    return new;
  end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
