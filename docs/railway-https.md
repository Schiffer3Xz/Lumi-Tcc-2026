# HTTPS, navegação e login no Railway

## Causa confirmada

Em 19/10/2026, a página pública respondia em HTTPS e carregava os assets
em HTTPS, mas o HTML de `@routes` continha a base do Ziggy em HTTP.
`ASSET_URL` corrige apenas os assets. Os componentes usam `route()` do
Ziggy e o formulário envia `useForm().post(route('login'))`, portanto o
esquema incorreto também afeta navegação, login e redirects.

O Railway termina TLS no proxy e encaminha a requisição ao Laravel.
O Laravel precisa confiar no proxy para interpretar `X-Forwarded-Proto`.
Não há URL HTTP fixa no formulário nem configuração Axios de baseURL a corrigir.

## Correção

- `config/trustedproxy.php`: confia no proxy do Railway quando existe
  `RAILWAY_ENVIRONMENT_ID`; permite configurar explicitamente `TRUSTED_PROXIES`.
- `bootstrap/app.php`: limita os headers confiáveis a protocolo, porta e IP.
  Não confia em `X-Forwarded-Host`. Os endereços são lidos da configuração
  pelo middleware depois do bootstrap, compatível com `config:cache`.
- Localmente, sem Railway nem proxies configurados, HTTP continua funcionando.
- CSRF, regeneração da sessão e validação de credenciais continuam habilitados.

## Publicação

1. Enviar os arquivos da correção ao GitHub, incluindo a configuração nova.
   Não enviar `.env`, `env.txt`, arquivos de cache nem credenciais.
2. No serviço web, ambiente `production`, configurar:

```dotenv
APP_ENV=production
APP_DEBUG=false
APP_URL=https://lumi-tcc-2026-production.up.railway.app
ASSET_URL=https://lumi-tcc-2026-production.up.railway.app
TRUSTED_PROXIES=*
SESSION_DRIVER=database
SESSION_SECURE_COOKIE=true
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=lax
SESSION_PATH=/
```

3. Remover `SESSION_DOMAIN` para deixar o cookie restrito ao host atual.
   Não usar `localhost`, uma URL com `https://` nem `.railway.app` como domínio.
   Se houver `SESSION_CONNECTION`, conferir se aponta para uma conexão existente.
4. Manter `APP_KEY` estável entre deploys. Manter as variáveis Reverb;
   esta correção não substitui nem desativa o servidor de WebSockets.
5. Conferir que o serviço usa o banco persistente correto e que a tabela
   `sessions` existe. Não usar o banco SQLite temporário da imagem para
   persistir usuários/sessões. Não rodar `migrate:fresh`, `db:wipe` ou seeders
   para corrigir HTTPS. Um banco local não é transferido automaticamente.
6. Aplicar as alterações pendentes e publicar o commit novo. Um simples
   restart de uma imagem antiga não inclui a correção. O build já executa
   `php artisan config:cache` segundo os logs recebidos: conferir que ele
   roda com as variáveis atualizadas, sem reutilizar `bootstrap/cache` local.
7. Se ainda houver cache antigo, no console do serviço em execução, executar
   nesta ordem (sem alterar dados do banco):

```sh
php artisan config:clear
php artisan route:clear
php artisan config:cache
```

Se o deploy usa `route:cache`, gerá-lo novamente após limpar as rotas.
Não é necessário mudar o Start Command do servidor para isso.

## Verificação no navegador após publicar

1. Abrir uma janela anônima e acessar a landing em HTTPS.
2. No Console, verificar `Ziggy.url`: deve começar com `https://`.
3. Clicar em Entrar, Cadastre-se e Catálogo. Conferir no Network que as
   requisições Inertia usam HTTPS e respondem normalmente, sem Mixed Content.
4. Testar login com uma conta existente no banco de produção. Conferir
   POST HTTPS `/login`, redirect HTTPS e acesso autenticado ao dashboard.
5. Testar senha inválida: a resposta deve mostrar erro no campo de e-mail.
6. Conferir cookies: sessão com Secure, HttpOnly, Path=/ e SameSite=Lax;
   XSRF-TOKEN disponível para o cliente, com Secure. Não divulgar os valores.
7. Se houver 419, conferir domínio/cookies, estabilidade da APP_KEY e
   persistência de sessões. Se houver 500, consultar o erro recente no
   backend. Não desabilitar CSRF nem ativar debug público.

## Validação local

`php artisan test --filter='RailwayNavigationTest|ProxyHttpsTest|AuthenticationTest'`

Os testes usam SQLite em memória, usuários de teste, requisições HTTP internas
com headers HTTPS do proxy e validação explícita de CSRF (inclusive 419 sem token).
Cobrem navegação, base do Ziggy, autenticação, erros compartilhados do Inertia,
cookies seguros e preservação de HTTP local. Não são um login real no Railway.

Referências:
- https://docs.railway.com/guides/laravel
- https://docs.railway.com/variables
