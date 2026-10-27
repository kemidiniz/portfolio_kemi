-- This fixture runs only in the disposable local test database.
update public.portfolio_profile set content = content || '{"whatsapp":"https://wa.me/5500000000000","whatsappDisplay":"private-test-contact"}'::jsonb where id;
set role anon;
do $$ begin
  if public.read_portfolio()#>>'{content,personal,whatsapp}' <> '' then raise exception 'Public RPC leaked WhatsApp'; end if;
  if public.read_portfolio()#>>'{content,personal,whatsappDisplay}' <> '' then raise exception 'Public RPC leaked phone label'; end if;
  begin
    perform content from public.portfolio_profile;
    raise exception 'Anonymous profile access succeeded';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000002',false);
do $$ begin
  if exists(select 1 from public.portfolio_profile) then raise exception 'Reader accessed private profile'; end if;
  if public.read_portfolio()#>>'{content,personal,whatsapp}' <> '' then raise exception 'Reader RPC leaked contact'; end if;
end $$;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);
do $$ declare payload jsonb; item jsonb; next_revision bigint; preserved text; begin
  select content->>'whatsapp' into preserved from public.portfolio_profile where id;
  if preserved <> 'https://wa.me/5500000000000' then raise exception 'Admin cannot access private legacy value'; end if;
  payload := public.read_portfolio()->'content';
  select content->'projects'->0 into item from test.fixture;
  item := item || '{"category":"automacoes","categoryLabel":"Automações"}'::jsonb;
  payload := jsonb_set(payload, '{projects}', jsonb_build_array(item));
  select (public.read_portfolio()->>'revision')::bigint into next_revision;
  perform public.save_portfolio(payload, next_revision);
  if (select content->>'whatsapp' from public.portfolio_profile where id) <> preserved then raise exception 'Publishing masked draft erased private contact'; end if;
  if public.read_portfolio()#>>'{content,projects,0,category}' <> 'automacoes' then raise exception 'Custom category was not published'; end if;
  if public.read_portfolio()#>>'{content,personal,whatsapp}' <> '' then raise exception 'Publication exposed private contact'; end if;
  begin
    perform public.save_portfolio(jsonb_set(payload,'{projects,0,category}','"   "'),next_revision+1);
    raise exception 'Whitespace category accepted';
  exception when invalid_parameter_value then null; end;
  begin
    perform public.save_portfolio(jsonb_set(payload,'{projects,0,category}',to_jsonb(repeat('x',201))),next_revision+1);
    raise exception 'Oversized category accepted';
  exception when invalid_parameter_value then null; end;
end $$;
reset role;
select 'PASS: private contact masked, direct profile access restricted, private values preserved, custom categories and validation' as result;
