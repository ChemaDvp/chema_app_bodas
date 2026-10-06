create extension if not exists pgcrypto with schema extensions;

alter table public.songs
  add column if not exists kind text not null default 'must_play'
    check (kind in ('must_play', 'do_not_play'));

create table if not exists public.wedding_schedule_items (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  event_time time not null,
  title text not null,
  description text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists wedding_schedule_items_order_idx
  on public.wedding_schedule_items(wedding_id, event_time, position);

create table if not exists public.wedding_invitations (
  token_hash text primary key,
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  created_by uuid not null references auth.users(id),
  expires_at timestamptz not null,
  claimed_by uuid references auth.users(id),
  claimed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.wedding_schedule_items enable row level security;
alter table public.wedding_invitations enable row level security;

drop policy if exists "members can add songs" on public.songs;
drop policy if exists "members can add pending songs" on public.songs;
create policy "members can add pending songs"
on public.songs for insert to authenticated
with check (
  (select public.is_wedding_member(wedding_id))
  and added_by = (select auth.uid())
  and status = 'pending'
);

drop policy if exists "members and admins read wedding schedule" on public.wedding_schedule_items;
create policy "members and admins read wedding schedule"
on public.wedding_schedule_items for select to authenticated
using ((select public.is_admin()) or (select public.is_wedding_member(wedding_id)));

drop policy if exists "admins manage wedding schedule" on public.wedding_schedule_items;
create policy "admins manage wedding schedule"
on public.wedding_schedule_items for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "admins read wedding invitations" on public.wedding_invitations;
create policy "admins read wedding invitations"
on public.wedding_invitations for select to authenticated
using ((select public.is_admin()));

grant select, insert, update, delete on public.wedding_schedule_items to authenticated;
grant select on public.wedding_invitations to authenticated;
revoke all on public.wedding_schedule_items, public.wedding_invitations from public, anon;

create or replace function public.create_wedding_invitation(p_wedding_id uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  invitation_token text;
begin
  if (select auth.uid()) is null or not (select public.is_admin()) then
    raise exception 'Only an administrator can create invitations';
  end if;
  if not exists (select 1 from public.weddings where id = p_wedding_id) then
    raise exception 'Wedding not found';
  end if;

  update public.wedding_invitations
  set expires_at = now()
  where wedding_id = p_wedding_id
    and claimed_at is null
    and expires_at > now();

  invitation_token := encode(extensions.gen_random_bytes(32), 'hex');
  insert into public.wedding_invitations (
    token_hash, wedding_id, created_by, expires_at
  ) values (
    encode(extensions.digest(invitation_token, 'sha256'), 'hex'),
    p_wedding_id,
    (select auth.uid()),
    now() + interval '7 days'
  );
  return invitation_token;
end;
$$;

create or replace function public.revoke_wedding_invitations(p_wedding_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null or not (select public.is_admin()) then
    raise exception 'Only an administrator can revoke invitations';
  end if;
  update public.wedding_invitations
  set expires_at = now()
  where wedding_id = p_wedding_id
    and claimed_at is null
    and expires_at > now();
end;
$$;

create or replace function public.claim_wedding_invitation(p_token text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  invitation public.wedding_invitations%rowtype;
  current_user_id uuid := (select auth.uid());
begin
  if current_user_id is null then
    raise exception 'Sign in before claiming an invitation';
  end if;
  if p_token is null or length(p_token) <> 64 then
    raise exception 'Invalid or expired invitation';
  end if;

  select * into invitation
  from public.wedding_invitations
  where token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex')
  for update;

  if not found or invitation.expires_at <= now() or invitation.claimed_at is not null then
    raise exception 'Invalid or expired invitation';
  end if;
  if exists (
    select 1 from public.wedding_members where user_id = current_user_id
  ) then
    raise exception 'This account is already linked to a wedding';
  end if;

  insert into public.wedding_members (wedding_id, user_id)
  values (invitation.wedding_id, current_user_id);
  update public.wedding_invitations
  set claimed_by = current_user_id, claimed_at = now()
  where token_hash = invitation.token_hash;

  return invitation.wedding_id;
end;
$$;

revoke all on function public.create_wedding_invitation(uuid) from public, anon;
revoke all on function public.revoke_wedding_invitations(uuid) from public, anon;
revoke all on function public.claim_wedding_invitation(text) from public, anon;
grant execute on function public.create_wedding_invitation(uuid) to authenticated;
grant execute on function public.revoke_wedding_invitations(uuid) to authenticated;
grant execute on function public.claim_wedding_invitation(text) to authenticated;

create or replace function public.enforce_song_limit()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  active_count integer;
begin
  if tg_op = 'UPDATE' and new.wedding_id is distinct from old.wedding_id then
    raise exception 'A song cannot be moved to another wedding';
  end if;

  if new.status <> 'rejected' then
    perform 1
    from public.weddings
    where id = new.wedding_id
    for update;

    if not found then
      raise exception 'Wedding not found';
    end if;

    select count(*) into active_count
    from public.songs
    where wedding_id = new.wedding_id
      and status <> 'rejected'
      and id <> new.id;

    if active_count >= 30 then
      raise exception 'The song list cannot contain more than 30 active songs';
    end if;
  end if;

  return new;
end;
$$;
