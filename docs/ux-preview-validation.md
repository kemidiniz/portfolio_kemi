# Validação da prévia UX/UI

Entrega no PR #8, com publicação em produção solicitada e autorizada pela Kemily. Domínio oficial: https://portfoliokemi-public.vercel.app/. As tabelas do Supabase não foram alteradas.

## Escopo final

- Paleta global `#180101`, `#c2141d` e `#f7fadb`, incluindo modo noturno, cabeçalho, rodapé, currículo e admin, conforme a confirmação da Kemily. Tons auxiliares usam misturas/transparências dessas cores.
- Quatro indicadores da apresentação em cards de vidro: uma linha no desktop, grade 2 × 2 em tablet/mobile. Mesmos textos e números; mesma fotografia, ligeiramente menor no desktop.
- Cards de experiência com entrada por interseção, opacidade e deslocamento de 20 px em 600 ms, com sequência de até 120 ms entre entradas iniciais. Ícone de carreira ao lado do título.
- Projetos no carrossel horizontal, sem destaque para o portfólio. Filtros, conteúdos, imagens, links e modal de detalhes preservados.
- Movimento de aproximadamente 18 px/s, loop com conjuntos visuais equivalentes. Cópias ficam fora da árvore acessível e da sequência Tab. Modal, foco, hover, toque, aba oculta e carrossel fora da tela suspendem o movimento. Há pausa explícita, preservada ao filtrar.
- Navegação manual por setas, teclado e gesto nativo de deslizar. Com movimento reduzido, não há autoplay. Quando todos os projetos do filtro cabem na tela, o movimento e as setas ficam desativados.
- História no modal, reutilizando todo o conteúdo original. Sobreposição, rolagem interna, Escape, clique fora, fechamento visível, contenção/restauração de foco e posição da página preservada.
- Reprograma passa a usar o mesmo padrão `surface-card` dos cards equivalentes.
- Nenhuma dependência adicionada. Biblioteca de animação `motion`, já instalada, reutilizada.

## Evidências

- `npm run lint`: aprovado (TypeScript).
- `npm run build`: aprovado.
- 62 cenários Playwright aprovados, incluindo os testes de regressão atualizados para a história em modal, cards em linha e remoção do destaque.
- Larguras: 320, 375, 390, 430, 768, 1024 e 1440 px. Sem overflow horizontal da página; sem corte dos indicadores ou conteúdo dos modais.
- Teclado, toque sintetizado pelo Chromium, loop, hover, pausa explícita, pausa entre filtros, retorno de foco, rolagem e preferência por movimento reduzido verificados.
- Regressões de login, edição/publicação simulada, conflitos e enquadramento de fotos verificadas.
- Sem erros JavaScript nos cenários de responsividade das novas interações.
- Axe-core 4.14, regras WCAG A/AA até 2.2: nenhuma violação detectada em 39 estados. Inclui cinco seções em três larguras e ambos os temas, os modais de história, currículo e projeto em claro/escuro, etapa Dados e entrada do admin em ambos os temas.
- Inspeção visual da apresentação e do carrossel no desktop, apresentação mobile e história em ambos os temas.

## Limites

- Testes de publicação/admin usam respostas controladas do Supabase; não escrevem no banco real.
- Automação não certifica conformidade WCAG. Safari, iPhone físico e leitura com VoiceOver/NVDA não foram executados neste ambiente.
- O reflow equivalente a zoom de 200% foi verificado; não substitui conferir o zoom nativo nos dispositivos reais.
- Permanecem os avisos do Vite sobre configuração futura com `__dirname` e bundle principal maior que 500 kB. A biblioteca de animação existente aumenta o JavaScript da entrada; não houve instalação de novas bibliotecas.
- Imagens existentes foram preservadas. A captura estática do projeto do portfólio continua representando a versão anterior; não é uma prévia sincronizada do layout atual.

## Arquivos desta etapa

- `src/App.tsx`: abertura dos modais sem substituir a apresentação.
- `src/components/BiographyModal.tsx`: novo modal reutilizando `About` e o controle de foco existente.
- `src/components/{Hero,Experience,Projects,ProjectModal,EducationAndAI}.tsx`: cards, animações, carrossel e padronização de hover.
- `src/components/{About,ResumeModal}.tsx`: aplicação da paleta a cores literais existentes.
- `src/index.css`, `src/styles/portfolio.css`: paleta e remoção do tratamento especial de destaque.
- `src/styles/interactions.css`, `src/main.tsx`: estilos responsivos das interações solicitadas.
- `tests/{portfolio,ux-preview,interaction-refinements}.spec.ts`: regressões e cenários de aceitação.

## Ajuste final e publicação

- Removidos do layout visual o título, a contagem e a orientação acima dos projetos. A contagem e a orientação continuam disponíveis para leitores de tela.
- Controles de pausa e navegação deslocados para baixo do carrossel.
- Todas as cinco páginas usam a entrada de 460 ms, com opacidade e deslocamento de 14 px, respeitando movimento reduzido.
- Teste de hover aguarda o término da entrada da página para validar o destaque isoladamente.
