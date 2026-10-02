# Moderação de denúncias com OpenAI

A integração analisa somente o texto original da publicação registrado em `target_snapshot.content`. A documentação oficial do endpoint usado é https://developers.openai.com/api/docs/guides/moderation.

O serviço utiliza `POST https://api.openai.com/v1/moderations` com `omni-moderation-latest`, pelo cliente HTTP já disponível no Laravel. Nenhuma biblioteca nova foi adicionada.

## Ativação

1. Executar `php artisan migrate` para adicionar os campos de moderação.
2. Configurar `OPENAI_API_KEY` somente no `.env` do servidor ou no gerenciador de segredos do ambiente.
3. Definir `OPENAI_MODERATION_ENABLED=true`. A integração fica desativada por padrão.
4. Executar `php artisan config:clear` em desenvolvimento. Em produção, recriar o cache com `php artisan config:cache` e reiniciar o worker após mudanças de configuração.
5. Manter `php artisan queue:work --tries=3 --timeout=20` em execução. O `composer dev` existente também inicia um worker.
6. Compilar a interface com `npm run build`.

Não adicionar a chave a variáveis `VITE_*`, ao React, ao Git ou à conversa. Configure uma chave da plataforma API diretamente no servidor.

## Fluxo

- Uma nova denúncia é salva antes de solicitar qualquer análise externa.
- Se houver texto e a integração estiver habilitada, um job é enfileirado com o ID da denúncia e um token. O texto e dados pessoais não são incluídos no payload da fila.
- O worker lê o texto original registrado, envia apenas esse texto e o modelo para o endpoint fixo da OpenAI e salva as categorias e escores normalizados.
- Identidade do denunciante, nome do autor, motivo da denúncia, e-mails, imagens e conversas privadas não são incluídos como campos da requisição. O próprio texto pode conter dados pessoais escritos pelo autor; considere isso antes de habilitar a integração.
- O painel administrativo exibe o estado da análise e as categorias sinalizadas. Enquanto o modal está aberto com uma análise pendente, os dados são atualizados a cada cinco segundos, preservando as observações digitadas.
- A equipe mantém a decisão final. A classificação não exclui conteúdo, não altera a situação manual da denúncia nem aplica sanções.
- Denúncias antigas sem texto original registrado e publicações somente com imagens seguem para revisão manual.

## Falhas e proteção

Sem configuração, a denúncia permanece disponível para revisão manual. Falhas na fila ou na API não impedem o registro da denúncia. Requisições usam HTTPS, não seguem redirecionamentos e têm tempos limite de conexão e resposta. O job faz até três tentativas com intervalos de 60 e 180 segundos.

Exceções não incluem texto, respostas brutas ou credenciais. O token de cada análise impede que jobs antigos sobrescrevam resultados novos. Solicitações repetidas enquanto uma análise está pendente não criam jobs adicionais. A reanálise exige acesso administrativo e tem limite de seis requisições por minuto.

Escores são sinais do modelo, não probabilidades calibradas nem prova de infração. A análise de denúncias apoia a revisão manual. A criação e a edição de publicações também analisam o texto antes de salvar quando a integração está habilitada. Imagens e chats não são analisados neste fluxo.

## Verificação

Os testes usam `Http::fake` e `Queue::fake`, sem transmitir conteúdo real nem depender de credenciais. Para validar uma chamada real após a ativação, criar uma publicação de teste sem dados pessoais, denunciá-la e conferir a análise no painel com o worker em execução. Conferir também os cenários de indisponibilidade e acesso restrito antes da entrega.

## Publicação na rede social

Com OPENAI_MODERATION_ENABLED=true, o servidor analisa o texto antes de salvar a publicação ou sua edição. Se o texto for sinalizado ou a API estiver indisponível, nenhuma alteração ou imagem é salva; o formulário mantém o texto para revisão ou nova tentativa. A análise é síncrona e não depende da fila. Com a integração desabilitada, permanece o fluxo anterior. Publicações somente com imagem continuam disponíveis sem análise automática. A API não é um filtro de palavrões e não garante sinalizar toda ofensa.
