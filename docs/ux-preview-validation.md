# Prévia UX/UI editorial

Esta alteração evolui o site existente para revisão em uma prévia da Vercel. Não inclui publicação em produção nem mudanças nas tabelas do Supabase.

## Mudanças

- Apresentação editorial com indicadores tipográficos, fotografia alinhada e contatos concentrados no rodapé.
- Container, espaçamentos, raios e controles compartilhados em `src/styles/portfolio.css`.
- Menu compacto com navegação por teclado, Escape e foco no conteúdo após selecionar uma seção.
- Portfólio em destaque, catálogo compacto e filtros que preservam todos os projetos.
- Mapa interativo do processo de construção no case do portfólio.
- Diálogos com foco contido, fundo inerte e restauração do foco ao fechar.
- Currículo com competências publicadas, retorno real da cópia e impressão sem o site ao fundo.
- Imagens WebP responsivas, fontes locais e metadados de compartilhamento.

## Validação executada

- TypeScript e build de produção: aprovados.
- Playwright em Chromium: 46 testes aprovados, incluindo login e publicação simulada, conflitos, enquadramento de fotos, filtros, diálogos, impressão e teclado.
- Larguras: 320, 375, 390, 430, 768, 1024 e 1440 px; orientação horizontal e viewport equivalente ao reflow de zoom de 200%.
- Movimento reduzido: transições e retorno ao topo verificados.
- Axe-core 4.14, regras WCAG A/AA até 2.2: nenhuma violação detectada em 34 estados (cinco seções em três larguras, claro/escuro; case e etapa Dados; currículo; biografia).
- Inspeção visual das telas inicial, projetos e case em desktop e da apresentação mobile.

## Limites e pendências

- Os testes usam dados controlados e respostas simuladas do Supabase; não publicam alterações no banco real.
- Testes automatizados não representam uma certificação WCAG. Leitura com VoiceOver/NVDA e validação em Safari/iPhone físico continuam recomendadas.
- O reflow equivalente ao zoom não substitui conferir o zoom nativo em navegadores e dispositivos reais.
- O build mantém os avisos existentes do Vite sobre `__dirname` e o tamanho do bundle principal. Os diálogos agora carregam sob demanda; a divisão adicional do bundle pode ser avaliada com métricas reais.
- Links diretos para cada seção e renderização de conteúdo para mecanismos de busca são evoluções separadas. O sitemap atual aponta apenas para a página pública real.

## Roteiro de revisão

1. Abrir a apresentação no celular e conferir os quatro indicadores, a foto e o rodapé.
2. Usar o menu e alternar o modo noturno; confirmar que a seção selecionada fica clara.
3. Abrir Projetos, explorar os filtros e entrar no case do portfólio; selecionar as cinco etapas do mapa.
4. Abrir o currículo e testar copiar, imprimir e fechar por Escape.
5. Confirmar o comportamento da área admin na prévia antes de autorizar o merge.
