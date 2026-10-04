# Chat em tempo real

O chat usa Laravel Reverb e canais privados. A página da comunidade escuta `chat.user.{id}` mesmo com o diálogo fechado. Novas mensagens, criação de grupos, remoção de participantes e exclusão de grupos atualizam as conversas. Após conectar ou reconectar, a página busca novamente o histórico.

O evento da lista envia apenas o identificador da conversa e sinais de remoção/exclusão. O conteúdo é carregado pelo servidor com a autorização atual. Os canais de mensagens dos grupos continuam restritos aos participantes.

## Desenvolvimento local

1. Copiar as variáveis `REVERB_*` e `VITE_REVERB_*` de `.env.example` ao configurar outro ambiente. Gerar um segredo próprio para `REVERB_APP_SECRET`, por exemplo com `php -r "echo bin2hex(random_bytes(32));"`.
2. Usar `BROADCAST_CONNECTION=reverb` e `QUEUE_CONNECTION=database`.
3. Executar `php artisan migrate` e `php artisan config:clear`.
4. Executar `composer dev`. Esse comando inicia o servidor Laravel, o worker, o Vite e o Reverb na porta 8080.

O ambiente local deste workspace já recebeu as variáveis. Em acesso por outro computador, definir `VITE_REVERB_HOST` com o endereço acessível do servidor; `127.0.0.1` atende o navegador na mesma máquina. Reiniciar o Vite ou recompilar os assets após alterar essas variáveis. Em produção com HTTPS, configurar o host público e `REVERB_SCHEME=https`, TLS/proxy e processos supervisionados.

## Testes

`php artisan test --compact` valida os contratos atuais (`/chat/send`, `conversations`, `conversation_users`, `messages`), os destinatários dos eventos e a autorização dos canais. `node --test tests/js/chat-realtime.test.mjs` verifica atualização sem diálogo, reconexão, eventos durante recarga e limpeza da inscrição.

O PHPUnit desativa SSR e integrações externas por padrão. Os testes de moderação habilitam explicitamente a integração com respostas simuladas, evitando o uso da chave real do ambiente.

## Validação em 04/10/2026

- Suíte PHP completa: 124 testes aprovados, 2.018 asserções.
- Testes JavaScript do canal da comunidade: cinco aprovados.
- Build de produção, TypeScript, ESLint, Pint e formatação aprovados.
- Edge headless com sessões separadas, três leitores e banco SQLite temporários: primeira mensagem com diálogo já aberto, convite com diálogo fechado, mensagem em grupo, recuperação após reconexão e remoção do participante aprovados, sem exceções JavaScript.
- Chamada real ao serviço de moderação com uma frase fictícia sem dados pessoais: concluída com `omni-moderation-latest`, 13 categorias e texto não sinalizado.

Um arquivo `public/hot` apontava para um Vite desligado. Ele foi retirado para que o Laravel servisse os assets compilados; `composer dev` recria esse arquivo quando o Vite é iniciado.

## Correção do envio após login

O login pelo Inertia regenera o token da sessão sem substituir o documento. O token da tag `meta` fica antigo e fazia os `fetch` do chat retornarem 419. Mensagens e gerenciamento de grupos agora leem o cookie `XSRF-TOKEN` atual a cada requisição, enviam `X-XSRF-TOKEN` e usam rotas relativas. Erros de sessão ou acesso também recebem mensagens específicas.

O teste no Edge com banco temporário confirmou: login sem recarregar a página, token antigo rejeitado com 419 e envio pelo diálogo corrigido concluído com 201. Os sete testes JavaScript passaram; build e ESLint aprovados. Executar `node --test tests/js/chat-realtime.test.mjs tests/js/chat-request.test.mjs` para verificar a regressão.
