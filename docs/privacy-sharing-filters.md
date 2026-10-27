# Compartilhamento, contato privado e filtros

## Alterações da interface

- Nova miniatura Open Graph/Twitter de 1200 × 630, em URL versionada, usando o nome, título e foto publicados no admin. A imagem não modifica a foto armazenada nem os dados profissionais.
- WhatsApp removido dos contatos públicos; campos antigos não aparecem mais no editor. O número não consta mais nos dados de apresentação do código.
- A primeira renderização do conteúdo aguarda o conteúdo publicado e as fontes. A imagem de apresentação não aparece antes da foto do admin e o retrato não sofre zoom no hover.
- Filtros derivados dos projetos publicados: categorias vazias desaparecem. Categorias novas usam o identificador e o nome cadastrados no projeto. As quatro categorias anteriores mantêm seus rótulos conhecidos.
- O campo Categoria do editor aceita novos identificadores, com sugestões das categorias anteriores. Nenhum registro foi editado ou republicado por esta implementação.

## Etapa necessária no Supabase

Executar o arquivo completo `supabase/migrations/202610270001_public_privacy_categories.sql` no SQL Editor. A implantação na Vercel não executa migrações do banco automaticamente. Neste ambiente não há conexão administrativa para executar esse SQL remotamente.

O arquivo é transacional e idempotente. Ele não contém atualizações nos registros publicados. Modifica funções, permissões e políticas para:

1. Mascarar `whatsapp` e `whatsappDisplay` na resposta pública de `read_portfolio`.
2. Restringir leitura direta de `portfolio_profile` a contas administradoras; a função pública entrega o perfil sem os campos privados.
3. Preservar os valores legados de contato no banco quando uma administradora publica outros campos a partir da resposta mascarada. Os valores não voltam a ser expostos na API pública.
4. Aceitar categorias novas na validação do servidor, mantendo limites e as demais validações existentes.

Sem esse SQL, o link do WhatsApp sai da interface, mas os valores antigos continuam acessíveis pela API, e o servidor continua recusando categorias novas. Editar projetos nas categorias existentes continua funcionando.

## Verificações

- Testes PostgreSQL em contêiner temporário: anonimato, autorização administrativa, conflitos de revisão, validação, rollback, leitura privada, mascaramento público, preservação do contato e publicação de categorias novas. Migração reaplicada para testar idempotência.
- Testes Playwright: foto publicada como primeira imagem, ausência de zoom, categorias dinâmicas em desktop/mobile, cadastro de categoria no admin, miniatura e contatos públicos.
- Leituras do projeto real são somente públicas; não foi chamada a função de publicação nem editado conteúdo no Supabase de produção.

Os aplicativos de compartilhamento podem manter miniaturas antigas em cache até refazerem a leitura do link; a nova imagem usa uma URL diferente para facilitar essa atualização.

## Aplicação e verificação em produção

A usuária executou o SQL e confirmou “Success. No rows returned”. A leitura anônima posterior mostrou os dois campos de WhatsApp vazios e acesso direto ao perfil recusado (HTTP 401). A revisão pública permaneceu em 17, a mesma observada antes da migração.

A leitura de publicações posteriores à revisão original agora preserva exatamente os campos cadastrados: correções legadas automáticas ficam restritas às revisões 0/1. Testes cobrem textos e destaques personalizados que coincidam com os antigos valores de apresentação.

Validação: 68 testes Playwright aprovados na execução completa; os testes específicos de preservação de conteúdo foram repetidos após a restrição das correções legadas. TypeScript, build e integração PostgreSQL aprovados. Confirmação de carregamento real: a foto passou de duas fontes sucessivas (apresentação e publicada) para somente a fonte publicada.
