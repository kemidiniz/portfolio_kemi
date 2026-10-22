# Publicar na Vercel

O endereço informado anteriormente foi `https://portfoliokemi-public.vercel.app/`. O campo Website do GitHub é apenas um link e não comprova que existe um deploy ativo. Confira o projeto, os deployments e os domínios no painel Vercel.

## 1. Enviar a versão atual ao GitHub

As alterações precisam estar em uma branch remota. Revise e integre a branch de implementação na branch de produção do projeto (normalmente `main`). Se o projeto Vercel já estiver conectado à branch de produção, esse envio pode iniciar um deploy automaticamente.

## 2. Importar ou conferir o projeto

Acesse https://vercel.com/dashboard com a conta/time que deve hospedar o site.

- Se o projeto já existir, abra **Settings → Git** e confirme `kemidiniz/portfolio_kemi` e a branch de produção.
- Se não existir, use **Add New → Project**, conecte o GitHub e importe `kemidiniz/portfolio_kemi`.
- A pasta raiz é a raiz deste repositório, sem subpasta.
- Framework: **Vite**. Node.js: **24.x**.
- Install Command: `npm ci --legacy-peer-deps`.
- Build Command: `npm run build`.
- Output Directory: `dist`.

O arquivo `vercel.json` registra os comandos e a saída. `package.json` fixa Node 24. O comando de instalação resolve o conflito de peer dependencies existente no projeto.

## 3. Configurar o Supabase na Vercel

Este portfólio já inclui a URL e a chave publicável em `src/config/publicSupabase.ts`. A área admin pode conectar também em prévias sem variáveis configuradas. Para substituir a conexão, adicione em **Settings → Environment Variables**, para Production e Preview:

| Nome | Valor |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://exlthhgqgbxlngpnxrqs.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | A chave pública publishable do projeto, disponível em Supabase → Settings → API Keys |

A chave publishable é pública e pode estar no frontend. Nunca use `service_role` ou uma chave secret neste campo. `.env.local` fica só na máquina de desenvolvimento e não é enviado ao GitHub.

O Vite incorpora essas variáveis no build: se adicioná-las ou alterá-las depois, faça um novo deploy.

## 4. Publicar e conferir o domínio

Clique em **Deploy** ou, em um projeto existente, abra **Deployments → último deployment → Redeploy**. Aguarde o estado **Ready**.

Em **Settings → Domains**, confira qual endereço está associado ao projeto. Se desejar, tente adicionar `portfoliokemi-public.vercel.app`; esse nome precisa estar disponível para a sua conta. Se já pertencer a outro projeto, use o endereço que a Vercel disponibilizar ou gerencie o projeto original.

Se houver erro:

- `DEPLOYMENT_NOT_FOUND`: confira se o domínio aponta para um deployment existente e para o projeto/time correto.
- Erro no build: abra os logs e confirme os comandos acima.
- Tela do portfólio, mas dados remotos indisponíveis: confirme variáveis do build e a migração do Supabase.
- Link do GitHub leva ao endereço errado: atualize **About → Website** no repositório depois de confirmar o novo endereço.

## 5. Conferir o conteúdo e o acesso admin

A migração, criação da conta e autorização estão em [supabase/README.md](supabase/README.md). Abra o site publicado, entre em **Área admin** e publique o conteúdo. Confira a alteração em outra sessão sem login.

O login atual usa e-mail e senha, sem redirecionamento. Se configurar recuperação de senha ou links mágicos futuramente, configure também Site URL e Redirect URLs no Supabase Auth com o domínio publicado.
