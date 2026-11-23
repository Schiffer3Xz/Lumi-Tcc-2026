# Moderação no Lumi

## Denúncias

Denúncias de publicações e comentários são registradas com o motivo e aguardam a revisão da escola. No painel administrativo, a equipe pode consultar o conteúdo registrado, atualizar a situação e salvar observações. A equipe também pode remover o conteúdo denunciado após confirmação. A denúncia e o registro da decisão são preservados.

## Atualização de uma instalação existente

Execute `php artisan migrate` para remover as colunas da antiga análise automática. A migração preserva os motivos, o conteúdo registrado e as decisões da equipe. Antes de atualizar os workers de uma instalação que usava a análise automática, descarte da fila somente os jobs pendentes da antiga moderação de denúncias.

## OpenAI

`MODERATION_ENABLED=true` ativa as verificações de texto e imagem, incluindo a análise de conteúdo extremista. As verificações de imagem usam a chave `OPENAI_API_KEY` do servidor.

`MODERATION_ENABLED=false` pula a moderação e mantém as validações de formulário e de upload. A configuração tem valor padrão `true` e substitui `OPENAI_MODERATION_ENABLED`. Se houver cache de configuração, execute `php artisan config:clear` após editar o `.env`.
