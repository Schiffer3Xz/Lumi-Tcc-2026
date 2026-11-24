<!DOCTYPE html>
<html lang="pt-BR">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <link rel="icon" type="image/png" href="{{ Vite::asset('resources/images/lumi-firefly.png') }}">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @routes
        @viteReactRefresh
        @vite('resources/js/app.tsx')
        @inertiaHead
        @unless ($__inertiaSsrResponse ?? null)
            <title inertia>Lumi</title>
        @endunless
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
