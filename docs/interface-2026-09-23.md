# Interface do Lumi — concluída em 26/09/2026

## Escopo e referência

Aplicar componentização, consistência, responsividade e acessibilidade em toda a interface, preservando funcionalidades e arquitetura Laravel/Inertia. Como não foi fornecida imagem externa, a referência é a identidade visual atual do Lumi. React é a base dos componentes novos. Telas Blade existentes mantêm contratos de formulário.

## Alterações entregues

- Paleta Lumi centralizada em `resources/css/app.css`, foco visível global e preferência por movimento reduzido no CSS e Framer Motion.
- Sidebar móvel e Modal compartilhado usam Radix existente: foco, Escape, bloqueio de rolagem e fechamento ao navegar/mudar para desktop. Skip link, áreas de rolagem e topbar adaptados para telas estreitas.
- Home e catálogo reutilizam os drawers de gêneros e progresso. Adicionar/remover leituras mantém o painel e os rascunhos; fechar salva o progresso com tratamento de erro.
- Cards e perfis receberam ajustes de largura e ações reais. A criação de publicações mostra processamento e erros. Removido um modal de publicação antigo, sem acionador, que apenas simulava envio.
- Autenticação secundária usa o mesmo layout do login/cadastro. Checkbox de lembrar acesso ligado ao formulário; labels, mensagens e teclado revisados. Configurações usam o layout do leitor, e alteração de senha usa a rota correta do leitor.
- Links da landing levam a seções existentes; botão de ajuda abre diálogo com orientações. A composição e a paleta originais foram preservadas.
- Acervo administrativo interativo em React: busca, filtros por disponibilidade real, contagem, estado vazio e ação de edição. Formulários Blade existentes continuam integrados; corrigidos links de cadastro, foco do upload, rótulos, tabelas e apresentação do perfil. Controles de foto que não enviavam dados foram removidos.
- Entrada `admin.css` adicionada ao Vite e preâmbulo React ao layout administrativo. O login de administradores agora usa navegação completa para chegar às páginas Blade, coberto por dois testes novos.
- Inicialização opcional do Echo: a ausência de chave Reverb não impede a montagem da aplicação. Adicionado token CSRF ao documento, utilizado pelo fetch do chat.

## Verificação

| Verificação | Resultado |
| --- | --- |
| `npm run build:ssr` | Build cliente e bundle SSR aprovados. Aviso não bloqueante: BookDetailsContent é importado de forma estática e dinâmica. |
| TypeScript e ESLint | Aprovados. |
| Prettier dos arquivos JS/TS/CSS alterados | Aprovado. |
| Laravel Pint nos dois arquivos PHP alterados | Aprovado. |
| `git diff --check` | Aprovado. |
| Suíte PHP completa, após gerar assets | 69 passaram; 4 falhas preexistentes em SocialCommunityTest, descritas abaixo. |
| Autenticação + AdminDesignTest, após corrigir login administrativo | 9 passaram, 136 asserções, incluindo os dois testes novos. |
| Edge headless, com banco e contas temporários | 38 rotas em 320, 768 e 1440 px: 114 cenários, sem transbordamento horizontal da página nem exceções JavaScript. Configurações revalidadas nos três tamanhos após unificação de layout. |
| Interações no navegador | Menus, Tab/Escape/restauração de foco, skip link, resize, filtros/busca/estado vazio, edição administrativa, gêneros, progresso persistido e rascunhos, detalhes de livros, publicação real de teste, validação de senha, tema e movimento reduzido. |

Screenshots representativos de landing, login, catálogo, home, comunidade, perfil, configurações e administração foram inspecionados. Não houve comparação de pixels com um design externo, pois não foi fornecido. Artefatos auxiliares e banco de teste ficam em `%TEMP%/lumi-ui-20260926`; logs de build/testes também ficam em `%TEMP%`.

## Limitações existentes

- As quatro falhas PHP usam as antigas rotas `/messages/{id}` e tabela `direct_messages`. O backend atual usa `/chat/send`, `conversations`, `conversation_users` e `messages`. Essa migração de contrato já estava na base e não foi revertida; a validação do serviço Reverb em tempo real está fora desta entrega.
- O diálogo de denúncias do feed já era um protótipo: apenas registra o texto no console, e a rota `posts.report` aponta para salvar publicação. A implementação de denúncias e sua regra de negócio não foram inventadas nesta revisão visual.
- O bundle SSR foi compilado; não foi implantado nem validado um serviço SSR de produção.

Na retomada de 23/09, o Git estava limpo e as alterações da tentativa anterior não estavam presentes. O trabalho foi retomado dessa base e continuado em 26/09. Alterações salvas no workspace, sem commit. As verificações interativas usaram exclusivamente banco SQLite e contas temporários; nenhum dado do banco de uso do projeto foi alterado. Se houver nova interrupção, conferir `git status` e este registro antes de retomar.
