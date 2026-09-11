# Refatoração da interface — concluída em 11/09/2026

Objetivo: componentizar a interface React/Inertia sem redesign, alterações de rotas, contratos ou regras de negócio. Trabalho original do usuário: Git estava limpo no início. Não houve commits nem comandos destrutivos.

## Já salvo

- Home e catálogo usam `layouts/reader-layout.jsx`, filtros, gêneros, cards, progresso e estados vazios extraídos.
- Login, cadastro e welcome usam componentes em `features/auth`, `features/landing` e `layouts/reading-auth-layout.jsx`.
- Sidebar, Topbar, ProfileMenu, Modal, SearchBar e UserAvatar criados; navegação centralizada em `constants/navigation.js`.
- Features de posts e perfis extraídas; social/newPost/personalProfile/userProfilePage integradas em ReaderLayout.
- ESLint agora inclui JSX e reconhece o global Ziggy `route`.

## Resultado e decisões

- Páginas agora compõem layouts e features; navegação, dropdown, senhas, compositor, curtidas, preferências e visualização do feed mantêm estado próximo do uso.
- Preservados Tailwind, JSX/TSX existentes, rotas, contratos, dados estáticos originais, filtros diferentes da Home/catálogo, animações e layouts responsivos.
- Nenhuma dependência, Context ou biblioteca global adicionada. Componentes TSX já existentes continuam disponíveis. Backend e views Blade não foram modificados.
- Componentes compartilhados recebem dados, callbacks, variantes e conteúdo opcional. Acessibilidade inclui labels, aria-pressed, aria-expanded, navegação por teclado, Escape e restauração/contenção de foco em painéis e modal.
- Busca social mantém classes próprias e comportamento original, sem implementar uma busca que não existia.
- Temporários de extração e comparação removidos. Alterações salvas no workspace, sem commit.

## Validação final

| Comando ou verificação | Resultado |
| --- | --- |
| `npm run lint -- --no-fix` | Passou, incluindo JSX; `--no-fix` evita alterações automáticas fora do escopo. |
| Prettier nos arquivos alterados/criados | Passou. |
| `npm run format:check` | Apenas 3 pendências preexistentes: app.tsx, components/app-header.tsx, ssr.jsx. |
| `npx tsc --noEmit` | Mesmo TS2344 preexistente em auth/reset-password.tsx:24. |
| `npm run build:ssr` | Build cliente e bundle SSR passaram. O resolver SSR preexistente continua limitado a TSX. |
| `php artisan test --compact` | 26 passaram, 2 falharam, 75 assertions; mesmas falhas da base. |
| `git diff --check` | Passou. Diff restrito a interface React, cobertura JSX do lint e este registro. |
| Comparação estática ReactDOMServer | 26 cenários equivalentes, com fixtures, estados vazios, dropdowns abertos, modal e perfil em feed. |
| Checagens isoladas de callbacks/estado | Passaram: gênero, seguir/deixar de seguir e callbacks de sucesso, conteúdo/disabled/payload do compositor, curtir/descurtir e contadores, troca do perfil para feed. |

A comparação usou páginas originais obtidas por `git show HEAD:resources/js/pages/...`, transpile em memória, ReactDOMServer e Inertia mockado. Comparou textos, imagens, links, valores, estilos inline e classes normalizadas. Considerou labels invisíveis, classes de foco, reposicionamento de overlay fixo e equivalência do item de leitor convertido de div clicável em button (`w-full text-left`). Não foi um teste E2E em navegador, nem validação de pixels ou APIs reais. Scripts temporários foram removidos depois da execução. Logs auxiliares ficaram em `%TEMP%/lumi-render-comparison.jsonl` e `%TEMP%/lumi-refactor-tests-final.txt`.

## Árvore dos arquivos criados ou modificados

Todos os arquivos da lista abaixo pertencem à entrega. Demais componentes, estilos e arquivos de configuração existentes foram preservados.

```text
eslint.config.js
REFACTOR_PROGRESS.md
resources/js/
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx
│   │   ├── Topbar.jsx
│   │   └── ProfileMenu.jsx
│   └── shared/
│       ├── EmptyState.jsx
│       ├── Modal.jsx
│       ├── QuickAccessPanel.jsx
│       ├── SearchBar.jsx
│       ├── SectionHeader.jsx
│       └── UserAvatar.jsx
├── constants/
│   ├── genres.js
│   └── navigation.js
├── features/
│   ├── auth/
│   │   ├── auth-field.jsx
│   │   ├── auth-footer.jsx
│   │   ├── auth-submit-button.jsx
│   │   └── password-field.jsx
│   ├── books/
│   │   ├── BookCard.jsx
│   │   ├── BookFilters.jsx
│   │   ├── BookGrid.jsx
│   │   ├── GenreQuickSelect.jsx
│   │   └── ReadingProgressCard.jsx
│   ├── landing/
│   │   ├── landing-hero.jsx
│   │   ├── landing-navbar.jsx
│   │   ├── reading-preview.jsx
│   │   └── reading-progress-item.jsx
│   ├── profile/
│   │   ├── CreatePostModal.jsx
│   │   ├── FollowButton.jsx
│   │   ├── PreferencesPanel.jsx
│   │   ├── PreferenceToggle.jsx
│   │   ├── ProfileBookHistory.jsx
│   │   ├── ProfileBookItem.jsx
│   │   ├── ProfilePostCard.jsx
│   │   ├── ProfilePosts.jsx
│   │   ├── ProfileReaderSidebar.jsx
│   │   ├── ProfileReviews.jsx
│   │   ├── ProfileStatCard.jsx
│   │   ├── ProfileSummary.jsx
│   │   ├── ReadingRules.jsx
│   │   └── profile-data.js
│   └── social/
│       ├── PostBookCard.jsx
│       ├── PostCard.jsx
│       ├── PostComment.jsx
│       ├── PostComments.jsx
│       ├── PostComposer.jsx
│       ├── PostFeed.jsx
│       └── ReaderListItem.jsx
├── hooks/use-focus-trap.js
├── layouts/
│   ├── reader-layout.jsx
│   └── reading-auth-layout.jsx
└── pages/
    ├── auth/login.jsx
    ├── auth/register.jsx
    ├── home.jsx
    ├── catalogo.jsx
    ├── social.jsx
    ├── newPost.jsx
    ├── personalProfile.jsx
    ├── userProfilePage.jsx
    └── welcome.jsx
```

Responsabilidades: layout controla a estrutura/navegação; shared oferece busca, avatar, modal, cabeçalhos, estados vazios e atalhos; books compõe filtros e apresentação de livros; social compõe posts/comentários/compositor e leitores; profile compõe resumo, métricas, histórico, avaliações, preferências e publicação; auth compartilha formulários; landing organiza a apresentação e seu progresso interativo.

## Base de validação antes das mudanças

- `npx eslint . --no-fix`: passou, mas configuração original não incluía JSX.
- `npx tsc --noEmit`: erro preexistente TS2344 em `pages/auth/reset-password.tsx:24`, ResetPasswordForm sem index signature.
- `npm run build`: passou fora do sandbox (esbuild teve spawn EPERM dentro dele).
- `php artisan test --compact`, após build: 26 passaram, 2 falharam: redirecionamento em email can be verified e dashboard de visitante retornando 200 em vez de redirecionamento. Primeiras execuções também tiveram bloqueios de escrita/manifesto ausente.
- Formatação preexistente pendente em app.tsx, components/app-header.tsx e ssr.jsx, além de páginas agora refatoradas.
- Sem script de teste frontend ou typecheck no package.json; TypeScript executado diretamente.

## Limitações preexistentes identificadas

- `PostController.store` vazio e rota `posts.store` ausente. A consulta do feed foi corrigida no ajuste posterior abaixo.
- Checkbox remember no login não atualiza useForm.
- Resolver cliente força .jsx e SSR só resolve .tsx; incompatibilidade com conjunto misto de páginas.
- Modal pessoal sem gatilho de abertura; preferências locais e dados estáticos já existentes.
- Landing tem âncoras sem destinos e suporte sem callback.

Não há etapa de implementação pendente desta refatoração. Se a tarefa for retomada, ler este registro e conferir `git status` antes de editar; problemas preexistentes acima exigem escopo separado. Validação visual interativa em navegador permanece uma limitação da entrega.

## Ajuste posterior — publicações ausentes no Social

Após o usuário confirmar que faltavam as publicações, a consulta somente de leitura confirmou a tabela `posts` existente e com zero registros no banco local. O controller também não consultava essa tabela.

- Criado `app/Models/Post.php`, com relações de autor da publicação e livro.
- Atualizado `app/Http/Controllers/SocialController.php` para enviar publicações existentes, mais recentes primeiro, no formato dos cards, carregando relações antecipadamente.
- Atualizado `resources/js/features/social/PostFeed.jsx` para mostrar um estado vazio explícito sem criar publicações fictícias.
- Criado `tests/Feature/SocialFeedTest.php`: 3 testes passaram, 43 assertions (ordem/dados/contrato, feed vazio e acesso autenticado). ESLint do componente, sintaxe PHP e diff check passaram.
- Nenhum registro local foi inserido e nenhuma migration foi executada. O fluxo de criação de publicações continua sem endpoint de gravação; não foi implementado como parte deste ajuste de exibição.
