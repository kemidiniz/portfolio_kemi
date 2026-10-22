-- Apply once in the Supabase SQL editor or with supabase db push.
begin;
create schema if not exists portfolio_private;
revoke all on schema portfolio_private from public, anon, authenticated;

-- A small validator for the JSON Schema keywords used by this project's schema.
-- Runs on the server as well, so clients cannot publish malformed content.
create or replace function portfolio_private.matches_schema(value jsonb, shape jsonb)
returns boolean language plpgsql immutable set search_path = '' as $$
declare k text; child jsonb; item jsonb; kind text;
begin
  kind := shape->>'type';
  if kind = 'integer' then
    if jsonb_typeof(value) <> 'number' then return false; end if;
    if (value::text)::numeric <> trunc((value::text)::numeric) then return false; end if;
  elsif kind is not null and jsonb_typeof(value) is distinct from kind then return false;
  end if;
  if shape ? 'enum' and not (shape->'enum' @> jsonb_build_array(value)) then return false; end if;
  if kind = 'object' then
    for k in select jsonb_array_elements_text(coalesce(shape->'required','[]'::jsonb)) loop
      if not (value ? k) then return false; end if;
    end loop;
    for k, child in select * from jsonb_each(value) loop
      if shape->'properties' ? k then
        if not portfolio_private.matches_schema(child, shape->'properties'->k) then return false; end if;
      elsif shape->'additionalProperties' = 'false'::jsonb then return false;
      end if;
    end loop;
  elsif kind = 'array' then
    if shape ? 'minItems' and jsonb_array_length(value) < (shape->>'minItems')::int then return false; end if;
    if shape ? 'maxItems' and jsonb_array_length(value) > (shape->>'maxItems')::int then return false; end if;
    for item in select * from jsonb_array_elements(value) loop
      if not portfolio_private.matches_schema(item, shape->'items') then return false; end if;
    end loop;
  elsif kind = 'string' then
    k := value #>> '{}';
    if shape ? 'minLength' and length(k) < (shape->>'minLength')::int then return false; end if;
    if shape ? 'maxLength' and length(k) > (shape->>'maxLength')::int then return false; end if;
    if shape ? 'pattern' and k !~ (shape->>'pattern') then return false; end if;
  elsif kind in ('number','integer') then
    if shape ? 'minimum' and (value::text)::numeric < (shape->>'minimum')::numeric then return false; end if;
    if shape ? 'maximum' and (value::text)::numeric > (shape->>'maximum')::numeric then return false; end if;
  end if;
  return true;
end;
$$;

create table public.portfolio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.portfolio_admins enable row level security;
revoke all on public.portfolio_admins from anon, authenticated;
grant select on public.portfolio_admins to authenticated;
create policy "Members can see their own admin membership" on public.portfolio_admins
  for select to authenticated using (user_id = (select auth.uid()));

create function public.is_portfolio_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.portfolio_admins where user_id = (select auth.uid()));
$$;
revoke all on function public.is_portfolio_admin() from public, anon;
grant execute on function public.is_portfolio_admin() to authenticated;

create table public.portfolio_profile (
  id boolean primary key default true check (id),
  content jsonb not null check (jsonb_typeof(content) = 'object')
);
create table public.portfolio_state (
  id boolean primary key default true check (id),
  revision bigint not null default 0,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);
insert into public.portfolio_state(id) values (true);

-- Separate collections preserve ordering; flexible item content covers nested lists.
do $$
declare tab text;
begin
  foreach tab in array array['portfolio_experiences','portfolio_education','portfolio_immersions','portfolio_projects','portfolio_certifications','portfolio_skills'] loop
    execute format('create table public.%I (id text primary key, position integer not null check (position >= 0), content jsonb not null check (jsonb_typeof(content) = ''object''))',tab);
  end loop;
  foreach tab in array array['portfolio_profile','portfolio_state','portfolio_experiences','portfolio_education','portfolio_immersions','portfolio_projects','portfolio_certifications','portfolio_skills'] loop
    execute format('alter table public.%I enable row level security',tab);
    execute format('revoke all on public.%I from anon, authenticated',tab);
    execute format('grant select on public.%I to anon, authenticated',tab);
    execute format('create policy "Public content read" on public.%I for select to anon, authenticated using (true)',tab);
  end loop;
end;
$$;
-- No direct write grants or policies. Publishing is an atomic authorized RPC.
create function public.read_portfolio() returns jsonb
language sql stable set search_path = '' as $$
  select jsonb_build_object('revision',s.revision,'content',case when p.id is null then null else jsonb_build_object(
    'personal',p.content,
    'experiences',(select coalesce(jsonb_agg(content order by position),'[]'::jsonb) from public.portfolio_experiences),
    'education',(select coalesce(jsonb_agg(content order by position),'[]'::jsonb) from public.portfolio_education),
    'techImmersions',(select coalesce(jsonb_agg(content order by position),'[]'::jsonb) from public.portfolio_immersions),
    'projects',(select coalesce(jsonb_agg(content order by position),'[]'::jsonb) from public.portfolio_projects),
    'certifications',(select coalesce(jsonb_agg(content order by position),'[]'::jsonb) from public.portfolio_certifications),
    'skills',(select coalesce(jsonb_agg(content order by position),'[]'::jsonb) from public.portfolio_skills)
  ) end) from public.portfolio_state s left join public.portfolio_profile p on p.id = s.id where s.id;
$$;
revoke all on function public.read_portfolio() from public;
grant execute on function public.read_portfolio() to anon, authenticated;

create function public.save_portfolio(content jsonb, expected_revision bigint) returns bigint
language plpgsql security definer set search_path = '' as $$
declare current_revision bigint; section text; tab text; item jsonb; idx bigint; shape jsonb;
begin
  if not public.is_portfolio_admin() then raise exception 'Administrator access required' using errcode = '42501'; end if;
  select revision into current_revision from public.portfolio_state where id for update;
  if expected_revision is distinct from current_revision then raise exception 'Content changed in another session' using errcode = '40001'; end if;
  if content is null or octet_length(content::text) > 2000000 then raise exception 'Invalid content size' using errcode = '22023'; end if;
  shape := '{"$schema":"http://json-schema.org/draft-07/schema#","type":"object","properties":{"personal":{"type":"object","properties":{"name":{"type":"string","minLength":1,"maxLength":20000},"nickname":{"type":"string","maxLength":20000},"brandTitle":{"type":"string","minLength":1,"maxLength":20000},"headline":{"type":"string","minLength":1,"maxLength":20000},"subtitle":{"type":"string","maxLength":20000},"age":{"type":"integer","minimum":0,"maximum":150},"location":{"type":"string","maxLength":20000},"email":{"type":"string","format":"email","pattern":"^(?:[A-Za-z0-9_''+\\-]+\\.)*[A-Za-z0-9_''+\\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$"},"linkedin":{"type":"string","maxLength":2048},"linkedinDisplay":{"type":"string","maxLength":20000},"whatsapp":{"type":"string","maxLength":2048},"whatsappDisplay":{"type":"string","maxLength":20000},"avatarUrl":{"type":"string","maxLength":2048},"statusBadge":{"type":"string","maxLength":20000},"motto":{"type":"string","maxLength":20000},"bioParagraphs":{"maxItems":100,"type":"array","items":{"type":"string","maxLength":20000}},"coreValues":{"maxItems":100,"type":"array","items":{"type":"object","properties":{"title":{"type":"string","maxLength":20000},"desc":{"type":"string","maxLength":20000}},"required":["title","desc"],"additionalProperties":false}},"metrics":{"maxItems":100,"type":"array","items":{"type":"object","properties":{"value":{"type":"string","maxLength":20000},"label":{"type":"string","maxLength":20000},"detail":{"type":"string","maxLength":20000}},"required":["value","label","detail"],"additionalProperties":false}}},"required":["name","nickname","brandTitle","headline","subtitle","age","location","email","linkedin","linkedinDisplay","whatsapp","whatsappDisplay","avatarUrl","statusBadge","motto","bioParagraphs","coreValues","metrics"],"additionalProperties":false},"experiences":{"maxItems":200,"type":"array","items":{"type":"object","properties":{"id":{"type":"string","minLength":1,"maxLength":200},"role":{"type":"string","maxLength":20000},"company":{"type":"string","maxLength":20000},"period":{"type":"string","maxLength":20000},"location":{"type":"string","maxLength":20000},"badge":{"type":"string","maxLength":20000},"summary":{"type":"string","maxLength":20000},"achievements":{"maxItems":100,"type":"array","items":{"type":"string","maxLength":20000}},"skills":{"maxItems":100,"type":"array","items":{"type":"string","maxLength":20000}}},"required":["id","role","company","period","location","summary","achievements","skills"],"additionalProperties":false}},"education":{"maxItems":200,"type":"array","items":{"type":"object","properties":{"id":{"type":"string","minLength":1,"maxLength":200},"institution":{"type":"string","maxLength":20000},"degree":{"type":"string","maxLength":20000},"field":{"type":"string","maxLength":20000},"status":{"type":"string","maxLength":20000},"period":{"type":"string","maxLength":20000},"details":{"type":"string","maxLength":20000}},"required":["id","institution","degree","field","status","period","details"],"additionalProperties":false}},"techImmersions":{"maxItems":200,"type":"array","items":{"type":"object","properties":{"id":{"type":"string","minLength":1,"maxLength":200},"program":{"type":"string","maxLength":20000},"organization":{"type":"string","maxLength":20000},"type":{"type":"string","enum":["course","summit","community"]},"year":{"type":"string","maxLength":20000},"description":{"type":"string","maxLength":20000},"focus":{"maxItems":100,"type":"array","items":{"type":"string","maxLength":20000}}},"required":["id","program","organization","type","year","description","focus"],"additionalProperties":false}},"projects":{"maxItems":200,"type":"array","items":{"type":"object","properties":{"id":{"type":"string","minLength":1,"maxLength":200},"title":{"type":"string","maxLength":20000},"category":{"type":"string","enum":["pesquisa","estrategia","comunicacao","dados-ia"]},"categoryLabel":{"type":"string","maxLength":20000},"year":{"type":"string","maxLength":20000},"tagline":{"type":"string","maxLength":20000},"image":{"type":"string","maxLength":2048},"role":{"type":"string","maxLength":20000},"clientOrContext":{"type":"string","maxLength":20000},"overview":{"type":"string","maxLength":20000},"challenge":{"type":"string","maxLength":20000},"solution":{"type":"string","maxLength":20000},"results":{"maxItems":100,"type":"array","items":{"type":"string","maxLength":20000}},"tools":{"maxItems":100,"type":"array","items":{"type":"string","maxLength":20000}},"featured":{"type":"boolean"}},"required":["id","title","category","categoryLabel","year","tagline","image","role","clientOrContext","overview","challenge","solution","results","tools"],"additionalProperties":false}},"certifications":{"maxItems":200,"type":"array","items":{"type":"object","properties":{"id":{"type":"string","minLength":1,"maxLength":200},"title":{"type":"string","maxLength":20000},"institution":{"type":"string","maxLength":20000},"year":{"type":"string","maxLength":20000},"skillsAcquired":{"maxItems":100,"type":"array","items":{"type":"string","maxLength":20000}}},"required":["id","title","institution","year","skillsAcquired"],"additionalProperties":false}},"skills":{"maxItems":100,"type":"array","items":{"type":"object","properties":{"category":{"type":"string","maxLength":20000},"description":{"type":"string","maxLength":20000},"items":{"maxItems":100,"type":"array","items":{"type":"object","properties":{"name":{"type":"string","maxLength":20000},"level":{"type":"string","enum":["Avançado","Intermediário","Especialista"]}},"required":["name","level"],"additionalProperties":false}}},"required":["category","description","items"],"additionalProperties":false}}},"required":["personal","experiences","education","techImmersions","projects","certifications","skills"],"additionalProperties":false}'::jsonb;
  if not portfolio_private.matches_schema(content,shape) then raise exception 'Invalid portfolio content' using errcode = '22023'; end if;
  -- Links are restricted to http(s) or local paths; reject executable schemes.
  for section in select jsonb_array_elements_text('["linkedin","whatsapp","avatarUrl"]'::jsonb) loop
    if content->'personal'->>section <> '' and content->'personal'->>section !~* '^(https?://|/[^/])' then raise exception 'Invalid link' using errcode = '22023'; end if;
  end loop;
  for item in select * from jsonb_array_elements(content->'projects') loop
    if item->>'image' <> '' and item->>'image' !~* '^(https?://|/[^/])' then raise exception 'Invalid image URL' using errcode = '22023'; end if;
  end loop;
  insert into public.portfolio_profile(id,content) values(true,content->'personal') on conflict(id) do update set content=excluded.content;
  for section,tab in select * from (values ('experiences','portfolio_experiences'),('education','portfolio_education'),('techImmersions','portfolio_immersions'),('projects','portfolio_projects'),('certifications','portfolio_certifications'),('skills','portfolio_skills')) as collections(section,tab) loop
    execute format('delete from public.%I',tab);
    for item,idx in select value, ordinality - 1 from jsonb_array_elements(content->section) with ordinality loop
      execute format('insert into public.%I(id,position,content) values ($1,$2,$3)',tab) using case when section = 'skills' then idx::text else item->>'id' end,idx,item;
    end loop;
  end loop;
  update public.portfolio_state set revision=current_revision+1,updated_at=now(),updated_by=auth.uid() where id;
  return current_revision+1;
end;
$$;
revoke all on function public.save_portfolio(jsonb,bigint) from public, anon;
grant execute on function public.save_portfolio(jsonb,bigint) to authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('portfolio-media','portfolio-media',true,5242880,array['image/jpeg','image/png','image/webp']);
create policy "Portfolio media public read" on storage.objects for select to anon,authenticated using (bucket_id='portfolio-media');
create policy "Portfolio admin media insert" on storage.objects for insert to authenticated with check (bucket_id='portfolio-media' and public.is_portfolio_admin());
-- Uploaded files use unique names; published links never overwrite another image.
notify pgrst, 'reload schema';
commit;
