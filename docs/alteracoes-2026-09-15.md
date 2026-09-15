# Atualização de 15/09/2026

## Comunidade e publicações

- Curtir, descurtir, salvar e remover posts salvos, com contadores persistidos no banco.
- Publicar comentários, editar e excluir as próprias publicações e excluir comentários conforme a permissão do leitor.
- Compartilhar pelo recurso do navegador ou copiar o link direto da publicação.
- Consultar publicações salvas e acessar perfis pelos autores.
- Sugestões de leitores com busca, seguir/deixar de seguir e lista de pessoas adicionadas.
- Conversas privadas em pop-up, envio persistente, mensagens anteriores e contagem de mensagens não lidas.
- Atualização periódica das conversas e destaque dos posts com mais interações nos últimos sete dias.
- Acesso às pessoas e conversas também em telas pequenas; remoção dos indicadores fictícios de presença online.

## Notificações e acesso rápido

- Sino abre um pop-up com notificações reais de curtidas, comentários e novos seguidores.
- Paginação, marcação como lidas e abertura do post ou perfil correspondente.
- Regras da sala e configurações de privacidade em pop-ups.
- Histórico pessoal com busca e filtros para progresso de leitura, livros salvos e avaliações.
- Preferências persistentes para avaliações públicas e notificações sociais, também disponíveis no perfil.
- Avaliações privadas ocultam o comentário e a autoria para outros leitores; a nota continua contribuindo para a média.

## Catálogo e estante

- Detalhes do livro em pop-up amplo, com fundo translúcido, rolagem e retorno ao elemento que abriu o diálogo.
- Conteúdo compartilhado entre o pop-up e a página de detalhes acessada diretamente.
- Corações na extremidade dos cards permitem favoritar sem abrir os detalhes.
- Botão de adicionar na aba Estante abre uma seleção de livros com busca.
- Ajustes de responsividade e separação dos controles interativos nos cards.

## Dados de demonstração e arquivos

- Dez publicações sobre livros do catálogo, com 29 curtidas, 20 comentários e cinco imagens de capas.
- `PostSeeder` usa contas de demonstração e completa até cinco participantes quando necessário.
- Reexecutar o seeder preserva os posts existentes e não duplica os exemplos inalterados nem suas interações.
- As 12 capas existentes foram transferidas para `database/seeders/assets/covers`, mantendo uma origem versionada.
- `BookSeeder` copia as capas ausentes para o armazenamento público e preserva arquivos que já existem.
- A preferência por React como base das interfaces está registrada em `AGENTS.md`.

## Correções encontradas na revisão

- Recuperação de senha e envio de verificação de e-mail: inclusão do suporte a notificações no modelo de usuário.
- Primeiro acesso administrativo: e-mail opcional, preservação do endereço atual, envio da verificação, redirecionamento correto e tratamento de falha de SMTP.
- Unificação do destino de verificação e do formulário de reenvio.
- Restrição das rotas de primeiro acesso administrativo por perfil e validação do titular nos links legados de verificação.
- Senha e token de autenticação ocultos na serialização de usuários; perfis públicos recebem somente os campos necessários.
- Exclusão de conta com posts e interações dentro de uma transação, preservando os posts de outros leitores.
- Testes de regressão para permissões, privacidade, exclusão de conta e reprodução do feed de demonstração.

## Validação antes do commit

| Verificação | Resultado |
| --- | --- |
| `php artisan test --compact` | 72 testes aprovados; 990 asserções |
| `npm run build` | Build de produção aprovado |
| ESLint no repositório | Aprovado |
| Prettier nos arquivos JavaScript/React alterados | Aprovado |
| Laravel Pint nos arquivos PHP alterados | Aprovado |
| `git diff --check` | Sem erros |
| Seed em banco SQLite de teste e armazenamento isolado | Contagens, imagens, preservação e repetição verificadas |

Os testes usam SQLite. Não foram executados testes visuais em navegador, integração com SMTP real ou validação em MySQL nesta revisão. O histórico apresenta o estado dos registros atuais, sem constituir um registro permanente das ações excluídas. O chat usa consultas periódicas, sem WebSocket.

## Atualização de outra instalação

1. Atualizar o código e instalar as dependências conforme os arquivos de lock.
2. Executar `php artisan migrate` para criar as tabelas de interações, notificações e mensagens e as preferências dos leitores.
3. Executar `php artisan storage:link` se o vínculo do armazenamento público ainda não existir.
4. Executar `npm ci` e `npm run build` para gerar os arquivos da interface.
5. Em uma instalação de demonstração com autores, gêneros e disponibilidades cadastrados, executar `php artisan db:seed --class=BookSeeder` e depois `php artisan db:seed --class=PostSeeder`.

O banco local, uploads e arquivos de configuração privados não são transportados pelo commit. Os seeders gerais antigos contêm contas e senhas de demonstração e não devem ser utilizados para provisionar contas reais em produção. A revisão não substitui uma auditoria completa de segurança ou de desempenho.
