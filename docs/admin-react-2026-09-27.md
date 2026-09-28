# Migração administrativa para React — 27/09/2026

Todas as 21 telas administrativas ativas agora são páginas React servidas pelo Inertia: painel, acervo, cadastro/edição/listagem de livros, disponibilidade, categorias, autores, gêneros, configurações, equipe administrativa, primeiro acesso e verificação de e-mail. As rotas e seus nomes foram preservados.

## Organização

- `resources/js/pages/admin`: páginas por área (17 arquivos; categorias compartilham páginas parametrizadas).
- `resources/js/layouts/admin-layout.jsx`: layout, navegação por seção, mensagens e apresentação do primeiro acesso.
- `resources/js/features/admin`: cabeçalho, menu da conta, cards, tabela, campos, formulários de livro/categoria, upload com prévia, confirmação de exclusão, gráfico e campos de identidade/senha.
- Sidebar, Modal, SearchBar e InputError reutilizam componentes existentes.
- Cores e dimensões usam os tokens do Lumi. Estilos administrativos ficam em `resources/css/admin.css`, importado pelo layout React.
- O gráfico por gênero usa barras em HTML/CSS com rótulos e valores acessíveis; não depende de Chart.js via CDN.
- Nenhuma dependência adicionada.

## Integração e preservação do trabalho existente

Os controllers administrativos passaram de `view(...)` para `Inertia::render(...)`. Login administrativo e verificação de e-mail também navegam pelo Inertia. Mensagens de sucesso são compartilhadas pelo middleware.

Os redirecionamentos de edição/exclusão de autores e gêneros apontavam para URLs no singular inexistentes; agora usam os nomes das rotas existentes. Os demais contratos de gravação e validação foram mantidos, incluindo upload de capas, troca de senha, primeiro acesso, envio/verificação de e-mail e autorização. Models, migrations e definições de rotas não foram alterados nesta migração.

O formulário de edição de livro envia multipart por POST com `_method=put`, compatível com upload no Laravel. Os formulários apresentam erros e estado de envio; o primeiro campo inválido recebe foco. Exclusões exigem confirmação em modal, com restauração do foco.

As páginas Blade administrativas antigas e o script legado foram preservados no repositório para não apagar trabalho anterior, mas nenhuma rota ativa os renderiza. O Vite deixa de usar o entrypoint administrativo separado; todas as telas usam `resources/js/app.tsx`. O Blade raiz do Inertia permanece como estrutura de carregamento, conforme o padrão do sistema.

Os antigos links de configurações para logs e exclusão da própria conta apontavam apenas para `#`; não foram apresentados como funcionalidades prontas na nova tela. Não foram criados endpoints para essas ações.

## Verificação

- Build de produção e compilação SSR aprovados (SSR em execução não faz parte desta verificação).
- TypeScript, ESLint dos componentes migrados, Prettier, Pint e `git diff --check` aprovados.
- 21 testes administrativos/autenticação aprovados em execuções por grupos: AdminDesignTest, AdminReactCrudTest, AdminEmailVerificationTest e AuthenticationTest.
- Testes cobrem todas as rotas administrativas tanto no carregamento inicial quanto em visitas Inertia, acesso restrito, validação, categorias, upload de capa, edição/exclusão de livro, perfil, senha e primeiro acesso/verificação.
- Navegador Edge headless: 21 telas em 320, 768 e 1440 px (63 cenários), sem transbordamento horizontal da página. Tabelas usam rolagem interna. Capturas representativas inspecionadas.
- Interações verificadas no navegador: navegação sem recarregar o documento, sidebar mobile, menu da conta, Escape e restauração do foco, criação/edição/exclusão de autor, validação duplicada, edição de livro, filtros de disponibilidade, validação de senha, primeiro acesso e reenvio de verificação.
- Nenhum erro de JavaScript observado na varredura final.

Os testes visuais usaram contas e SQLite temporários em `%TEMP%/lumi-admin-react-20260927`, com transporte de e-mail em memória. O banco de dados real do projeto não foi usado para cadastrar ou editar registros.

Permanece o aviso preexistente de importação estática/dinâmica de BookDetailsContent no build SSR. A migração administrativa não altera os problemas de chat/denúncias documentados na revisão anterior.

O navegador de verificação e o servidor temporário foram encerrados. As alterações estão salvas, sem commit.
