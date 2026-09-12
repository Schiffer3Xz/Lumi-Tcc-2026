@props(['title' => 'Painel administrativo', 'firstAccess' => false, 'step' => 1])
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $title }} - Sala de Leitura</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    @vite(['resources/css/admin.css', 'resources/js/admin.js'])
    {{ $head ?? '' }}
</head>
<body class="admin-app min-h-screen bg-[#F8FAFC] font-sans text-slate-700 antialiased selection:bg-yellow-200">
    <a href="#admin-content" class="sr-only fixed left-4 top-4 z-[60] rounded-xl bg-white p-3 text-sm font-semibold text-blue-700 shadow-lg focus:not-sr-only">Ir para o conteúdo</a>
    @if ($firstAccess)
        <main id="admin-content" class="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50/50 to-slate-200 px-4 py-10 sm:py-14" tabindex="-1">
            <div aria-hidden="true" class="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl"></div>
            <div aria-hidden="true" class="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-indigo-100/50 blur-3xl"></div>
            <div class="relative z-10 w-full max-w-2xl">
                <div class="mb-7 flex flex-col items-center text-center">
                    <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1A2332] text-2xl text-yellow-300 shadow-lg shadow-slate-900/10"><i class="fa-solid fa-feather-pointed" aria-hidden="true"></i></div>
                    <p class="text-xl font-bold tracking-tight text-slate-900">Sala de Leitura</p>
                    <p class="mt-1 text-xs text-slate-500">Plataforma Escolar Web · Administração</p>
                </div>
                <ol aria-label="Etapas do primeiro acesso" class="mb-6 grid grid-cols-2 gap-3">
                    @foreach ([1 => 'Configurar perfil', 2 => 'Verificar e-mail'] as $number => $label)
                        <li @if ($step == $number) aria-current="step" @endif class="flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-xs font-semibold {{ $step == $number ? 'border-yellow-300 bg-yellow-300/80 text-slate-900' : 'border-white/80 bg-white/60 text-slate-500' }}">
                            <span class="flex h-5 w-5 items-center justify-center rounded-full {{ $step == $number ? 'bg-[#1A2332] text-yellow-300' : 'bg-slate-200 text-slate-600' }}">{{ $number }}</span>{{ $label }}
                        </li>
                    @endforeach
                </ol>
                <x-admin.messages />
                <div class="admin-content">{{ $slot }}</div>
                <p class="mt-6 text-center text-xs text-slate-500"><i class="fa-solid fa-shield-halved mr-1.5 text-blue-600" aria-hidden="true"></i>Acesso administrativo · Sala de Leitura</p>
            </div>
        </main>
    @else
        <div class="flex min-h-screen">
            <x-admin.sidebar />
            <div class="flex min-w-0 flex-1 flex-col">
                <x-admin.topbar />
                <main id="admin-content" tabindex="-1" class="admin-content mx-auto w-full max-w-[1600px] flex-1 p-4 sm:p-6 lg:p-8">
                    <x-admin.section-nav />
                    <x-admin.messages />
                    {{ $slot }}
                </main>
                <footer class="px-6 py-5 text-center text-[11px] text-slate-400">Sala de Leitura · Painel administrativo</footer>
            </div>
        </div>
    @endif
    {{ $scripts ?? '' }}
</body>
</html>
