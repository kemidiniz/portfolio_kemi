-- Run this complete file in Supabase SQL Editor. No published records are updated.
-- Hides legacy WhatsApp fields from public reads and accepts new project categories.
begin;

do $upgrade$
declare
  definition text := pg_get_functiondef('public.save_portfolio(jsonb,bigint)'::regprocedure);
  old_category text := '"category":{"type":"string","enum":["pesquisa","estrategia","comunicacao","dados-ia"]}';
  new_category text := '"category":{"type":"string","minLength":1,"maxLength":200,"pattern":".*[^[:space:]].*"}';
  preserve_private text := $body$
  -- Keep private legacy contact values intact when an admin publishes other edits.
  if jsonb_typeof(content->'personal') = 'object' then
    content := jsonb_set(content, '{personal}', (content->'personal') ||
      jsonb_build_object(
        'whatsapp', coalesce((select p.content->'whatsapp' from public.portfolio_profile p where p.id), content#>'{personal,whatsapp}', '""'::jsonb),
        'whatsappDisplay', coalesce((select p.content->'whatsappDisplay' from public.portfolio_profile p where p.id), content#>'{personal,whatsappDisplay}', '""'::jsonb)
      ), false);
  end if;
$body$;
begin
  if strpos(definition, old_category) > 0 then
    definition := replace(definition, old_category, new_category);
  elsif strpos(definition, new_category) = 0 then
    raise exception 'Unexpected project schema; no changes made';
  end if;
  if strpos(definition, '-- Keep private legacy contact values intact') = 0 then
    if strpos(definition, '  shape := ') = 0 then
      raise exception 'Unexpected publication function; no changes made';
    end if;
    definition := replace(definition, '  shape := ', preserve_private || '  shape := ');
  end if;
  execute definition;
end;
$upgrade$;

-- The profile JSON is private. The read RPC below is the public, redacted view.
revoke select on public.portfolio_profile from anon;
drop policy if exists "Public content read" on public.portfolio_profile;
drop policy if exists "Portfolio admin profile read" on public.portfolio_profile;
create policy "Portfolio admin profile read" on public.portfolio_profile
  for select to authenticated using (public.is_portfolio_admin());

create or replace function public.read_portfolio() returns jsonb
language sql stable security definer set search_path = '' as $$
  select jsonb_build_object('revision',s.revision,'content',case when p.id is null then null else jsonb_build_object(
    'personal',p.content || '{"whatsapp":"","whatsappDisplay":""}'::jsonb,
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
notify pgrst, 'reload schema';
commit;
