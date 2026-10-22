# Portfólio com Supabase

## Conectar o projeto

A conexão pública deste portfólio está definida em `src/config/publicSupabase.ts`, para funcionar também em prévias sem variáveis de ambiente. Essas informações são públicas; as permissões de edição são verificadas pelo banco. Para usar outro projeto, substitua essa configuração ou defina `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` (ou `VITE_SUPABASE_ANON_KEY`) no `.env.local` e no provedor de hospedagem antes do build. Nunca use uma chave `service_role`/secret no navegador. Reinicie o Vite após alterar as variáveis.

1. No painel do seu projeto Supabase, abra **SQL Editor** e execute o arquivo completo [202610220001_portfolio_cms.sql](migrations/202610220001_portfolio_cms.sql). Execute uma vez; a transação inteira é revertida se houver erro. Confira antes se já existem tabelas com esses nomes. Alternativa com projeto vinculado e CLI autenticada: `supabase db push`.
2. Em **Authentication → Users → Add user**, crie a conta de administração com seu e-mail e uma senha forte. Confirme o e-mail pelo fluxo do Supabase ou pela opção administrativa apropriada. Não há cadastro público na interface.
3. Autorize essa conta pelo SQL Editor, substituindo apenas o e-mail abaixo. O usuário deve existir primeiro:

```sql
do $$
declare admin_id uuid;
begin
  select id into admin_id from auth.users where lower(email) = lower('SEU_EMAIL_AQUI');
  if admin_id is null then raise exception 'Crie primeiro a conta em Authentication > Users'; end if;
  insert into public.portfolio_admins(user_id) values(admin_id) on conflict do nothing;
end;
$$;
```

4. No site, abra **Área admin**, entre com a conta autorizada e clique em **Publicar alterações** para carregar os dados iniciais no banco. O conteúdo existente nunca é substituído automaticamente pela aplicação. Antes da primeira publicação, aparece a apresentação incluída no projeto.
5. Abra o site em outra sessão para confirmar que o conteúdo publicado aparece. Uma conta autenticada que não esteja em `portfolio_admins` não consegue editar.

Para revogar acesso: `delete from public.portfolio_admins where user_id = 'UUID_DA_CONTA';`. A revogação é aplicada imediatamente às publicações e uploads pelo banco; a interface atualiza a permissão na próxima verificação de sessão.

## Organização e segurança

| Tabela | Conteúdo |
| --- | --- |
| `portfolio_profile` | Perfil, contatos, biografia, valores e indicadores |
| `portfolio_projects` | Projetos e publicações |
| `portfolio_experiences` | Experiências profissionais |
| `portfolio_education` | Formação acadêmica |
| `portfolio_immersions` | Cursos, eventos e comunidades |
| `portfolio_certifications` | Certificações |
| `portfolio_skills` | Grupos de habilidades e níveis |
| `portfolio_state` | Revisão e data da última publicação |
| `portfolio_admins` | Contas autorizadas; não aceita autopromoção pelo cliente |

Cada coleção guarda itens JSONB validados e sua posição. O banco aplica RLS e bloqueia escrita direta pelo cliente. `save_portfolio` verifica a autorização, valida a estrutura e publica todas as seções em uma transação. A revisão impede que duas sessões sobrescrevam alterações silenciosamente. `read_portfolio` retorna um retrato consistente e público. Não coloque dados privados nas informações publicadas.

Imagens são enviadas ao bucket público `portfolio-media`, com permissão de upload exclusiva para admins, limite de 5 MB e tipos JPG/PNG/WebP. URLs próprias também são aceitas. Imagens enviadas e depois descartadas no rascunho permanecem no bucket; limpe arquivos sem referência pelo painel Storage quando necessário. Não há exclusão automática de imagens para preservar links publicados.

A edição cobre todas as propriedades de `PortfolioData`, inclusive ordem de itens, projetos em destaque, contatos, currículo, biografia e indicadores. Os rótulos fixos de navegação e a estrutura visual pertencem ao código. As alterações ficam em memória até publicar; exporte o rascunho se precisar guardá-lo sem publicar. Conteúdo antigo do localStorage não é publicado ou importado automaticamente.

## Desenvolvimento e validação

```bash
npm ci --legacy-peer-deps
npm run dev
npm run lint
npm run build
npx playwright install chromium
npm test
npm run test:db # Docker: PostgreSQL 17 isolado, removido ao final
```

A opção `--legacy-peer-deps` contorna o conflito preexistente entre esbuild e o peer opcional do Vite. Há um lockfile para instalações reproduzíveis. Se Chromium já estiver instalado, execute `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm test`.

Os testes de navegador simulam as respostas Supabase para verificar a interface, o login, as permissões e os erros sem tocar nos dados reais. Os testes de banco executam a migração real em PostgreSQL, com estruturas mínimas que representam Auth/Storage do Supabase, e verificam permissões, rollback, conflitos e leitura pública. Eles não substituem o teste final no projeto Supabase conectado.

O domínio `exlthhgqgbxlngpnxrqs.supabase.co` precisa estar liberado na rede do ambiente. As configurações de rede/variáveis salvas no rascunho só passam a valer pelo fluxo de configurações do ambiente.
